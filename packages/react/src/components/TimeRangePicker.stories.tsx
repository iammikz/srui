import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimeRangePicker, type TimeRange } from "./TimeRangePicker";

const meta: Meta<typeof TimeRangePicker> = {
  title: "Components/TimeRangePicker",
  component: TimeRangePicker,
};
export default meta;

type Story = StoryObj<typeof TimeRangePicker>;

export const Default: Story = {
  render: () => {
    const [range, setRange] = useState<TimeRange>({});
    return (
      <TimeRangePicker value={range} onChange={setRange} ariaLabel="Shift window" className="w-56" />
    );
  },
};

export const BusinessHours: Story = {
  render: () => (
    <TimeRangePicker min="08:00" max="18:00" minuteStep={30} hour12={false} ariaLabel="Open hours" className="w-56" />
  ),
};
