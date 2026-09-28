const ROWS = [
  { icon: "✈️", name: "Flights", spent: 1180, allocated: 1200 },
  { icon: "🏨", name: "Accommodation", spent: 940, allocated: 1500 },
  { icon: "🍽️", name: "Food & Drink", spent: 410, allocated: 600 },
  { icon: "🎟️", name: "Activities", spent: 265, allocated: 400 },
];

/** A hand-built UI mockup, not a screenshot — always in sync with the real design. */
export function MockAppPreview() {
  const totalSpent = ROWS.reduce((s, r) => s + r.spent, 0);
  const totalBudget = 4200;
  const pct = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="wf-card-dark w-full max-w-md shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Trip budget
          </p>
          <h3 className="wf-display mt-0.5 text-2xl font-semibold">Japan, 12 days</h3>
        </div>
        <span className="wf-pill">Active</span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-white">${totalSpent.toLocaleString()} spent</span>
          <span className="text-white/55">of ${totalBudget.toLocaleString()}</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #88591c, #dca636)",
            }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3.5">
        {ROWS.map((r) => {
          const rowPct = Math.min(100, Math.round((r.spent / r.allocated) * 100));
          return (
            <div key={r.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-white/90">
                  <span aria-hidden>{r.icon}</span>
                  {r.name}
                </span>
                <span className="text-white/55">
                  ${r.spent} / ${r.allocated}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${rowPct}%`,
                    background:
                      rowPct >= 100
                        ? "linear-gradient(90deg, #8a2c2c, #c65a5a)"
                        : "linear-gradient(90deg, #164a4d, #2f8a8a)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
