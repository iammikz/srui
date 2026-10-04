"use client";

import * as React from "react";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "../lib/cn";
import {
  clampDateKey,
  formatDateKey,
  formatTimeLabel,
  isValidTimeKey,
  joinDateTimeValue,
  parseDateInput,
  parseTimeInput,
  secondsToTimeKey,
  snapMinutes,
  splitDateTimeValue,
  timeToSeconds,
  type DateKey,
  type TimeKey,
} from "../lib/date";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { TimePanel } from "./TimePicker";

export interface DatePickerProps {
  /** `'YYYY-MM-DD'`, or `'YYYY-MM-DD HH:mm(:ss)'` with `timepicker`. */
  value?: string;
  /** Initial value for uncontrolled use. */
  defaultValue?: string;
  /** Fires with the committed wire-format value. */
  onChange?: (value: string) => void;
  /** Earliest selectable day (`'YYYY-MM-DD'`). */
  min?: string;
  /** Latest selectable day (`'YYYY-MM-DD'`). */
  max?: string;
  /** Attach a time panel; values become `'YYYY-MM-DD HH:mm(:ss)'`. */
  timepicker?: boolean;
  /** Seconds precision in the time panel. */
  seconds?: boolean;
  /** Minute grid step in the time panel. */
  minuteStep?: number;
  /** 12-hour time display (default) vs 24-hour. */
  hour12?: boolean;
  placeholder?: string;
  /** Required for accessibility when no visible label is bound. */
  ariaLabel?: string;
  disabled?: boolean;
  /** Marks the trigger invalid — red border + `aria-invalid`. */
  invalid?: boolean;
  /** Show a trailing clear button when a value is set. */
  clearable?: boolean;
  /** Custom trigger display; receives the wire value. */
  format?: (value: string) => string;
  /** Renders a hidden input carrying the value for native form posts. */
  name?: string;
  className?: string;
}

/**
 * A text trigger opening an anchored calendar popover: click or focus opens,
 * a day commits, Escape and outside clicks close and refocus, and typing a
 * full date commits it too. With `timepicker`, a time panel rides along and
 * values carry `HH:mm(:ss)`.
 */
export function DatePicker({
  value,
  defaultValue,
  onChange,
  min,
  max,
  timepicker = false,
  seconds = false,
  minuteStep = 1,
  hour12 = true,
  placeholder = "Pick a date",
  ariaLabel = "Date",
  disabled,
  invalid,
  clearable = true,
  format,
  name,
  className,
}: DatePickerProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value !== undefined ? value : uncontrolled;
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Combobox dive: ArrowDown from the trigger opens the panel and moves
  // focus onto the grid's focus day (the roving tabindex=0 button), leaving
  // plain typing intact.
  const diveToGrid = (alreadyOpen: boolean) => {
    if (!alreadyOpen) setOpen(true);
    // Two frames: one for the state flush, one for the portal commit.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        panelRef.current // scope inside the grid — the header buttons are also tabbable
          ?.querySelector('[role="grid"]')
          ?.querySelector<HTMLElement>('button[tabindex="0"]')
          ?.focus();
      }),
    );
  };
  // Time refined before a day is chosen — applied when the day lands.
  const [pendingTime, setPendingTime] = React.useState<TimeKey | null>(null);

  const { date, time } = React.useMemo(
    () => splitDateTimeValue(current),
    [current],
  );

  const commit = (next: string) => {
    setUncontrolled(next);
    onChange?.(next);
  };

  const defaultTime = seconds ? "00:00:00" : "00:00";

  const commitDay = (day: DateKey, keepOpen: boolean) => {
    const nextTime = timepicker
      ? (time && isValidTimeKey(time) ? time : pendingTime ?? defaultTime)
      : undefined;
    commit(joinDateTimeValue(day, nextTime));
    setDraft(null);
    setPendingTime(null);
    if (!keepOpen) setOpen(false);
  };

  const commitTime = (t: TimeKey) => {
    if (date) commit(joinDateTimeValue(date, t));
    else setPendingTime(t);
  };

  /** Typed input: `2026-9-4`, `2026-10-04 14:30` — clamped into min/max. */
  const commitTyped = (raw: string) => {
    const text = raw.trim();
    if (!text) {
      setDraft(null);
      return;
    }
    const [datePart, timePart] = text.split(/\s+/);
    const rawDate = parseDateInput(datePart);
    if (!rawDate) {
      setDraft(null); // revert to the committed display
      return;
    }
    // Out-of-bounds typing is clipped onto the boundary day, like the grid.
    const parsedDate = clampDateKey(rawDate, min, max);
    let nextTime: TimeKey | undefined;
    if (timepicker && timePart) {
      const parsed = parseTimeInput(timePart);
      if (!parsed) {
        setDraft(null);
        return;
      }
      const clipped = parsed.slice(0, seconds ? 8 : 5);
      const minute = snapMinutes(Math.floor(timeToSeconds(clipped) / 60), minuteStep);
      nextTime = secondsToTimeKey(minute * 60 + (seconds ? timeToSeconds(clipped) % 60 : 0), seconds);
    }
    const effectiveTime = timepicker
      ? nextTime ?? (time && isValidTimeKey(time) ? time : defaultTime)
      : undefined;
    commit(joinDateTimeValue(parsedDate, effectiveTime));
    setDraft(null);
  };

  const defaultDisplay = React.useMemo(() => {
    if (!date) return "";
    return timepicker && time && isValidTimeKey(time)
      ? `${formatDateKey(date)} ${formatTimeLabel(time, hour12)}`
      : formatDateKey(date);
  }, [date, time, timepicker, hour12]);

  const display = current ? (format ? format(current) : defaultDisplay) : "";
  const panelTime = timepicker ? (time && isValidTimeKey(time) ? time : undefined) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <PopoverTrigger asChild>
          <input
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={ariaLabel}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            placeholder={placeholder}
            value={draft ?? display}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={(e) => commitTyped(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTyped(e.currentTarget.value);
              else if (e.key === "ArrowDown") {
                e.preventDefault();
                diveToGrid(open);
              }
            }}
            data-slot="date-picker-trigger"
            className={cn(
              "flex h-9 w-full min-w-0 rounded-md border border-border bg-input/30 px-3 py-1 pr-8 text-base outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "aria-invalid:border-destructive aria-invalid:outline-destructive",
              invalid && "border-destructive",
            )}
          />
        </PopoverTrigger>
        {timepicker ? (
          <Clock aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        ) : (
          <CalendarDays aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}
        {clearable && current && !disabled ? (
          <button
            type="button"
            aria-label="Clear date"
            onClick={(e) => {
              e.stopPropagation();
              commit("");
              setDraft(null);
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm px-0.5 text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            ×
          </button>
        ) : null}
      </div>
      <PopoverContent
        ref={panelRef}
        align="start"
        className="flex w-fit gap-3 p-3"
        role="dialog"
        aria-label={`${ariaLabel} panel`}
      >
        <Calendar
          value={date}
          onSelect={(day) => commitDay(day, timepicker)}
          min={min}
          max={max}
        />
        {timepicker ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">Time</span>
            <TimePanel
              value={panelTime}
              onChange={commitTime}
              minuteStep={minuteStep}
              seconds={seconds}
              hour12={hour12}
              compact
              aria-label={`${ariaLabel} time`}
            />
          </div>
        ) : null}
      </PopoverContent>
      {name ? (
        <input type="hidden" name={name} value={current ?? ""} />
      ) : null}
    </Popover>
  );
}
