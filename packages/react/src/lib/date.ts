/**
 * Wire-format date/time helpers — pure string arithmetic, no date library.
 *
 * Conventions (the "wire format" used by every srui picker):
 * - DateKey: `'YYYY-MM-DD'`, local calendar days.
 * - MonthKey: `'YYYY-MM'`.
 * - TimeKey: `'HH:mm'` (or `'HH:mm:ss'` with seconds), always zero-padded
 *   24-hour — display formatting (12-hour etc.) never leaks into values.
 */

export type DateKey = string;
export type MonthKey = string;
export type TimeKey = string;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_RE = /^\d{4}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}(:\d{2})?$/;

/** Format a Date as a `'YYYY-MM-DD'` key (local calendar day). */
export function toDateKey(date: Date): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a `'YYYY-MM-DD'` key into a local-midnight Date (invalid → NaN date). */
export function fromDateKey(key: string): Date {
  const [y, m, d] = (key ?? "").split("-").map(Number);
  return new Date(y, (m ?? NaN) - 1, d ?? NaN);
}

/** Today as a `'YYYY-MM-DD'` key. */
export function todayKey(): DateKey {
  return toDateKey(new Date());
}

export function isValidDateKey(key: unknown): key is DateKey {
  if (typeof key !== "string" || !DATE_RE.test(key)) return false;
  const d = fromDateKey(key);
  return !Number.isNaN(d.getTime()) && toDateKey(d) === key;
}

export function isValidMonthKey(key: unknown): key is MonthKey {
  if (typeof key !== "string" || !MONTH_RE.test(key)) return false;
  const [y, m] = key.split("-").map(Number);
  return y >= 1 && m >= 1 && m <= 12;
}

