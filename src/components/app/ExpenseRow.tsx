"use client";

import { useActionState, useState } from "react";
import { updateExpenseAction, deleteExpenseAction, type FormState } from "@/lib/actions/expenses";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_ICONS, PAYMENT_METHODS } from "@/lib/categories";
import { CURRENCIES } from "@/lib/currencies";
import { formatMoney, formatMoneyCompact } from "@/lib/money";
import { formatDateShort } from "@/lib/dates";
import { SubmitButton } from "@/components/SubmitButton";
import type { CategoryWithSpend, ExpenseWithCategory } from "@/lib/data/queries";

export function ExpenseRow({
  expense,
  tripId,
  tripCurrency,
  categories,
}: {
  expense: ExpenseWithCategory;
  tripId: string;
  tripCurrency: string;
  categories: CategoryWithSpend[];
}) {
  const [editing, setEditing] = useState(false);
  const [currency, setCurrency] = useState(expense.currency);
  const [state, formAction] = useActionState<FormState, FormData>(
    updateExpenseAction,
    undefined,
  );
  const showRate = currency !== tripCurrency;
  const converted = expense.currency !== tripCurrency;

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
        <input type="hidden" name="expenseId" value={expense.id} />
        {state?.error && <p className="wf-alert-error mb-3 text-sm">{state.error}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="description"
            defaultValue={expense.description}
            className="wf-input sm:col-span-2"
            required
            maxLength={160}
          />
          <select name="categoryId" defaultValue={expense.categoryId ?? ""} className="wf-input">
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {CATEGORY_ICONS[c.icon] ?? "💳"} {c.name}
              </option>
            ))}
          </select>
          <input name="spentOn" type="date" defaultValue={expense.spentOn} className="wf-input" required />
          <input
            name="amount"
            type="number"
            min={0.01}
            step="0.01"
            defaultValue={expense.amount}
            className="wf-input"
            required
          />
          <select
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="wf-input"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
          {showRate && (
            <input
              name="exchangeRate"
              type="number"
              min={0.000001}
              step="0.000001"
              defaultValue={expense.exchangeRate}
              className="wf-input sm:col-span-2"
              required
            />
          )}
          <select name="paymentMethod" defaultValue={expense.paymentMethod} className="wf-input">
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <input
            name="notes"
            defaultValue={expense.notes ?? ""}
            className="wf-input sm:col-span-2"
            maxLength={2000}
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
    <div className="group flex items-center justify-between gap-3 rounded-lg px-1 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <CategoryIcon icon={expense.categoryIcon ?? "wallet"} className="text-lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--teal-deep)]">
            {expense.description}
          </p>
          <p className="text-xs wf-muted">
            {formatDateShort(expense.spentOn)} · {expense.categoryName ?? "Uncategorized"}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-[var(--teal-deep)]">
            {formatMoneyCompact(expense.amountInTripCurrency, tripCurrency)}
          </p>
          {converted && (
            <p className="text-xs wf-muted">{formatMoney(expense.amount, expense.currency)}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-semibold text-[var(--brass-deep)] opacity-0 transition group-hover:opacity-100"
        >
          Edit
        </button>
        <form action={deleteExpenseAction}>
          <input type="hidden" name="tripId" value={tripId} />
          <input type="hidden" name="expenseId" value={expense.id} />
          <button
            type="submit"
            className="text-xs font-semibold text-[#b13a3a] opacity-0 transition group-hover:opacity-100"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
