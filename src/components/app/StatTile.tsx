export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="wf-card">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] wf-muted">{label}</p>
      <p className="wf-display mt-1.5 text-3xl font-semibold text-[var(--teal-deep)]">{value}</p>
      {hint && <p className="mt-1 text-xs wf-muted">{hint}</p>}
    </div>
  );
}
