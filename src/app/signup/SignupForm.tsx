"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signupAction, type AuthState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";
import { CURRENCIES } from "@/lib/currencies";

export function SignupForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(signupAction, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state?.error && (
        <p role="alert" className="wf-alert-error">
          {state.error}
        </p>
      )}

      <div>
        <label className="wf-label" htmlFor="fullName">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          className="wf-input"
          autoComplete="name"
          required
          maxLength={120}
        />
      </div>

      <div>
        <label className="wf-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="wf-input"
          autoComplete="email"
          inputMode="email"
          required
        />
      </div>

      <div>
        <label className="wf-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="wf-input"
          autoComplete="new-password"
          minLength={10}
          required
          aria-describedby="password-hint"
        />
        <p id="password-hint" className="wf-muted mt-1 text-xs">
          At least 10 characters.
        </p>
      </div>

      <div>
        <label className="wf-label" htmlFor="homeCurrency">
          Home currency
        </label>
        <select id="homeCurrency" name="homeCurrency" className="wf-input" defaultValue="USD">
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>

      <SubmitButton className="wf-btn-primary w-full" pendingLabel="Creating your account…">
        Create free account
      </SubmitButton>

      <p className="wf-muted text-center text-xs leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[var(--brass-deep)]">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-[var(--brass-deep)]">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
