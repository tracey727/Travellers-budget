"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/require";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { CURRENCIES } from "@/lib/currencies";

export type FormState = { error: string } | { success: string } | undefined;

const VALID_CURRENCIES = new Set(CURRENCIES.map((c) => c.code));

const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name.").max(120),
  homeCurrency: z.string().refine((v) => VALID_CURRENCIES.has(v), "Choose a currency."),
});

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    homeCurrency: formData.get("homeCurrency"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };

  await db()
    .update(users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/app/settings");
  return { success: "Profile updated." };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(10, "Use at least 10 characters."),
  });

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your details." };

  const rows = await db().select().from(users).where(eq(users.id, user.id)).limit(1);
  const full = rows[0];
  if (!full || !(await verifyPassword(parsed.data.currentPassword, full.passwordHash))) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db()
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  return { success: "Password changed." };
}
