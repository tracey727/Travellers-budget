"use client";

import { deleteTripAction } from "@/lib/actions/trips";

export function DeleteTripButton({ tripId, tripName }: { tripId: string; tripName: string }) {
  return (
    <form
      action={deleteTripAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${tripName}"? This removes every category and expense in it.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="tripId" value={tripId} />
      <button type="submit" className="wf-btn-secondary px-4 py-2 text-sm text-[#b13a3a]">
        Delete trip
      </button>
    </form>
  );
}
