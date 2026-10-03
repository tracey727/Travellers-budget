import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/require";
import { NewTripForm } from "./NewTripForm";

export const metadata: Metadata = { title: "New trip" };

export default async function NewTripPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="wf-display text-3xl font-semibold text-[var(--teal-deep)]">
        Plan a new trip
      </h1>
      <p className="mt-1 wf-muted">
        Standard budget categories — flights, stays, food, activities and more — are added
        automatically. You can rename or remove any of them afterwards.
      </p>

      <div className="wf-card mt-8">
        <NewTripForm defaultCurrency={user.homeCurrency} />
      </div>
    </div>
  );
}
