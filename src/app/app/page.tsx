import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/require";
import { getUserTrips, getDashboardStats } from "@/lib/data/queries";
import { TripCard } from "@/components/app/TripCard";
import { StatTile } from "@/components/app/StatTile";
import { EmptyState } from "@/components/app/EmptyState";
import { daysUntil } from "@/lib/dates";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const [trips, stats] = await Promise.all([getUserTrips(user.id), getDashboardStats(user.id)]);

  const upcoming = stats.upcomingTrip;
  const untilLabel = upcoming
    ? (() => {
        const d = daysUntil(upcoming.startDate);
        if (d > 0) return `In ${d} day${d === 1 ? "" : "s"}`;
        if (d === 0) return "Starts today";
        return "In progress";
      })()
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="wf-display text-3xl font-semibold text-[var(--teal-deep)]">
            Your trips
          </h1>
          <p className="mt-1 wf-muted">Every budget you&apos;re planning or already living.</p>
        </div>
        <Link href="/app/trips/new" className="wf-btn-primary px-5 py-2.5">
          + New trip
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatTile label="Trips" value={String(stats.tripCount)} />
        <StatTile
          label="Active now"
          value={String(stats.activeCount)}
          hint={`${stats.planningCount} planning · ${stats.completedCount} completed`}
        />
        <StatTile
          label="Next up"
          value={upcoming ? upcoming.name : "—"}
          hint={untilLabel ?? "Nothing scheduled"}
        />
      </div>

      <div className="mt-10">
        {trips.length === 0 ? (
          <EmptyState
            title="No trips yet"
            body="Create your first trip and Wayfarer will set up flights, stays, food and the rest of your budget categories automatically."
            ctaHref="/app/trips/new"
            ctaLabel="Create your first trip"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
