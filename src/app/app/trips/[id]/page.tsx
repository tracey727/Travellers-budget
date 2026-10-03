import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require";
import { getTripDetail } from "@/lib/data/queries";
import { Photo } from "@/components/Photo";
import type { PhotoKey } from "@/lib/photos";
import { formatDate, tripLengthLabel } from "@/lib/dates";
import { formatMoney, formatMoneyCompact } from "@/lib/money";
import { StatTile } from "@/components/app/StatTile";
import { CategoryRow } from "@/components/app/CategoryRow";
import { AddCategoryForm } from "@/components/app/AddCategoryForm";
import { AddExpenseForm } from "@/components/app/AddExpenseForm";
import { ExpenseRow } from "@/components/app/ExpenseRow";
import { DeleteTripButton } from "@/components/app/DeleteTripButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await requireUser();
  const detail = await getTripDetail(id, user.id);
  return { title: detail ? detail.trip.name : "Trip" };
}

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
};

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const detail = await getTripDetail(id, user.id);
  if (!detail) notFound();

  const { trip, categories, expenses, uncategorizedSpent } = detail;
  const photoKey = (trip.coverPhotoKey ?? "mountains") as PhotoKey;
  const over = trip.remaining < 0;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl">
        <Photo photoKey={photoKey} width={1600} className="h-56 w-full sm:h-64" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-6">
          <div>
            <span className="wf-pill border-white/30 bg-black/40 text-white">
              {STATUS_LABEL[trip.status] ?? trip.status}
            </span>
            <h1 className="wf-display mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {trip.name}
            </h1>
            <p className="text-white/80">
              {trip.destination} · {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
              {tripLengthLabel(trip.startDate, trip.endDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Link href={`/app/trips/${trip.id}/edit`} className="wf-btn-secondary px-4 py-2 text-sm">
          Edit trip
        </Link>
        <DeleteTripButton tripId={trip.id} tripName={trip.name} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatTile label="Total budget" value={formatMoneyCompact(trip.totalBudget, trip.tripCurrency)} />
        <StatTile
          label="Spent so far"
          value={formatMoneyCompact(trip.spent, trip.tripCurrency)}
          hint={`${trip.percentSpent}% of budget`}
        />
        <StatTile
          label={over ? "Over budget" : "Remaining"}
          value={formatMoneyCompact(Math.abs(trip.remaining), trip.tripCurrency)}
          hint={over ? "Consider trimming a category" : "Still available to spend"}
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="wf-card h-fit">
          <h2 className="text-lg font-semibold text-[var(--teal-deep)]">Budget by category</h2>
          <div className="mt-2 divide-y divide-black/8">
            {categories.map((c) => (
              <CategoryRow key={c.id} category={c} tripId={trip.id} currency={trip.tripCurrency} />
            ))}
          </div>
          {uncategorizedSpent > 0 && (
            <p className="mt-3 text-xs wf-muted">
              Plus {formatMoney(uncategorizedSpent, trip.tripCurrency)} in uncategorized expenses.
            </p>
          )}
          <AddCategoryForm tripId={trip.id} />
        </div>

        <div className="space-y-6">
          <AddExpenseForm tripId={trip.id} tripCurrency={trip.tripCurrency} categories={categories} />

          <div className="wf-card">
            <h2 className="text-lg font-semibold text-[var(--teal-deep)]">
              Expenses <span className="wf-muted font-normal">({expenses.length})</span>
            </h2>
            {expenses.length === 0 ? (
              <p className="mt-4 text-sm wf-muted">
                No expenses logged yet. Add your first one above.
              </p>
            ) : (
              <div className="mt-2 divide-y divide-black/8">
                {expenses.map((e) => (
                  <ExpenseRow
                    key={e.id}
                    expense={e}
                    tripId={trip.id}
                    tripCurrency={trip.tripCurrency}
                    categories={categories}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
