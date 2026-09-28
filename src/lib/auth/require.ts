import { redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "./session";

/** Guards a server component or action; redirects to login when signed out. */
export async function requireUser(nextPath?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect(nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login");
  }
  return user;
}

/** Throws nothing, redirects nowhere — for API routes that reply with JSON. */
export async function requireUserApi(): Promise<SessionUser | null> {
  return getSessionUser();
}
