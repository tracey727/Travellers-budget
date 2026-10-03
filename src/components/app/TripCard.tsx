import Link from "next/link";
import { Photo } from "@/components/Photo";
import type { PhotoKey } from "@/lib/photos";
import { formatMoneyCompact } from "@/lib/money";
import { formatDate, tripLengthLabel } from "@/lib/dates";
import type { TripWithSpend } from "@/lib/data/queries";

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
};

export function TripCard({ trip }: { trip: TripWithSpend }) {
  const photoKey = (trip.coverPhotoKey ?? "mountains") as PhotoKey;
  const over = trip.remaining < 0;

  return (
    <Link
      href={`/app/trips/${trip.id}`}
      className="group block overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative h-40">
        <Photo photoKey={photoKey} width={800} className="h-full w-full" />
        <span className="wf-pill absolute right-3 top-3 border-white/30 bg-black/40 text-white">
          {STATUS_LABEL[trip.status] ?? trip.status}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="wf-display text-xl font-semibold text-white">{trip.name}</h3>
          <p className="text-sm text-white/80">{trip.destination}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="wf-muted">
            {formatDate(trip.startDate)} · {tripLengthLabel(trip.startDate, trip.endDate)}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between text-sm">
          <span className="font-semibold text-[var(--teal-deep)]">
            {formatMoneyCompact(trip.spent, trip.tripCurrency)} spent
          </span>
          <span className="wf-muted">
            of {formatMoneyCompact(trip.totalBudget, trip.tripCurrency)}
          </span>
        </div>
        <div className="wf-track mt-2">
          <div
            className={over ? "wf-fill-over" : "wf-fill"}
            style={{ width: `${Math.min(100, trip.percentSpent)}%` }}
          />
        </div>
        {over && (
          <p className="mt-1.5 text-xs font-semibold text-[#b13a3a]">
            {formatMoneyCompact(Math.abs(trip.remaining), trip.tripCurrency)} over budget
          </p>
        )}
      </div>
    </Link>
  );
}
