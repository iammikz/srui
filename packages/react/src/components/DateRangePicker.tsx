"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";
import {
  addDays,
  addMonths,
  compareDateKeys,
  daysBetween,
  formatDateKey,
  formatDateKeyShort,
  formatTimeLabel,
  isValidTimeKey,
  type DateKey,
} from "../lib/date";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { TimePanel } from "./TimePicker";

/** `{ from?: 'YYYY-MM-DD', to?: 'YYYY-MM-DD' }` — either side may be unset. */
export interface DateRange {
  from?: string;
  to?: string;
}

/** A full range moment when `timepicker` is on (times ride on the days). */
interface DatedRange extends DateRange {
  fromTime?: string;
  toTime?: string;
}

export type DateRangeMaxSpan =
  | number // day count
  | "7d"
  | "30d"
  | "90d"
  | "12w"
  | "3m"
  | "6m"
  | "1y";

export interface DateRangePickerProps {
  /** `{ from, to }` in `'YYYY-MM-DD'` (controlled). */
  value?: DateRange;
  /** Initial range for uncontrolled use. */
  defaultValue?: DateRange;
  /** Fires on every pick (live) with the staged range. */
  onChange?: (range: DateRange) => void;
  /** Earliest selectable day. */
  min?: string;
  /** Latest selectable day. */
  max?: string;
  /** Caps the span length once a start is anchored. */
  maxRange?: number | DateRangeMaxSpan;
  /** From/to time panels; values keep their times in the trigger label. */
  timepicker?: boolean;
  /** Seconds precision in the time panels. */
  seconds?: boolean;
  /** Minute grid step in the time panels. */
  minuteStep?: number;
  /** 12-hour time display (default) vs 24-hour. */
  hour12?: boolean;
  /** Quick spans rendered as chips above the grid. */
  presets?: { label: string; getRange: () => DateRange }[];
  placeholder?: string;
  /** Required for accessibility when no visible label is bound. */
  ariaLabel?: string;
  disabled?: boolean;
  /** Show a trailing clear button when a range is set. */
  clearable?: boolean;
  className?: string;
}

function parseMaxRange(maxRange?: number | DateRangeMaxSpan): { days?: number; months?: number } | undefined {
  if (maxRange == null) return undefined;
  if (typeof maxRange === "number") return { days: maxRange };
  if (maxRange === "1y") return { months: 12 };
  const n = Number(maxRange.slice(0, -1));
  const unit = maxRange.slice(-1);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  switch (unit) {
    case "d": return { days: n };
    case "w": return { days: n * 7 };
    case "m": return { months: n };
    default: return undefined;
  }
}

/** Last selectable end day for a span started at `from`. */
function capEnd(from: DateKey, cap: { days?: number; months?: number }): DateKey {
  if (cap.months) return addDays(addMonths(from, cap.months), -1);
  return addDays(from, (cap.days ?? 1) - 1);
}

function sameYear(a: string, b: string) {
  return a.slice(0, 4) === b.slice(0, 4);
}

/**
 * Start–end selection on one calendar: the first click anchors, the second
 * completes, an earlier second click restarts. `maxRange` caps the span by
 * disabling out-of-range days, and `timepicker` adds from/to time panels.
 * Every pick reports the staged range live; Apply closes the panel.
 */
