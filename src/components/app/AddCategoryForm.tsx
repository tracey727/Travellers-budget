"use client";

import { useActionState, useState } from "react";
import { addCategoryAction, type FormState } from "@/lib/actions/categories";
import { CATEGORY_ICONS } from "@/lib/categories";
import { SubmitButton } from "@/components/SubmitButton";

export function AddCategoryForm({ tripId }: { tripId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<FormState, FormData>(addCategoryAction, undefined);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 text-sm font-semibold text-[var(--brass-deep)] hover:underline"
      >
        + Add category
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        await formAction(fd);
        setOpen(false);
      }}
      className="mt-3 rounded-xl border border-dashed border-black/15 p-4"
    >
      <input type="hidden" name="tripId" value={tripId} />
      {state?.error && <p className="wf-alert-error mb-3 text-sm">{state.error}</p>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input name="name" placeholder="Category name" className="wf-input" required maxLength={80} />
        <select name="icon" defaultValue="wallet" className="wf-input">
          {Object.keys(CATEGORY_ICONS).map((key) => (
            <option key={key} value={key}>
              {CATEGORY_ICONS[key]} {key}
            </option>
          ))}
        </select>
        <input
          name="allocatedAmount"
          type="number"
          min={0}
          step="0.01"
          placeholder="Budget"
          className="wf-input w-32"
          required
        />
      </div>
      <div className="mt-3 flex gap-2">
        <SubmitButton className="wf-btn-primary px-4 py-1.5 text-xs">Add</SubmitButton>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="wf-btn-secondary px-4 py-1.5 text-xs"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
