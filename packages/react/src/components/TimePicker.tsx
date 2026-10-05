"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "../lib/cn";
import {
  isValidTimeKey,
  parseTimeInput,
  secondsToTimeKey,
  snapMinutes,
  timeToSeconds,
  type TimeKey,
} from "../lib/date";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

// ---------------------------------------------------------------------------
// TimePanel — the inline hour/minute(/second)/period column grid. Embedded by
// DatePicker (timepicker mode), TimePicker, and TimeRangePicker.
// ---------------------------------------------------------------------------

export interface TimePanelProps {
  /** Selected time, `'HH:mm'` (or `'HH:mm:ss'` with seconds). */
  value?: string;
  /** Fires with the picked `'HH:mm(:ss)'` key on every column pick. */
  onChange?: (time: string) => void;
  /** Minute grid step (15 → 00/15/30/45). */
  minuteStep?: number;
  /** Show a seconds column and carry `'HH:mm:ss'` values. */
  seconds?: boolean;
  /** 12-hour grid with an AM/PM column (default) vs the 24-hour grid. */
  hour12?: boolean;
  /** Earliest selectable time (`'HH:mm(:ss)'`). */
  min?: string;
  /** Latest selectable time (`'HH:mm(:ss)'`). */
  max?: string;
  /** Drop the column headers — for dense panels. Labels stay (aria). */
  compact?: boolean;
  className?: string;
  "aria-label"?: string;
}

interface ColumnOption {
  /** Stable id, e.g. `h-9`, `m-15`, `s-30`, `pm`. */
  key: string;
  display: string;
  selected: boolean;
  disabled: boolean;
  /** Seconds-of-day this option commits. */
  commit: number;
}

function columnKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
  const col = e.currentTarget;
  const buttons = Array.from(col.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
  const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (idx === -1) return;
  let next = idx;
  if (e.key === "ArrowDown") next = Math.min(idx + 1, buttons.length - 1);
  else if (e.key === "ArrowUp") next = Math.max(idx - 1, 0);
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = buttons.length - 1;
  else return;
  e.preventDefault();
  buttons[next]?.focus();
}

