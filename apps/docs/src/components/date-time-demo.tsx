"use client";

import * as React from "react";
import {
  addDays,
  Calendar,
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  type DateRange,
  type TimeRange,
} from "@iammikz/srui";

/**
 * Fixed "today" for the demos: the prerendered pages are screenshot-baselined
 * (visual.spec.ts), so real `todayKey()` values would rot the baselines daily.
 * The week containing this date is stable across presets/min/max below.
 */
const DEMO_TODAY = "2026-01-15";

export function CalendarDemo() {
  const [value, setValue] = React.useState(DEMO_TODAY);
  return (
    <Calendar value={value} onSelect={setValue} defaultMonth="2026-01" aria-label="Due date" />
  );
}

export function CalendarBoundedDemo() {
  return (
    <Calendar
      defaultValue={addDays(DEMO_TODAY, 3)}
      min={DEMO_TODAY}
      max={addDays(DEMO_TODAY, 40)}
      defaultMonth="2026-01"
      weekStartsOn={1}
      aria-label="Bounded calendar"
    />
  );
}

export function DatePickerDemo() {
  const [value, setValue] = React.useState("");
  return (
    <DatePicker value={value} onChange={setValue} ariaLabel="Due date" className="w-56" />
  );
}

export function DateTimePickerDemo() {
  const [value, setValue] = React.useState("");
  return (
    <DatePicker timepicker value={value} onChange={setValue} ariaLabel="Starts at" className="w-64" />
  );
}

export function DateRangeDemo() {
  const [range, setRange] = React.useState<DateRange>({});
  return (
    <DateRangePicker value={range} onChange={setRange} ariaLabel="Report window" className="w-64" />
  );
}

export function DateRangeCappedDemo() {
  return <DateRangePicker maxRange="12w" ariaLabel="Capped span" className="w-64" />;
}

export function DateRangePresetsDemo() {
  const [range, setRange] = React.useState<DateRange>({});
  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      ariaLabel="Preset window"
      className="w-64"
      presets={[
        { label: "Last 7 days", getRange: () => ({ from: addDays(DEMO_TODAY, -7), to: DEMO_TODAY }) },
        { label: "Last 30 days", getRange: () => ({ from: addDays(DEMO_TODAY, -30), to: DEMO_TODAY }) },
        { label: "This month", getRange: () => ({ from: DEMO_TODAY.slice(0, 8) + "01", to: DEMO_TODAY }) },
      ]}
    />
  );
}

export function TimePickerDemo() {
  const [value, setValue] = React.useState("09:30");
  return <TimePicker value={value} onChange={setValue} ariaLabel="Meeting time" className="w-40" />;
}

export function TimeRangeDemo() {
  const [range, setRange] = React.useState<TimeRange>({});
  return (
    <TimeRangePicker
      value={range}
      onChange={setRange}
      min="08:00"
      max="18:00"
      minuteStep={30}
      hour12={false}
      ariaLabel="Shift window"
      className="w-56"
    />
  );
}
