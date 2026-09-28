"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { users, budgetCategories } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  destroySession,
  clearFailedLogins,
  recordFailedLogin,
  isLocked,
  purgeExpiredSessions,
} from "@/lib/auth/session";
import { CURRENCIES } from "@/lib/currencies";
import { DEFAULT_CATEGORY_TEMPLATE } from "@/lib/categories";

export type AuthState = { error: string } | undefined;

const VALID_CURRENCIES = new Set(CURRENCIES.map((c) => c.code));

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(10, "Use at least 10 characters."),
  homeCurrency: z
    .string()
    .refine((v) => VALID_CURRENCIES.has(v), "Choose a currency."),
});

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    homeCurrency: formData.get("homeCurrency") || "USD",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }
  const { fullName, email, password, homeCurrency } = parsed.data;

  const existing = await db()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing[0]) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db()
    .insert(users)
    .values({ fullName, email, passwordHash, homeCurrency })
    .returning({ id: users.id });

  await createSession(user.id);
  redirect("/app");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter your email and password." };
  }
  const { email, password } = parsed.data;
  const next = String(formData.get("next") ?? "");

  await purgeExpiredSessions();

  const rows = await db().select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];

  // Always run a hash verification, even for an unknown email, so the
  // response time and error message can't be used to enumerate accounts.
  const ok = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, await hashPassword("decoy-password-never-matches"));

  if (!user || (user && isLocked(user))) {
    if (user) return { error: "Too many attempts. Try again in a few minutes." };
    return { error: "Incorrect email or password." };
  }

  if (!ok) {
    await recordFailedLogin(user.id, user.failedLoginAttempts);
    return { error: "Incorrect email or password." };
  }

  await clearFailedLogins(user.id);
  await createSession(user.id);
  redirect(next && next.startsWith("/") ? next : "/app");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}

/** Seeds the standard travel budget categories for a brand-new trip. */
export async function seedDefaultCategories(tripId: string): Promise<void> {
  await db()
    .insert(budgetCategories)
    .values(
      DEFAULT_CATEGORY_TEMPLATE.map((c, i) => ({
        tripId,
        name: c.name,
        icon: c.icon,
        allocatedAmount: "0",
        sortOrder: i,
      })),
    );
}
