const DAY_MS = 24 * 60 * 60 * 1000;

/** Parses a `date` column value (YYYY-MM-DD or Date) into a UTC-midnight Date. */
export function parseDateOnly(value: string | Date): Date {
  if (value instanceof Date) return value;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export function formatDate(value: string | Date): string {
  return parseDateOnly(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateShort(value: string | Date): string {
  return parseDateOnly(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function daysBetween(start: string | Date, end: string | Date): number {
  const a = parseDateOnly(start).getTime();
  const b = parseDateOnly(end).getTime();
  return Math.max(0, Math.round((b - a) / DAY_MS)) + 1; // inclusive of both ends
}

export function tripLengthLabel(start: string | Date, end: string | Date): string {
  const nights = Math.max(0, daysBetween(start, end) - 1);
  if (nights === 0) return "Day trip";
  return `${nights} night${nights === 1 ? "" : "s"}`;
}

/** Days until `start` from today; negative once the trip has begun. */
export function daysUntil(start: string | Date): number {
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const target = parseDateOnly(start).getTime();
  return Math.round((target - todayUtc) / DAY_MS);
}

/** Where "today" sits inside [start, end] as 0–100, clamped. Used for a progress rail. */
export function tripProgressPercent(start: string | Date, end: string | Date): number {
  const s = parseDateOnly(start).getTime();
  const e = parseDateOnly(end).getTime();
  const today = new Date();
  const t = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (t <= s) return 0;
  if (t >= e) return 100;
  return Math.round(((t - s) / (e - s)) * 100);
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function deriveStatus(start: string, end: string): "planning" | "active" | "completed" {
  const s = parseDateOnly(start).getTime();
  const e = parseDateOnly(end).getTime();
  const today = new Date();
  const t = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (t < s) return "planning";
  if (t > e) return "completed";
  return "active";
}
