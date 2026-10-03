/** Every stored money value is a decimal string (Postgres `numeric`). Parse before arithmetic. */
export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const n = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/** Formats a decimal-string or number as currency, e.g. "$1,240.50". */
export function formatMoney(value: string | number | null | undefined, currency: string): string {
  const amount = toNumber(value);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/** Formats without forcing decimals when the amount is a whole number — better for headline stats. */
export function formatMoneyCompact(
  value: string | number | null | undefined,
  currency: string,
): string {
  const amount = toNumber(value);
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: hasCents ? 2 : 0,
    }).format(amount);
  } catch {
    return `${amount.toFixed(hasCents ? 2 : 0)} ${currency}`;
  }
}

/** Round-trips through cents to avoid floating point drift before storing. */
export function toMoneyString(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

export function percent(part: number, whole: number): number {
  if (!Number.isFinite(whole) || whole <= 0) return 0;
  return Math.max(0, (part / whole) * 100);
}
