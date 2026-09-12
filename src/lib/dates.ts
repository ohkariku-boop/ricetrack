/** Local-calendar helpers — avoid UTC midnight shifting “today” in +08 etc. */

/** YYYY-MM-DD in the user's local timezone */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Local calendar date of an ISO timestamp (or date-only string) */
export function localDateKeyFromIso(iso: string): string {
  if (!iso) return localDateKey();
  // Date-only already
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return localDateKey(d);
}

/** Start of local today as Date */
export function startOfLocalDay(d: Date = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Local date key N days before today */
export function localDateKeyDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return localDateKey(d);
}

/**
 * Build an ISO timestamp for a local calendar day.
 * Uses noon local time so the day does not shift across timezones.
 */
export function isoFromLocalDateKey(dateKey: string, at: Date = new Date()): string {
  const key = localDateKeyFromIso(dateKey);
  const [y, m, d] = key.split("-").map(Number);
  const x = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
  // preserve current clock time-of-day when logging "today"
  if (key === localDateKey(at)) {
    x.setHours(at.getHours(), at.getMinutes(), at.getSeconds(), 0);
  }
  return x.toISOString();
}
