import Link from "next/link";

export function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="wf-card flex flex-col items-center py-16 text-center">
      <h3 className="wf-display text-2xl font-semibold text-[var(--teal-deep)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm wf-muted">{body}</p>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref} className="wf-btn-primary mt-6 px-6 py-2.5">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
