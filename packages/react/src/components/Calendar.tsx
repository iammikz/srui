"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import {
  addDays,
  addMonths,
  addMonthsKey,
  clampDateKey,
  compareDateKeys,
  daysInMonth,
  endOfMonth,
  formatMonthLabel,
  isValidDateKey,
  isValidMonthKey,
  startOfMonth,
  toDateKey,
  todayKey,
  toMonthKey,
  weekdayOf,
  type DateKey,
  type MonthKey,
} from "../lib/date";

/** Range overlay driven by DateRangePicker; bare Calendar ignores it. */
export interface CalendarRangeHighlight {
  from?: string;
  to?: string;
  /** Live hover end while the second click is pending — renders the preview. */
  hover?: string;
}

export interface CalendarProps {
  /** Selected day, `'YYYY-MM-DD'`. */
  value?: string;
  /** Initial selected day for uncontrolled use. */
  defaultValue?: string;
  /** Fires with the clicked day's `'YYYY-MM-DD'` key. */
  onSelect?: (date: string) => void;
  /** Viewed month, `'YYYY-MM'` (controlled). Defaults to the selection or today. */
  month?: string;
  /** Initial viewed month for uncontrolled use. */
  defaultMonth?: string;
  /** Fires with `'YYYY-MM'` when the header navigation changes months. */
  onMonthChange?: (month: string) => void;
  /** Earliest selectable day (`'YYYY-MM-DD'`). */
  min?: string;
  /** Latest selectable day (`'YYYY-MM-DD'`). */
  max?: string;
  /** Arbitrary day disabling (holidays, closed weekdays…) on top of min/max. */
  disabledDates?: (date: string) => boolean;
  /** 0 = Sunday-first (default), 1 = Monday-first. */
  weekStartsOn?: 0 | 1;
  /** Whether to show the Today shortcut under the grid. */
  showToday?: boolean;
  /** Range overlay: highlights from–to (plus hover preview) on the grid. */
  selectedRange?: CalendarRangeHighlight;
  /** Fires on day mouseenter (null on grid leave) — range hover previews. */
  onDayHover?: (date: string | null) => void;
  className?: string;
  "aria-label"?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isDayDisabled(day: DateKey, min?: string, max?: string, disabledDates?: (d: string) => boolean) {
  if (min && day < min) return true;
  if (max && day > max) return true;
  return disabledDates?.(day) ?? false;
}

function weekdays(weekStartsOn: 0 | 1) {
  return weekStartsOn === 1 ? [...WEEKDAYS.slice(1), WEEKDAYS[0]] : WEEKDAYS;
}

/** The 42 day keys (6×7) covering the month view, plus which are in-month. */
function monthGrid(month: MonthKey, weekStartsOn: 0 | 1): DateKey[] {
  const first = startOfMonth(month);
  const offset = (weekdayOf(first) - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

/**
 * A month-grid calendar with full grid semantics — day/week arrows, Home/End
 * week jumps, PageUp/PageDown month navigation, `aria-current` today marking.
 * Values are plain `'YYYY-MM-DD'` strings; DatePicker and DateRangePicker are
 * thin layers over this engine.
 */
export function Calendar({
  value,
  defaultValue,
  onSelect,
  month,
  defaultMonth,
  onMonthChange,
  min,
  max,
  disabledDates,
  weekStartsOn = 0,
  showToday = true,
  selectedRange,
  onDayHover,
  className,
  "aria-label": ariaLabel = "Calendar",
  ...props
}: CalendarProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const selected = value !== undefined ? value : uncontrolledValue;

  const initialMonth = React.useMemo(() => {
    const candidate =
      month ?? defaultMonth ?? (isValidDateKey(selected) ? selected : todayKey());
    return isValidMonthKey(candidate) ? candidate : toMonthKey(new Date());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [uncontrolledMonth, setUncontrolledMonth] = React.useState<string>(initialMonth);
  const viewedMonth = month !== undefined ? month : uncontrolledMonth;
  const isMonthControlled = month !== undefined;

  // An external value change moves an uncontrolled view with it (the
  // controlled-month + moving-value combo is the caller's to reconcile).
  React.useEffect(() => {
    if (!isMonthControlled && isValidDateKey(value)) {
      setUncontrolledMonth((m) => (toMonthKey(value) === m ? m : toMonthKey(value)));
    }
  }, [value, isMonthControlled]);

  // Roving-tabindex focus day; refocuses after keyboard month jumps.
  const [focusDay, setFocusDay] = React.useState<DateKey>(() =>
    clampDateKey(
      isValidDateKey(selected) ? selected : todayKey(),
      startOfMonth(initialMonth),
      endOfMonth(initialMonth),
    ),
  );
  const dayRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const shouldRefocus = React.useRef(false);

  React.useEffect(() => {
    if (!shouldRefocus.current) return;
    shouldRefocus.current = false;
    dayRefs.current.get(focusDay)?.focus();
  }, [focusDay, viewedMonth]);

  const setMonth = (next: string) => {
    if (!isMonthControlled) setUncontrolledMonth(next);
    onMonthChange?.(next);
  };

  const gotoMonth = (delta: number) => {
    const next = addMonthsKey(viewedMonth, delta);
    setFocusDay((d) => clampDateKey(d, startOfMonth(next), endOfMonth(next)));
    shouldRefocus.current = true;
    setMonth(next);
  };

  const select = (day: DateKey) => {
    if (!isDayDisabled(day, min, max, disabledDates)) {
      setUncontrolledValue(day);
      setFocusDay(day);
      onSelect?.(day);
    }
  };

  const focusInMonth = (day: DateKey) => {
    const clamped = clampDateKey(day, startOfMonth(viewedMonth), endOfMonth(viewedMonth));
    setFocusDay(clamped);
    dayRefs.current.get(clamped)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const col = (weekdayOf(focusDay) - weekStartsOn + 7) % 7;
    switch (e.key) {
      case "ArrowLeft": e.preventDefault(); focusInMonth(addDays(focusDay, -1)); break;
      case "ArrowRight": e.preventDefault(); focusInMonth(addDays(focusDay, 1)); break;
      case "ArrowUp": e.preventDefault(); focusInMonth(addDays(focusDay, -7)); break;
      case "ArrowDown": e.preventDefault(); focusInMonth(addDays(focusDay, 7)); break;
      case "Home": e.preventDefault(); focusInMonth(addDays(focusDay, -col)); break;
      case "End": e.preventDefault(); focusInMonth(addDays(focusDay, 6 - col)); break;
      case "PageUp": e.preventDefault(); gotoMonth(-1); break;
      case "PageDown": e.preventDefault(); gotoMonth(1); break;
    }
  };

  const grid = React.useMemo(() => monthGrid(viewedMonth, weekStartsOn), [viewedMonth, weekStartsOn]);
  const today = todayKey();
  const monthNumber = Number(viewedMonth.slice(5, 7));
  const inMonth = (d: DateKey) => Number(d.slice(5, 7)) === monthNumber;

  const prevDisabled = min != null && endOfMonth(addMonthsKey(viewedMonth, -1)) < min;
  const nextDisabled = max != null && startOfMonth(addMonthsKey(viewedMonth, 1)) > max;
  const todayDisabled = isDayDisabled(today, min, max, disabledDates);

  const rangePreview = React.useMemo(() => {
    const { from, to, hover } = selectedRange ?? {};
    if (!from) return null;
    const end = to ?? hover;
    if (!end) return { start: from, end: from, tentative: !to };
    const [lo, hi] = compareDateKeys(from, end) <= 0 ? [from, end] : [end, from];
    return { start: lo, end: hi, tentative: !to };
  }, [selectedRange]);

  const inRange = (d: DateKey) =>
    rangePreview != null && d > rangePreview.start && d < rangePreview.end;

  return (
    <div
      data-slot="calendar"
      className={cn("w-fit select-none text-sm", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 pb-2">
        <button
          type="button"
          aria-label="Previous month"
          disabled={prevDisabled}
          onClick={() => gotoMonth(-1)}
          className="inline-flex size-7 items-center justify-center rounded-md outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span aria-live="polite" className="text-sm font-medium">
          {formatMonthLabel(viewedMonth)}
        </span>
        <button
          type="button"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => gotoMonth(1)}
          className="inline-flex size-7 items-center justify-center rounded-md outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div
        role="grid"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        onMouseLeave={() => onDayHover?.(null)}
      >
        <div role="row" className="grid grid-cols-7">
          {weekdays(weekStartsOn).map((d) => (
            <div
              key={d}
              role="columnheader"
              aria-live="off"
              className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} role="row" className="grid grid-cols-7">
            {grid.slice(row * 7, row * 7 + 7).map((day) => {
              const visible = inMonth(day);
              const disabled = isDayDisabled(day, min, max, disabledDates);
              const isSelected = selected === day;
              const isToday = day === today;
              const rangeStart = rangePreview?.start === day;
              const rangeEnd = rangePreview?.end === day;
              if (!visible) {
                return <div key={day} role="gridcell" aria-disabled="true" className="flex h-9" />;
              }
              return (
                <div
                  key={day}
                  role="gridcell"
                  aria-selected={isSelected || inRange(day) || rangeStart || rangeEnd || undefined}
                  className="flex h-9 items-center justify-center"
                >
                  <button
                    ref={(el) => {
                      if (el) dayRefs.current.set(day, el);
                      else dayRefs.current.delete(day);
                    }}
                    type="button"
                    tabIndex={day === clampDateKey(focusDay, startOfMonth(viewedMonth), endOfMonth(viewedMonth)) ? 0 : -1}
                    aria-disabled={disabled || undefined}
                    aria-current={isToday ? "date" : undefined}
                    onClick={() => select(day)}
                    onMouseEnter={() => onDayHover?.(day)}
                    onFocus={() => setFocusDay(day)}
                    className={cn(
                      "relative inline-flex size-9 items-center justify-center rounded-md text-sm outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      "aria-disabled:pointer-events-none aria-disabled:text-muted-foreground aria-disabled:opacity-50",
                      isToday && !isSelected && "font-semibold after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-primary",
                      isSelected &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      !isSelected && rangeStart && "rounded-r-none bg-primary text-primary-foreground",
                      !isSelected && rangeEnd && "rounded-l-none bg-primary text-primary-foreground",
                      !isSelected && inRange(day) && "rounded-none bg-accent/70 text-accent-foreground",
                      rangePreview?.tentative && (rangeStart || rangeEnd) && !isSelected && "bg-primary/80",
                    )}
                  >
                    {Number(day.slice(8, 10))}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showToday ? (
        <div className="pt-2">
          <button
            type="button"
            disabled={todayDisabled}
            onClick={() => select(today)}
            className="w-full rounded-md py-1 text-xs font-medium text-muted-foreground outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-40"
          >
            Today
          </button>
        </div>
      ) : null}
    </div>
  );
}

// Re-exported so picker consumers never need date arithmetic of their own.
export { daysInMonth, toDateKey, todayKey, addMonths, addDays };
