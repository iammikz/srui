"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";
import { formatTimeLabel, isValidTimeKey, timeToSeconds } from "../lib/date";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { TimePanel } from "./TimePicker";

/** `{ from?: 'HH:mm', to?: 'HH:mm' }` — either side may be unset. */
export interface TimeRange {
  from?: string;
  to?: string;
}

export interface TimeRangePickerProps {
  /** `{ from, to }` in `'HH:mm(:ss)'` (controlled). */
  value?: TimeRange;
  /** Initial range for uncontrolled use. */
  defaultValue?: TimeRange;
  /** Fires on every pick (live) with the staged range. */
  onChange?: (range: TimeRange) => void;
  /** Minute grid step. */
  minuteStep?: number;
  /** Seconds columns + `'HH:mm:ss'` values. */
  seconds?: boolean;
  /** 12-hour display (default) vs 24-hour. */
  hour12?: boolean;
  /** Earliest selectable time (the business window open). */
  min?: string;
  /** Latest selectable time (the business window close). */
  max?: string;
  placeholder?: string;
  /** Required for accessibility when no visible label is bound. */
  ariaLabel?: string;
  disabled?: boolean;
  /** Show a trailing clear button when a range is set. */
  clearable?: boolean;
  className?: string;
}

/**
 * A from–to time span on side-by-side column pairs: pick the start, then the
 * end — the To panel disables times before From, so an inverted range can't
 * be built. Live `onChange` on every pick; Clear/Apply in the footer.
 */
export function TimeRangePicker({
  value,
  defaultValue,
  onChange,
  minuteStep = 1,
  seconds = false,
  hour12 = true,
  min,
  max,
  placeholder = "HH:mm – HH:mm",
  ariaLabel = "Time range",
  disabled,
  clearable = true,
  className,
}: TimeRangePickerProps) {
  const [uncontrolled, setUncontrolled] = React.useState<TimeRange>(defaultValue ?? {});
  const current = value !== undefined ? value : uncontrolled;
  const { from, to } = current;
  const [open, setOpen] = React.useState(false);

  const commit = (next: TimeRange, close = false) => {
    setUncontrolled(next);
    onChange?.(next);
    if (close) setOpen(false);
  };

  const pickFrom = (t: string) => {
    // A From past the current To invalidates it — unbuildable, not rejected.
    commit(to && isValidTimeKey(to) && t > to ? { from: t } : { ...current, from: t });
  };

  const pickTo = (t: string) => commit({ ...current, to: t });

  // The To floor: the global min, raised to From once From is picked.
  const toMin = from && isValidTimeKey(from)
    ? min && isValidTimeKey(min) && timeToSeconds(min) > timeToSeconds(from)
      ? min
      : from
    : min;

  const fromLabel = from && isValidTimeKey(from) ? formatTimeLabel(from, hour12) : null;
  const toLabel = to && isValidTimeKey(to) ? formatTimeLabel(to, hour12) : null;
  const complete = !!(from && to);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={ariaLabel}
            disabled={disabled}
            data-slot="time-range-trigger"
            className={cn(
              "flex h-9 w-full min-w-0 items-center gap-1 rounded-md border border-border bg-input/30 px-3 py-2 text-sm outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
              !from && "text-muted-foreground",
            )}
          >
            {fromLabel ? (
              <>
                <span className="truncate">{fromLabel}</span>
                <ArrowRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{toLabel ?? "…"}</span>
              </>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>
        {clearable && (from || to) && !disabled ? (
          <button
            type="button"
            aria-label="Clear time range"
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
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">From</span>
            <TimePanel
              value={from}
              onChange={pickFrom}
              minuteStep={minuteStep}
              seconds={seconds}
              hour12={hour12}
              min={min}
              max={max}
              compact
              aria-label="From time"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">To</span>
            <TimePanel
              value={to}
              onChange={pickTo}
              minuteStep={minuteStep}
              seconds={seconds}
              hour12={hour12}
              min={toMin}
              max={max}
              compact
              aria-label="To time"
            />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-2 border-t border-border pt-2">
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
      </PopoverContent>
    </Popover>
  );
}
