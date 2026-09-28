"use client";

import { useActionState } from "react";
import { updateProfileAction, type FormState } from "@/lib/actions/account";
import { SubmitButton } from "@/components/SubmitButton";
import { CURRENCIES } from "@/lib/currencies";

export function ProfileForm({
  fullName,
  homeCurrency,
  email,
}: {
  fullName: string;
  homeCurrency: string;
  email: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(updateProfileAction, undefined);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      {state && "error" in state && <p className="wf-alert-error text-sm">{state.error}</p>}
      {state && "success" in state && <p className="wf-alert-ok text-sm">{state.success}</p>}

      <div>
        <label className="wf-label" htmlFor="email">
          Email
        </label>
        <input id="email" className="wf-input opacity-60" value={email} disabled readOnly />
      </div>

      <div>
        <label className="wf-label" htmlFor="fullName">
          Full name
        </label>
        <input id="fullName" name="fullName" className="wf-input" defaultValue={fullName} required maxLength={120} />
      </div>

      <div>
        <label className="wf-label" htmlFor="homeCurrency">
          Home currency
        </label>
        <select id="homeCurrency" name="homeCurrency" className="wf-input" defaultValue={homeCurrency}>
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs wf-muted">Used as the default currency for new trips.</p>
      </div>

      <SubmitButton className="wf-btn-primary px-6 py-2.5" pendingLabel="Saving…">
        Save profile
      </SubmitButton>
    </form>
  );
}
