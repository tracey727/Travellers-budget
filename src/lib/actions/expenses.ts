"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { expenses, trips } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/require";
import { CURRENCIES } from "@/lib/currencies";
import { PAYMENT_METHODS } from "@/lib/categories";

export type FormState = { error: string } | undefined;

const VALID_CURRENCIES = new Set(CURRENCIES.map((c) => c.code));
const VALID_METHODS = new Set(PAYMENT_METHODS.map((m) => m.value));

const expenseSchema = z.object({
  tripId: z.string().uuid(),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  description: z.string().trim().min(1, "What was it for?").max(160),
  amount: z.coerce.number().positive("Enter an amount greater than zero.").max(100_000_000),
  currency: z.string().refine((v) => VALID_CURRENCIES.has(v), "Choose a currency."),
  exchangeRate: z.coerce.number().positive("Exchange rate must be positive.").max(1_000_000),
  spentOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date."),
  paymentMethod: z.string().refine((v) => VALID_METHODS.has(v), "Choose a payment method."),
  notes: z.string().trim().max(2000).optional(),
});

async function loadOwnedTrip(tripId: string, userId: string) {
  const rows = await db()
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

function parseForm(formData: FormData, fallbackCurrency: string) {
  return expenseSchema.safeParse({
    tripId: formData.get("tripId"),
    categoryId: formData.get("categoryId") || "",
    description: formData.get("description"),
    amount: formData.get("amount"),
    currency: formData.get("currency") || fallbackCurrency,
    exchangeRate: formData.get("exchangeRate") || 1,
    spentOn: formData.get("spentOn"),
    paymentMethod: formData.get("paymentMethod") || "card",
    notes: formData.get("notes") || undefined,
  });
}

export async function addExpenseAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const trip = await loadOwnedTrip(tripId, user.id);
  if (!trip) return { error: "Trip not found." };

  const parsed = parseForm(formData, trip.tripCurrency);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the expense." };
  const v = parsed.data;

  const rate = v.currency === trip.tripCurrency ? 1 : v.exchangeRate;
  const amountInTripCurrency = v.amount * rate;

  await db()
    .insert(expenses)
    .values({
      tripId,
      categoryId: v.categoryId || null,
      description: v.description,
      amount: v.amount.toFixed(2),
      currency: v.currency,
      amountInTripCurrency: amountInTripCurrency.toFixed(2),
      exchangeRate: rate.toFixed(6),
      spentOn: v.spentOn,
      paymentMethod: v.paymentMethod,
      notes: v.notes || null,
    });

  revalidatePath(`/app/trips/${tripId}`);
}

export async function updateExpenseAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const expenseId = String(formData.get("expenseId") ?? "");
  const trip = await loadOwnedTrip(tripId, user.id);
  if (!trip) return { error: "Trip not found." };

  const parsed = parseForm(formData, trip.tripCurrency);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the expense." };
  const v = parsed.data;

  const rate = v.currency === trip.tripCurrency ? 1 : v.exchangeRate;
  const amountInTripCurrency = v.amount * rate;

  await db()
    .update(expenses)
    .set({
      categoryId: v.categoryId || null,
      description: v.description,
      amount: v.amount.toFixed(2),
      currency: v.currency,
      amountInTripCurrency: amountInTripCurrency.toFixed(2),
      exchangeRate: rate.toFixed(6),
      spentOn: v.spentOn,
      paymentMethod: v.paymentMethod,
      notes: v.notes || null,
      updatedAt: new Date(),
    })
    .where(and(eq(expenses.id, expenseId), eq(expenses.tripId, tripId)));

  revalidatePath(`/app/trips/${tripId}`);
}

export async function deleteExpenseAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const expenseId = String(formData.get("expenseId") ?? "");
  const trip = await loadOwnedTrip(tripId, user.id);
  if (trip) {
    await db()
      .delete(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.tripId, tripId)));
  }
  revalidatePath(`/app/trips/${tripId}`);
}
