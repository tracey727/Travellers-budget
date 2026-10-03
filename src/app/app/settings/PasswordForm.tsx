"use client";

import { useActionState, useRef } from "react";
import { changePasswordAction, type FormState } from "@/lib/actions/account";
import { SubmitButton } from "@/components/SubmitButton";

export function PasswordForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    changePasswordAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await formAction(fd);
        formRef.current?.reset();
      }}
      className="mt-4 space-y-4"
    >
      {state && "error" in state && <p className="wf-alert-error text-sm">{state.error}</p>}
      {state && "success" in state && <p className="wf-alert-ok text-sm">{state.success}</p>}

      <div>
        <label className="wf-label" htmlFor="currentPassword">
          Current password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className="wf-input"
          autoComplete="current-password"
          required
        />
      </div>

      <div>
        <label className="wf-label" htmlFor="newPassword">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="wf-input"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </div>

      <SubmitButton className="wf-btn-primary px-6 py-2.5" pendingLabel="Updating…">
        Change password
      </SubmitButton>
    </form>
  );
}
