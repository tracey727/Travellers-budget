"use server";

import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { trips } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/require";
import { CURRENCIES } from "@/lib/currencies";
import { deriveStatus } from "@/lib/dates";
import { seedDefaultCategories } from "./auth";
import { DESTINATION_PHOTO_KEYS, type PhotoKey } from "@/lib/photos";

export type FormState = { error: string } | undefined;

const VALID_CURRENCIES = new Set(CURRENCIES.map((c) => c.code));
const VALID_PHOTO_KEYS = new Set(DESTINATION_PHOTO_KEYS);

const tripSchema = z
  .object({
    name: z.string().trim().min(1, "Give the trip a name.").max(120),
    destination: z.string().trim().min(1, "Where are you going?").max(120),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a start date."),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick an end date."),
    tripCurrency: z.string().refine((v) => VALID_CURRENCIES.has(v), "Choose a currency."),
    totalBudget: z.coerce.number().min(0, "Budget can't be negative.").max(100_000_000),
    coverPhotoKey: z.string().optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .refine((v) => v.endDate >= v.startDate, {
    message: "The trip can't end before it starts.",
    path: ["endDate"],
  });

async function ownedTrip(tripId: string, userId: string) {
  const rows = await db()
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createTripAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();

  const parsed = tripSchema.safeParse({
    name: formData.get("name"),
    destination: formData.get("destination"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    tripCurrency: formData.get("tripCurrency") || user.homeCurrency,
    totalBudget: formData.get("totalBudget") || 0,
    coverPhotoKey: formData.get("coverPhotoKey") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the trip details." };
  }
  const v = parsed.data;
  const photoKey: PhotoKey = VALID_PHOTO_KEYS.has(v.coverPhotoKey as PhotoKey)
    ? (v.coverPhotoKey as PhotoKey)
    : "mountains";

  const [trip] = await db()
    .insert(trips)
    .values({
      userId: user.id,
      name: v.name,
      destination: v.destination,
      startDate: v.startDate,
      endDate: v.endDate,
      tripCurrency: v.tripCurrency,
      homeCurrency: user.homeCurrency,
      totalBudget: v.totalBudget.toFixed(2),
      status: deriveStatus(v.startDate, v.endDate),
      coverPhotoKey: photoKey,
      notes: v.notes || null,
    })
    .returning();

  await seedDefaultCategories(trip.id);
  redirect(`/app/trips/${trip.id}`);
}

export async function updateTripAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const existing = await ownedTrip(tripId, user.id);
  if (!existing) return { error: "Trip not found." };

  const parsed = tripSchema.safeParse({
    name: formData.get("name"),
    destination: formData.get("destination"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    tripCurrency: formData.get("tripCurrency") || existing.tripCurrency,
    totalBudget: formData.get("totalBudget") || 0,
    coverPhotoKey: formData.get("coverPhotoKey") || existing.coverPhotoKey || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the trip details." };
  }
  const v = parsed.data;
  const photoKey: PhotoKey = VALID_PHOTO_KEYS.has(v.coverPhotoKey as PhotoKey)
    ? (v.coverPhotoKey as PhotoKey)
    : "mountains";

  await db()
    .update(trips)
    .set({
      name: v.name,
      destination: v.destination,
      startDate: v.startDate,
      endDate: v.endDate,
      tripCurrency: v.tripCurrency,
      totalBudget: v.totalBudget.toFixed(2),
      status: deriveStatus(v.startDate, v.endDate),
      coverPhotoKey: photoKey,
      notes: v.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(trips.id, tripId));

  redirect(`/app/trips/${tripId}`);
}

export async function deleteTripAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const existing = await ownedTrip(tripId, user.id);
  if (existing) {
    await db().delete(trips).where(eq(trips.id, tripId));
  }
  redirect("/app");
}
