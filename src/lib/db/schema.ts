import {
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* -------------------------------------------------------------------------- */
/*                                   Users                                    */
/* -------------------------------------------------------------------------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: text("full_name").notNull(),
    // ISO 4217 code. Every trip defaults to this; every expense converts back to it.
    homeCurrency: text("home_currency").notNull().default("USD"),
    // Brute-force protection: consecutive failed logins since the last
    // success, and how long a lock the most recent run of failures earned.
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/* -------------------------------------------------------------------------- */
/*                                   Trips                                    */
/* -------------------------------------------------------------------------- */

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    destination: text("destination").notNull(),
    coverPhotoUrl: text("cover_photo_url"),
    /** A short key into the curated photo set — lets the UI re-pick a fallback. */
    coverPhotoKey: text("cover_photo_key"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    /** ISO 4217 — the currency this trip is budgeted and mostly spent in. */
    tripCurrency: text("trip_currency").notNull().default("USD"),
    /** Snapshot of the user's home currency at creation, for conversions. */
    homeCurrency: text("home_currency").notNull().default("USD"),
    /** Total budget, in trip currency. */
    totalBudget: numeric("total_budget", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    /** 'planning' | 'active' | 'completed' */
    status: text("status").notNull().default("planning"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("trips_user_idx").on(t.userId),
    index("trips_user_status_idx").on(t.userId, t.status),
  ],
);

export const budgetCategories = pgTable(
  "budget_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    /** A short icon key resolved to an emoji/glyph in the UI layer. */
    icon: text("icon").notNull().default("wallet"),
    /** Allocated amount, in trip currency. */
    allocatedAmount: numeric("allocated_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("budget_categories_trip_idx").on(t.tripId)],
);

export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => budgetCategories.id, {
      onDelete: "set null",
    }),
    description: text("description").notNull(),
    /** The amount as the traveller actually paid it. */
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    /** ISO 4217 — usually the trip currency, but a one-off foreign charge is allowed. */
    currency: text("currency").notNull(),
    /** `amount` converted to the trip's currency, using `exchangeRate`. */
    amountInTripCurrency: numeric("amount_in_trip_currency", {
      precision: 12,
      scale: 2,
    }).notNull(),
    /** units of trip currency per 1 unit of `currency`; 1 when they match. */
    exchangeRate: numeric("exchange_rate", { precision: 12, scale: 6 })
      .notNull()
      .default("1"),
    spentOn: date("spent_on").notNull(),
    paymentMethod: text("payment_method").notNull().default("card"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("expenses_trip_idx").on(t.tripId, t.spentOn),
    index("expenses_category_idx").on(t.categoryId),
  ],
);

/* -------------------------------------------------------------------------- */
/*                                 Relations                                  */
/* -------------------------------------------------------------------------- */

export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
  sessions: many(sessions),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
  categories: many(budgetCategories),
  expenses: many(expenses),
}));

export const budgetCategoriesRelations = relations(budgetCategories, ({ one, many }) => ({
  trip: one(trips, { fields: [budgetCategories.tripId], references: [trips.id] }),
  expenses: many(expenses),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  trip: one(trips, { fields: [expenses.tripId], references: [trips.id] }),
  category: one(budgetCategories, {
    fields: [expenses.categoryId],
    references: [budgetCategories.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type NewBudgetCategory = typeof budgetCategories.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
