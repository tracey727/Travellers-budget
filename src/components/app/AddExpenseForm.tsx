"use client";

import { useActionState, useState } from "react";
import { addExpenseAction, type FormState } from "@/lib/actions/expenses";
import { SubmitButton } from "@/components/SubmitButton";
import { CURRENCIES } from "@/lib/currencies";
import { CATEGORY_ICONS, PAYMENT_METHODS } from "@/lib/categories";
import { today } from "@/lib/dates";
import type { CategoryWithSpend } from "@/lib/data/queries";

export function AddExpenseForm({
  tripId,
  tripCurrency,
  categories,
}: {
  tripId: string;
  tripCurrency: string;
  categories: CategoryWithSpend[];
}) {
  const [state, formAction] = useActionState<FormState, FormData>(addExpenseAction, undefined);
  const [currency, setCurrency] = useState(tripCurrency);
  const showRate = currency !== tripCurrency;

  return (
    <form action={formAction} className="wf-card">
      <input type="hidden" name="tripId" value={tripId} />
      <h3 className="text-lg font-semibold text-[var(--teal-deep)]">Add an expense</h3>

      {state?.error && <p className="wf-alert-error mt-3 text-sm">{state.error}</p>}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="wf-label" htmlFor="description">
            What was it for?
          </label>
          <input
            id="description"
            name="description"
            className="wf-input"
            placeholder="Dinner in Gion"
            required
            maxLength={160}
          />
        </div>

        <div>
          <label className="wf-label" htmlFor="category">
            Category
          </label>
          <select id="category" name="categoryId" className="wf-input" defaultValue="">
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {CATEGORY_ICONS[c.icon] ?? "💳"} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="wf-label" htmlFor="spentOn">
            Date
          </label>
          <input
            id="spentOn"
            name="spentOn"
            type="date"
            className="wf-input"
            defaultValue={today()}
            required
          />
        </div>

        <div>
          <label className="wf-label" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={0.01}
            step="0.01"
            className="wf-input"
            required
          />
        </div>

        <div>
          <label className="wf-label" htmlFor="currency">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            className="wf-input"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {showRate && (
          <div className="sm:col-span-2">
            <label className="wf-label" htmlFor="exchangeRate">
              Exchange rate — 1 {currency} equals how many {tripCurrency}?
            </label>
            <input
              id="exchangeRate"
              name="exchangeRate"
              type="number"
              min={0.000001}
              step="0.000001"
              className="wf-input"
              defaultValue={1}
              required
            />
          </div>
        )}

        <div>
          <label className="wf-label" htmlFor="paymentMethod">
            Paid with
          </label>
          <select id="paymentMethod" name="paymentMethod" className="wf-input" defaultValue="card">
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="wf-label" htmlFor="notes">
            Notes <span className="font-normal normal-case wf-muted">(optional)</span>
          </label>
          <input id="notes" name="notes" className="wf-input" maxLength={2000} />
        </div>
      </div>

      <SubmitButton className="wf-btn-primary mt-4 w-full sm:w-auto sm:px-8" pendingLabel="Adding…">
        Add expense
      </SubmitButton>
    </form>
  );
}
