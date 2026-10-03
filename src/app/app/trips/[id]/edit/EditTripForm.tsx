"use client";

import { useActionState, useState } from "react";
import { updateTripAction, type FormState } from "@/lib/actions/trips";
import { SubmitButton } from "@/components/SubmitButton";
import { CURRENCIES } from "@/lib/currencies";
import { Photo } from "@/components/Photo";
import { DESTINATION_PHOTO_KEYS, type PhotoKey } from "@/lib/photos";
import type { TripWithSpend } from "@/lib/data/queries";

export function EditTripForm({ trip }: { trip: TripWithSpend }) {
  const [state, formAction] = useActionState<FormState, FormData>(updateTripAction, undefined);
  const [photoKey, setPhotoKey] = useState<PhotoKey>((trip.coverPhotoKey ?? "mountains") as PhotoKey);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="tripId" value={trip.id} />
      <input type="hidden" name="coverPhotoKey" value={photoKey} />

      {state?.error && (
        <p role="alert" className="wf-alert-error">
          {state.error}
        </p>
      )}

      <div>
        <label className="wf-label" htmlFor="name">
          Trip name
        </label>
        <input id="name" name="name" className="wf-input" defaultValue={trip.name} required maxLength={120} />
      </div>

      <div>
        <label className="wf-label" htmlFor="destination">
          Destination
        </label>
        <input
          id="destination"
          name="destination"
          className="wf-input"
          defaultValue={trip.destination}
          required
          maxLength={120}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="wf-label" htmlFor="startDate">
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className="wf-input"
            defaultValue={trip.startDate}
            required
          />
        </div>
        <div>
          <label className="wf-label" htmlFor="endDate">
            End date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            className="wf-input"
            defaultValue={trip.endDate}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="wf-label" htmlFor="tripCurrency">
            Trip currency
          </label>
          <select
            id="tripCurrency"
            name="tripCurrency"
            className="wf-input"
            defaultValue={trip.tripCurrency}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="wf-label" htmlFor="totalBudget">
            Total budget
          </label>
          <input
            id="totalBudget"
            name="totalBudget"
            type="number"
            min={0}
            step="0.01"
            className="wf-input"
            defaultValue={trip.totalBudget}
            required
          />
        </div>
      </div>

      <div>
        <label className="wf-label">Cover photo</label>
        <div className="grid grid-cols-5 gap-2">
          {DESTINATION_PHOTO_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPhotoKey(key)}
              className={`relative aspect-square overflow-hidden rounded-lg transition ${
                photoKey === key ? "ring-2 ring-[var(--brass)] ring-offset-2" : "opacity-80 hover:opacity-100"
              }`}
              aria-pressed={photoKey === key}
              aria-label={`Choose cover photo: ${key}`}
            >
              <Photo photoKey={key} width={200} className="h-full w-full" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="wf-label" htmlFor="notes">
          Notes <span className="font-normal normal-case wf-muted">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="wf-input"
          defaultValue={trip.notes ?? ""}
          maxLength={2000}
        />
      </div>

      <SubmitButton className="wf-btn-primary w-full" pendingLabel="Saving…">
        Save changes
      </SubmitButton>
    </form>
  );
}
