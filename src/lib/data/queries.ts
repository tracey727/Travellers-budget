import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { budgetCategories, expenses, trips, type Trip } from "@/lib/db/schema";
import { toNumber } from "@/lib/money";

export type TripWithSpend = Trip & { spent: number; remaining: number; percentSpent: number };

function withSpend(trip: Trip, spent: number): TripWithSpend {
  const budget = toNumber(trip.totalBudget);
  return {
    ...trip,
    spent,
    remaining: budget - spent,
    percentSpent: budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0,
  };
}

export async function getUserTrips(userId: string): Promise<TripWithSpend[]> {
  const rows = await db()
    .select()
    .from(trips)
    .where(eq(trips.userId, userId))
    .orderBy(desc(trips.startDate));

  if (rows.length === 0) return [];

  const spendRows = await db()
    .select({ tripId: expenses.tripId, amount: expenses.amountInTripCurrency })
    .from(expenses)
    .innerJoin(trips, eq(expenses.tripId, trips.id))
    .where(eq(trips.userId, userId));

  const spendByTrip = new Map<string, number>();
  for (const r of spendRows) {
    spendByTrip.set(r.tripId, (spendByTrip.get(r.tripId) ?? 0) + toNumber(r.amount));
  }

  return rows.map((t) => withSpend(t, spendByTrip.get(t.id) ?? 0));
}

export type CategoryWithSpend = {
  id: string;
  name: string;
  icon: string;
  allocatedAmount: string;
  sortOrder: number;
  spent: number;
  remaining: number;
  percentSpent: number;
};

export type ExpenseWithCategory = {
  id: string;
  description: string;
  amount: string;
  currency: string;
  amountInTripCurrency: string;
  exchangeRate: string;
  spentOn: string;
  paymentMethod: string;
  notes: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
};

export type TripDetail = {
  trip: TripWithSpend;
  categories: CategoryWithSpend[];
  expenses: ExpenseWithCategory[];
  uncategorizedSpent: number;
};

export async function getTripDetail(tripId: string, userId: string): Promise<TripDetail | null> {
  const tripRows = await db()
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, userId)))
    .limit(1);
  const trip = tripRows[0];
  if (!trip) return null;

  const categoryRows = await db()
    .select()
    .from(budgetCategories)
    .where(eq(budgetCategories.tripId, tripId))
    .orderBy(budgetCategories.sortOrder);

  const expenseRows = await db()
    .select({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.amount,
      currency: expenses.currency,
      amountInTripCurrency: expenses.amountInTripCurrency,
      exchangeRate: expenses.exchangeRate,
      spentOn: expenses.spentOn,
      paymentMethod: expenses.paymentMethod,
      notes: expenses.notes,
      categoryId: expenses.categoryId,
      categoryName: budgetCategories.name,
      categoryIcon: budgetCategories.icon,
    })
    .from(expenses)
    .leftJoin(budgetCategories, eq(expenses.categoryId, budgetCategories.id))
    .where(eq(expenses.tripId, tripId))
    .orderBy(desc(expenses.spentOn), desc(expenses.createdAt));

  const spentByCategory = new Map<string, number>();
  let uncategorizedSpent = 0;
  let totalSpent = 0;
  for (const e of expenseRows) {
    const amount = toNumber(e.amountInTripCurrency);
    totalSpent += amount;
    if (e.categoryId) {
      spentByCategory.set(e.categoryId, (spentByCategory.get(e.categoryId) ?? 0) + amount);
    } else {
      uncategorizedSpent += amount;
    }
  }

  const categories: CategoryWithSpend[] = categoryRows.map((c) => {
    const spent = spentByCategory.get(c.id) ?? 0;
    const allocated = toNumber(c.allocatedAmount);
    return {
      id: c.id,
      name: c.name,
      icon: c.icon,
      allocatedAmount: c.allocatedAmount,
      sortOrder: c.sortOrder,
      spent,
      remaining: allocated - spent,
      percentSpent: allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0,
    };
  });

  return {
    trip: withSpend(trip, totalSpent),
    categories,
    expenses: expenseRows,
    uncategorizedSpent,
  };
}

export type DashboardStats = {
  tripCount: number;
  planningCount: number;
  activeCount: number;
  completedCount: number;
  upcomingTrip: TripWithSpend | null;
};

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const all = await getUserTrips(userId);
  const upcoming = all
    .filter((t) => t.status !== "completed")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

  return {
    tripCount: all.length,
    planningCount: all.filter((t) => t.status === "planning").length,
    activeCount: all.filter((t) => t.status === "active").length,
    completedCount: all.filter((t) => t.status === "completed").length,
    upcomingTrip: upcoming ?? null,
  };
}
