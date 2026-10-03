"use client";

import { useActionState, useState } from "react";
import { updateCategoryAction, deleteCategoryAction, type FormState } from "@/lib/actions/categories";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_ICONS } from "@/lib/categories";
import { formatMoneyCompact } from "@/lib/money";
import { SubmitButton } from "@/components/SubmitButton";
import type { CategoryWithSpend } from "@/lib/data/queries";

export function CategoryRow({
  category,
  tripId,
  currency,
}: {
  category: CategoryWithSpend;
  tripId: string;
  currency: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState<FormState, FormData>(
    updateCategoryAction,
    undefined,
  );
  const over = category.remaining < 0;
  const allocated = Number.parseFloat(category.allocatedAmount);

  if (editing) {
    return (
      <form
        action={async (fd) => {
          await formAction(fd);
          setEditing(false);
        }}
        className="rounded-xl border border-black/10 bg-black/[0.02] p-4"
      >
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="categoryId" value={category.id} />
        {state?.error && <p className="wf-alert-error mb-3 text-sm">{state.error}</p>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            name="name"
            defaultValue={category.name}
            className="wf-input"
            maxLength={80}
            required
          />
          <select name="icon" defaultValue={category.icon} className="wf-input">
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
            defaultValue={allocated}
            className="wf-input w-32"
            required
          />
        </div>
        <div className="mt-3 flex gap-2">
          <SubmitButton className="wf-btn-primary px-4 py-1.5 text-xs">Save</SubmitButton>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="wf-btn-secondary px-4 py-1.5 text-xs"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="group rounded-xl px-1 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm font-medium text-[var(--teal-deep)]">
          <CategoryIcon icon={category.icon} className="text-lg" />
          {category.name}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm wf-muted">
            {formatMoneyCompact(category.spent, currency)} /{" "}
            {formatMoneyCompact(category.allocatedAmount, currency)}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-semibold text-[var(--brass-deep)] opacity-0 transition group-hover:opacity-100"
          >
            Edit
          </button>
          <form action={deleteCategoryAction}>
            <input type="hidden" name="tripId" value={tripId} />
            <input type="hidden" name="categoryId" value={category.id} />
            <button
              type="submit"
              className="text-xs font-semibold text-[#b13a3a] opacity-0 transition group-hover:opacity-100"
            >
              Remove
            </button>
          </form>
        </div>
      </div>
      <div className="wf-track mt-2">
        <div
          className={over ? "wf-fill-over" : "wf-fill"}
          style={{ width: `${Math.min(100, category.percentSpent)}%` }}
        />
      </div>
      {over && (
        <p className="mt-1 text-xs font-semibold text-[#b13a3a]">
          {formatMoneyCompact(Math.abs(category.remaining), currency)} over
        </p>
      )}
    </div>
  );
}
