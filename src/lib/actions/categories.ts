"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { budgetCategories, trips } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/require";
import { CATEGORY_ICONS } from "@/lib/categories";

export type FormState = { error: string } | undefined;

const VALID_ICONS = new Set(Object.keys(CATEGORY_ICONS));

const categorySchema = z.object({
  tripId: z.string().uuid(),
  name: z.string().trim().min(1, "Name the category.").max(80),
  icon: z.string().refine((v) => VALID_ICONS.has(v), "Choose an icon."),
  allocatedAmount: z.coerce.number().min(0).max(100_000_000),
});

async function assertOwnsTrip(tripId: string, userId: string) {
  const rows = await db()
    .select({ id: trips.id })
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, userId)))
    .limit(1);
  return Boolean(rows[0]);
}

export async function addCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = categorySchema.safeParse({
    tripId: formData.get("tripId"),
    name: formData.get("name"),
    icon: formData.get("icon") || "wallet",
    allocatedAmount: formData.get("allocatedAmount") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the category." };
  const v = parsed.data;

  if (!(await assertOwnsTrip(v.tripId, user.id))) return { error: "Trip not found." };

  const existingRows = await db()
    .select({ id: budgetCategories.id })
    .from(budgetCategories)
    .where(eq(budgetCategories.tripId, v.tripId));

  await db()
    .insert(budgetCategories)
    .values({
      tripId: v.tripId,
      name: v.name,
      icon: v.icon,
      allocatedAmount: v.allocatedAmount.toFixed(2),
      sortOrder: (existingRows.length + 1) * 100,
    });

  revalidatePath(`/app/trips/${v.tripId}`);
}

export async function updateCategoryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const categoryId = String(formData.get("categoryId") ?? "");
  const parsed = categorySchema.safeParse({
    tripId: formData.get("tripId"),
    name: formData.get("name"),
    icon: formData.get("icon") || "wallet",
    allocatedAmount: formData.get("allocatedAmount") || 0,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the category." };
  const v = parsed.data;

  if (!(await assertOwnsTrip(v.tripId, user.id))) return { error: "Trip not found." };

  await db()
    .update(budgetCategories)
    .set({ name: v.name, icon: v.icon, allocatedAmount: v.allocatedAmount.toFixed(2) })
    .where(and(eq(budgetCategories.id, categoryId), eq(budgetCategories.tripId, v.tripId)));

  revalidatePath(`/app/trips/${v.tripId}`);
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const categoryId = String(formData.get("categoryId") ?? "");
  const tripId = String(formData.get("tripId") ?? "");
  if (await assertOwnsTrip(tripId, user.id)) {
    await db()
      .delete(budgetCategories)
      .where(and(eq(budgetCategories.id, categoryId), eq(budgetCategories.tripId, tripId)));
  }
  revalidatePath(`/app/trips/${tripId}`);
}