/** Add whole days to a date key. */
export function addDays(key: DateKey, days: number): DateKey {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

/** Add whole months, clamping the day-of-month (Jan 31 → Feb 28/29). */
export function addMonths(key: DateKey | MonthKey, months: number): DateKey {
  const [y, m, d] = (key + "-01").split("-").map(Number);
  const date = new Date(y, m - 1 + months, 1);
  const dim = daysInMonth(toMonthKey(date));
  date.setDate(Math.min(d, dim));
  return toDateKey(date);
}

/** Shift a month key by whole months. */
export function addMonthsKey(month: MonthKey, months: number): MonthKey {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(y, m - 1 + months, 1);
  return toMonthKey(date);
}

/** Normalizes a date key or month key down to `'YYYY-MM'`. */
export function toMonthKey(date: Date | DateKey | MonthKey): MonthKey {
  const key = typeof date === "string" ? date : toDateKey(date);
  return key.slice(0, 7);
}

/** Day-of-week (0 = Sunday … 6 = Saturday) of a date key. */
export function weekdayOf(key: DateKey): number {
  return fromDateKey(key).getDay();
}

/** Number of days in a month key's month. */
export function daysInMonth(month: MonthKey): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

/** Lexicographic compare works for the wire format; this makes intent explicit. */
export function compareDateKeys(a: DateKey, b: DateKey): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isDateKeyBetween(key: DateKey, min?: string, max?: string): boolean {
  if (min && key < min) return false;
  if (max && key > max) return false;
  return true;
}

/** Clamp a date key into [min, max] (bounds are optional). */
export function clampDateKey(key: DateKey, min?: string, max?: string): DateKey {
  if (min && key < min) return min;
  if (max && key > max) return max;
  return key;
}

/** First day (date key) of a month key. */
export function startOfMonth(month: MonthKey): DateKey {
  return `${month}-01`;
}

/** Last day (date key) of a month key. */
export function endOfMonth(month: MonthKey): DateKey {
  return `${month}-${String(daysInMonth(month)).padStart(2, "0")}`;
}

/** Inclusive day count between two date keys. */
export function daysBetween(from: DateKey, to: DateKey): number {
  const ms = fromDateKey(to).getTime() - fromDateKey(from).getTime();
  return Math.round(ms / 86_400_000);
}

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const shortDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const mediumDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

/** `'September 2026'` — the calendar header label. */
export function formatMonthLabel(month: MonthKey): string {
  return monthFmt.format(fromDateKey(startOfMonth(month)));
}

/** `'Sep 12, 2026'` — the picker trigger label. */
export function formatDateKey(key: DateKey): string {
  return shortDateFmt.format(fromDateKey(key));
}

/** `'Sep 12'` — compact range labels where the year is shown once. */
export function formatDateKeyShort(key: DateKey): string {
  return mediumDateFmt.format(fromDateKey(key));
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

export function isValidTimeKey(time: unknown): time is TimeKey {
  if (typeof time !== "string" || !TIME_RE.test(time)) return false;
  const [h, m, s] = time.split(":").map(Number);
  if (h > 23 || m > 59) return false;
  return s === undefined || s <= 59;
}

/** Seconds since midnight of an `'HH:mm(:ss)'` key (invalid → NaN). */
export function timeToSeconds(time: string): number {
  const [h, m, s] = (time ?? "").split(":").map(Number);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
}

/** Minutes since midnight (drops seconds). */
export function timeToMinutes(time: string): number {
  return Math.floor(timeToSeconds(time) / 60);
}

/** Build an `'HH:mm(:ss)'` key from seconds since midnight. */
export function secondsToTimeKey(total: number, withSeconds = false): TimeKey {
  const t = ((Math.round(total) % 86_400) + 86_400) % 86_400;
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const base = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return withSeconds ? `${base}:${String(s).padStart(2, "0")}` : base;
}

export function minutesToTimeKey(total: number, withSeconds = false): TimeKey {
  return secondsToTimeKey(total * 60, withSeconds);
}

/** Snap minutes-of-day onto a step grid (e.g. 15) — rounds down. */
export function snapMinutes(total: number, step: number): number {
  if (!step || step <= 1) return total;
  return Math.floor(total / step) * step;
}

/** `'14:30'` → `'2:30 PM'` (seconds included when present). */
export function formatTime12(time: string): string {
  if (!isValidTimeKey(time)) return time;
  const [h, m, s] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const base = `${hour12}:${String(m).padStart(2, "0")}`;
  return s === undefined ? `${base} ${period}` : `${base}:${String(s).padStart(2, "0")} ${period}`;
}

/** Normalize/display a time key as `'HH:mm'` (24-hour) or 12-hour label. */
export function formatTimeLabel(time: string, hour12: boolean): string {
  return hour12 ? formatTime12(time) : time;
}

/** Split a `'YYYY-MM-DD[ HH:mm[:ss]]'` picker value into its parts. */
export function splitDateTimeValue(
  value: string | undefined,
): { date?: DateKey; time?: TimeKey } {
  if (!value) return {};
  const [date, time] = value.split(" ");
  return isValidDateKey(date) ? { date, time } : {};
}

/** Join date/time parts back into the wire value (time only when defined). */
export function joinDateTimeValue(date: DateKey | undefined, time: TimeKey | undefined): string {
  return date ? (time ? `${date} ${time}` : date) : "";
}

/**
 * Parse loosely-typed user input into a time key. Accepts `'9:3'`, `'09:30'`,
 * `'9:30 am'`, `'14:30:45'`, `'1430'` — returns null when unparseable.
 */
export function parseTimeInput(input: string): TimeKey | null {
  const text = input.trim().toLowerCase().replace(/\s+/g, "");
  const m = text.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?(am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = m[2] === undefined ? 0 : Number(m[2]);
  const sec = m[3] === undefined ? 0 : Number(m[3]);
  if (m[4]) {
    if (h < 1 || h > 12) return null;
    if (m[4] === "pm" && h !== 12) h += 12;
    if (m[4] === "am" && h === 12) h = 0;
  } else if (h > 23) return null;
  if (min > 59 || sec > 59) return null;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/** Parse `'2026-9-4'`-style forgiving input into a strict date key, else null. */
export function parseDateInput(input: string): DateKey | null {
  const m = input.trim().match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (!m) return null;
  const key = `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return isValidDateKey(key) ? key : null;
}