export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  min,
  max,
  maxRange,
  timepicker = false,
  seconds = false,
  minuteStep = 1,
  hour12 = true,
  presets,
  placeholder = "Start – End",
  ariaLabel = "Date range",
  disabled,
  clearable = true,
  className,
}: DateRangePickerProps) {
  const [uncontrolled, setUncontrolled] = React.useState<DatedRange>(defaultValue ?? {});
  const current: DatedRange = value !== undefined ? { ...value, ...pickTimes(uncontrolled) } : uncontrolled;
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState<DateKey | null>(null);
  const { from, to, fromTime, toTime } = current;

  const cap = React.useMemo(() => parseMaxRange(maxRange), [maxRange]);
  const activeCap = from && !to && cap ? capEnd(from, cap) : undefined;

  const commit = (next: DatedRange, close = false) => {
    setUncontrolled(next);
    onChange?.({ from: next.from, to: next.to });
    if (close) setOpen(false);
  };

  const pickDay = (day: DateKey) => {
    if (!from || (from && to)) {
      // Start a new range at this day.
      commit({ ...current, from: day, to: undefined, fromTime, toTime: undefined });
      return;
    }
    if (compareDateKeys(day, from) < 0) {
      // An earlier second click restarts the range at that day.
      commit({ ...current, from: day, to: undefined, fromTime, toTime: undefined });
      return;
    }
    const end = activeCap && day > activeCap ? activeCap : day;
    const complete = { ...current, to: end, toTime };
    // Without timepicker a completed range applies and closes.
    commit(complete, !timepicker);
  };

  const applyPreset = (getRange: () => DateRange) => {
    const r = getRange();
    commit(
      {
        from: r.from,
        to: r.to,
        fromTime: r.from ? (seconds ? "00:00:00" : "00:00") : undefined,
        toTime: r.to ? (seconds ? "23:59:59" : "23:59") : undefined,
      },
      !timepicker,
    );
  };

  const disabledByCap = React.useCallback(
    (day: string) => !!activeCap && day > activeCap,
    [activeCap],
  );

  const fromDisplay = React.useMemo(() => {
    if (!from) return null;
    const time = timepicker && fromTime && isValidTimeKey(fromTime) ? ` ${formatTimeLabel(fromTime, hour12)}` : "";
    return `${sameYear(to ?? from, from) ? formatDateKeyShort(from) : formatDateKey(from)}${time}`;
  }, [from, fromTime, to, timepicker, hour12]);

  const toDisplay = React.useMemo(() => {
    if (!to) return null;
    const time = timepicker && toTime && isValidTimeKey(toTime) ? ` ${formatTimeLabel(toTime, hour12)}` : "";
    return `${formatDateKey(to)}${time}`;
  }, [to, toTime, timepicker, hour12]);

  const complete = !!(from && to);
  const rangeDays = complete ? `${Math.abs(daysBetween(to, from)) + 1} days` : "";

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setHover(null); }}>
      <div className={cn("relative", className)}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={ariaLabel}
            disabled={disabled}
            data-slot="date-range-trigger"
            className={cn(
              "flex h-9 w-full min-w-0 items-center gap-1 rounded-md border border-border bg-input/30 px-3 py-2 text-sm outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
              !from && "text-muted-foreground",
            )}
          >
            {fromDisplay ? (
              <>
                <span className="truncate">{fromDisplay}</span>
                <ArrowRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{toDisplay ?? "…"}</span>
              </>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>
        {clearable && (from || to) && !disabled ? (
          <button
            type="button"
            aria-label="Clear range"
            onClick={(e) => {
              e.stopPropagation();
              commit({});
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm px-0.5 text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            ×
          </button>
        ) : null}
      </div>
      <PopoverContent align="start" className="w-auto p-3" role="dialog" aria-label={`${ariaLabel} panel`}>
        {presets?.length ? (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.getRange)}
                className="rounded-full border border-border px-2.5 py-1 text-xs outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex gap-3">
          <Calendar
            selectedRange={{ from, to, hover: hover ?? undefined }}
            onDayHover={setHover}
            onSelect={pickDay}
            min={min}
            max={max}
            disabledDates={disabledByCap}
          />
          {timepicker ? (
            <div className="flex gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">From</span>
                <TimePanel
                  value={fromTime}
                  onChange={(t) => from && commit({ ...current, from, fromTime: t })}
                  minuteStep={minuteStep}
                  seconds={seconds}
                  hour12={hour12}
                  compact
                  aria-label="From time"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted-foreground">To</span>
                <TimePanel
                  value={toTime}
                  onChange={(t) => to && commit({ ...current, to, toTime: t })}
                  minuteStep={minuteStep}
                  seconds={seconds}
                  hour12={hour12}
                  compact
                  aria-label="To time"
                />
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
          <span aria-live="polite" className="text-xs text-muted-foreground">
            {rangeDays}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => commit({})}
              className="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={!complete}
              onClick={() => setOpen(false)}
              className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground outline-none transition-colors duration-(--dur-fast) hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Times live outside the public DateRange shape; keep them staged internally.
function pickTimes(range: DatedRange): Pick<DatedRange, "fromTime" | "toTime"> {
  return { fromTime: range.fromTime, toTime: range.toTime };
}
