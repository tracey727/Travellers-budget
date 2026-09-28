import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Wayfarer account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getSessionUser().catch(() => null);
  if (user) redirect("/app");

  const { next } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-9 self-center">
        <Logo size="md" />
      </Link>

      <div className="wf-card">
        <h1 className="wf-display text-3xl font-semibold text-[var(--teal-deep)]">
          Welcome back
        </h1>
        <p className="wf-muted mt-1.5 text-sm">Log in to keep tracking every dollar.</p>

        <LoginForm next={next} />
      </div>

      <p className="wf-muted mt-6 text-center text-sm">
        New to Wayfarer?{" "}
        <Link href="/signup" className="font-semibold text-[var(--brass-deep)] hover:underline">
          Start free
        </Link>
      </p>
    </main>
  );
}
