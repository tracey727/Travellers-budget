"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<AuthState, FormData>(loginAction, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      {state?.error && (
        <p role="alert" className="wf-alert-error">
          {state.error}
        </p>
      )}

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
          autoComplete="current-password"
          required
        />
      </div>

      <SubmitButton className="wf-btn-primary w-full" pendingLabel="Logging in…">
        Log in
      </SubmitButton>
    </form>
  );
}
