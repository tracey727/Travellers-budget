import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "./SignupForm";
import { Logo } from "@/components/Logo";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Start free",
  description: "Create your Wayfarer account — free, no card required.",
};

export default async function SignupPage() {
  const user = await getSessionUser().catch(() => null);
  if (user) redirect("/app");

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-9 self-center">
        <Logo size="md" />
      </Link>

      <div className="wf-card">
        <h1 className="wf-display text-3xl font-semibold text-[var(--teal-deep)]">
          Start planning
        </h1>
        <p className="wf-muted mt-1.5 text-sm">
          Free to use. No card, no bank connection.
        </p>

        <SignupForm />
      </div>

      <p className="wf-muted mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--brass-deep)] hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