function Column({
  label,
  options,
  compact,
  onPick,
}: {
  label: string;
  options: ColumnOption[];
  compact?: boolean;
  onPick: (o: ColumnOption) => void;
}) {
  const selectedRef = React.useRef<HTMLButtonElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Land the selected option in view when the panel mounts or value moves.
  React.useEffect(() => {
    const el = selectedRef.current;
    const box = scrollRef.current;
    if (!el || !box) return;
    box.scrollTop = el.offsetTop - box.offsetHeight / 2 + el.offsetHeight / 2;
  }, [options]);

  const hasSelected = options.some((o) => o.selected);
  const fallbackIndex = options.findIndex((o) => !o.disabled);

  return (
    <div
      role="listbox"
      aria-label={label}
      onKeyDown={columnKeyDown}
      className="flex w-16 flex-col rounded-md border border-border"
    >
      {!compact ? (
        <div className="border-b border-border py-1 text-center text-xs font-medium text-muted-foreground">
          {label}
        </div>
      ) : null}
      <div ref={scrollRef} className="max-h-44 overflow-y-auto p-1">
        {options.map((o, i) => (
          <button
            key={o.key}
            ref={o.selected ? selectedRef : undefined}
            type="button"
            role="option"
            aria-selected={o.selected || undefined}
            disabled={o.disabled}
            tabIndex={o.selected || (!hasSelected && i === fallbackIndex) ? 0 : -1}
            onClick={() => onPick(o)}
            className={cn(
              "flex h-8 w-full items-center justify-center rounded-sm text-sm outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40",
              o.selected &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {o.display}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Hour/minute(/second)/AM-PM columns with listbox semantics, arrow
 * navigation, min/max bounds and a stepped minute grid. Values are always
 * zero-padded `'HH:mm'` (or `'HH:mm:ss'`) regardless of the 12/24-hour view.
 */
export function TimePanel({
  value,
  onChange,
  minuteStep = 1,
  seconds = false,
  hour12 = true,
  min,
  max,
  compact,
  className,
  "aria-label": ariaLabel = "Time",
}: TimePanelProps) {
  const minSec = min && isValidTimeKey(min) ? timeToSeconds(min) : undefined;
  const maxSec = max && isValidTimeKey(max) ? timeToSeconds(max) : undefined;
  const sec = value && isValidTimeKey(value) ? timeToSeconds(value) : undefined;

  const commit = (next: number) => {
    // Minutes always land on the step grid; seconds ride along only when the
    // panel carries them.
    const minute = snapMinutes(Math.floor(next / 60), minuteStep);
    onChange?.(secondsToTimeKey(minute * 60 + (seconds ? next % 60 : 0), seconds));
  };

  const hour = sec === undefined ? undefined : Math.floor(sec / 3600);
  const minute = sec === undefined ? undefined : Math.floor((sec % 3600) / 60);
  const second = sec === undefined ? undefined : sec % 60;
  const pm = (hour ?? 0) >= 12;

  const overlap = (start: number, end: number) =>
    (minSec === undefined || end >= minSec) && (maxSec === undefined || start <= maxSec);

  const hourOptions: ColumnOption[] = React.useMemo(() => {
    const values = hour12 ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 24 }, (_, h) => h);
    return values.map((h) => {
      const real = hour12 ? (h % 12) + (pm ? 12 : 0) : h;
      return {
        key: `h-${h}`,
        display: hour12 ? String(h) : String(h).padStart(2, "0"),
        selected: hour === real,
        disabled: !overlap(real * 3600, real * 3600 + 3599),
        commit: real * 3600 + (minute ?? 0) * 60 + (second ?? 0),
      };
    });
  }, [hour, minute, second, pm, hour12, minSec, maxSec]);

  const minuteOptions: ColumnOption[] = React.useMemo(() => {
    const step = Math.max(1, minuteStep);
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => {
      const m = i * step;
      const start = (hour ?? 0) * 3600 + m * 60;
      return {
        key: `m-${m}`,
        display: String(m).padStart(2, "0"),
        selected: minute === m,
        disabled: hour === undefined || !overlap(start, start + (seconds ? 59 : 0)),
        commit: start + (second ?? 0),
      };
    });
  }, [hour, minute, second, seconds, minuteStep, minSec, maxSec]);

  const secondOptions: ColumnOption[] = React.useMemo(() => {
    return Array.from({ length: 60 }, (_, s) => {
      const start = (hour ?? 0) * 3600 + (minute ?? 0) * 60 + s;
      return {
        key: `s-${s}`,
        display: String(s).padStart(2, "0"),
        selected: second === s,
        disabled: hour === undefined || minute === undefined || !overlap(start, start),
        commit: start,
      };
    });
  }, [hour, minute, second, minSec, maxSec]);

  const periodOptions: ColumnOption[] = React.useMemo(() => {
    const periodHours = (isPm: boolean) => {
      const start = isPm ? 12 * 3600 : 0;
      const end = isPm ? 24 * 3600 - 1 : 12 * 3600 - 1;
      return { start, end };
    };
    return (["am", "pm"] as const).map((p) => {
      const { start, end } = periodHours(p === "pm");
      const realHour = ((hour ?? 0) % 12) + (p === "pm" ? 12 : 0);
      return {
        key: p,
        display: p === "am" ? "AM" : "PM",
        selected: hour !== undefined && pm === (p === "pm"),
        disabled: !overlap(start, end),
        commit: realHour * 3600 + (minute ?? 0) * 60 + (second ?? 0),
      };
    });
  }, [hour, minute, second, pm, minSec, maxSec]);

  return (
    <div
      data-slot="time-panel"
      role="group"
      aria-label={ariaLabel}
      className={cn("flex gap-1.5", className)}
    >
      <Column label="Hour" options={hourOptions} compact={compact} onPick={(o) => commit(o.commit)} />
      <Column label="Minute" options={minuteOptions} compact={compact} onPick={(o) => commit(o.commit)} />
      {seconds ? (
        <Column label="Second" options={secondOptions} compact={compact} onPick={(o) => commit(o.commit)} />
      ) : null}
      {hour12 ? (
        <Column label="AM/PM" options={periodOptions} compact={compact} onPick={(o) => commit(o.commit)} />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TimePicker — a text trigger over the portaled TimePanel.
// ---------------------------------------------------------------------------

export interface TimePickerProps {
  /** Selected time, `'HH:mm'` (or `'HH:mm:ss'` with seconds). */
  value?: string;
  /** Initial time for uncontrolled use. */
  defaultValue?: string;
  /** Fires with the `'HH:mm(:ss)'` wire value (never the 12-hour display). */
  onChange?: (time: string) => void;
  /** Minute grid step (15 → 00/15/30/45). */
  minuteStep?: number;
  /** Seconds column + `'HH:mm:ss'` values. */
  seconds?: boolean;
  /** 12-hour trigger and panel (default) vs 24-hour. */
  hour12?: boolean;
  /** Earliest selectable time. */
  min?: string;
  /** Latest selectable time. */
  max?: string;
  placeholder?: string;
  /** Required for accessibility when no visible label is bound. */
  ariaLabel?: string;
  disabled?: boolean;
  /** Marks the trigger invalid — red border + `aria-invalid`. */
  invalid?: boolean;
  /** Show a trailing clear button when a value is set. */
  clearable?: boolean;
  className?: string;
}

function snapAndClamp(time: TimeKey, minuteStep: number, min?: string, max?: string): TimeKey {
  let sec = timeToSeconds(time);
  const minute = snapMinutes(Math.floor(sec / 60), minuteStep);
  sec = minute * 60 + (sec % 60);
  if (min && isValidTimeKey(min)) sec = Math.max(sec, timeToSeconds(min));
  if (max && isValidTimeKey(max)) sec = Math.min(sec, timeToSeconds(max));
  return secondsToTimeKey(sec, time.split(":").length === 3);
}

/**
 * A time picker: combobox-style trigger opening an anchored TimePanel.
 * Typing `9:30`, `09:30`, `9:30 am` or `1430` commits too. `onChange` always
 * reports the zero-padded wire format even when displayed as 12-hour.
 */
export function TimePicker({
  value,
  defaultValue,
  onChange,
  minuteStep = 1,
  seconds = false,
  hour12 = true,
  min,
  max,
  placeholder = "HH:mm",
  ariaLabel = "Time",
  disabled,
  invalid,
  clearable = true,
  className,
}: TimePickerProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value !== undefined ? value : uncontrolled;
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Combobox dive: ArrowDown opens the panel and lands focus on the first
  // column's selected option.
  const diveToPanel = (alreadyOpen: boolean) => {
    if (!alreadyOpen) setOpen(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        panelRef.current
          ?.querySelector<HTMLElement>('[role=listbox] button[tabindex="0"]')
          ?.focus();
      }),
    );
  };

  const display = current && isValidTimeKey(current)
    ? (hour12
        ? (() => {
            const [h, m, s] = current.split(":").map(Number);
            const period = h < 12 ? "AM" : "PM";
            const h12 = h % 12 === 0 ? 12 : h % 12;
            const base = `${h12}:${String(m).padStart(2, "0")}`;
            return s === undefined ? `${base} ${period}` : `${base}:${String(s).padStart(2, "0")} ${period}`;
          })()
        : current)
    : "";

  const commit = (time: TimeKey) => {
    setUncontrolled(time);
    onChange?.(time);
  };

  const commitTyped = (raw: string) => {
    const parsed = parseTimeInput(raw);
    if (parsed) {
      const withSeconds = seconds ? parsed : parsed.slice(0, 5);
      commit(snapAndClamp(withSeconds, minuteStep, min, max));
    }
    setDraft(null);
  };

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
                diveToPanel(open);
              }
            }}
            data-slot="time-picker-trigger"
            className={cn(
              "flex h-9 w-full min-w-0 rounded-md border border-border bg-input/30 px-3 py-1 pr-8 text-base outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "aria-invalid:border-destructive aria-invalid:outline-destructive",
              invalid && "border-destructive",
            )}
          />
        </PopoverTrigger>
        <Clock
          aria-hidden
          className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        {clearable && current && !disabled ? (
          <button
            type="button"
            aria-label="Clear time"
            onClick={(e) => {
              e.stopPropagation();
              commit("");
              setDraft(null);
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            ×
          </button>
        ) : null}
      </div>
      <PopoverContent
        ref={panelRef}
        align="start"
        className="w-auto p-2"
        role="dialog"
        aria-label={ariaLabel}
      >
        <TimePanel
          value={current || undefined}
          onChange={(t) => {
            commit(t);
            setDraft(null);
          }}
          minuteStep={minuteStep}
          seconds={seconds}
          hour12={hour12}
          min={min}
          max={max}
          compact
        />
      </PopoverContent>
    </Popover>
  );
}
