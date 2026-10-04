"use client";

import * as React from "react";
import {
  addDays,
  Calendar,
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  todayKey,
  type DateRange,
  type TimeRange,
} from "@iammikz/srui";

export function CalendarDemo() {
  const [value, setValue] = React.useState(todayKey());
  return <Calendar value={value} onSelect={setValue} aria-label="Due date" />;
}

export function CalendarBoundedDemo() {
  return (
    <Calendar
      defaultValue={addDays(todayKey(), 3)}
      min={todayKey()}
      max={addDays(todayKey(), 40)}
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
        { label: "Last 7 days", getRange: () => ({ from: addDays(todayKey(), -7), to: todayKey() }) },
        { label: "Last 30 days", getRange: () => ({ from: addDays(todayKey(), -30), to: todayKey() }) },
        { label: "This month", getRange: () => ({ from: todayKey().slice(0, 8) + "01", to: todayKey() }) },
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
