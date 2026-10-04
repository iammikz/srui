import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DateRangePicker, type DateRange } from "./DateRangePicker";
import { addDays, todayKey } from "../lib/date";

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
};
export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({});
    return (
      <DateRangePicker value={range} onChange={setRange} ariaLabel="Report window" className="w-64" />
    );
  },
};

export const CappedSpan: Story = {
  render: () => (
    <DateRangePicker maxRange="12w" ariaLabel="Capped span" className="w-64" />
  ),
};

export const WithPresets: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({});
    return (
      <DateRangePicker
        value={range}
        onChange={setRange}
        ariaLabel="Preset window"
        className="w-64"
        presets={[
          { label: "Last 7 days", getRange: () => ({ from: addDays(todayKey(), -7), to: todayKey() }) },
          { label: "Last 30 days", getRange: () => ({ from: addDays(todayKey(), -30), to: todayKey() }) },
        ]}
      />
    );
  },
};
