import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require";
import { getTripDetail } from "@/lib/data/queries";
import { EditTripForm } from "./EditTripForm";

export const metadata: Metadata = { title: "Edit trip" };

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const detail = await getTripDetail(id, user.id);
  if (!detail) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="wf-display text-3xl font-semibold text-[var(--teal-deep)]">Edit trip</h1>
      <div className="wf-card mt-8">
        <EditTripForm trip={detail.trip} />
      </div>
    </div>
  );
}
