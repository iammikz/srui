import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Calendar } from "./Calendar";
import { addDays, todayKey } from "../lib/date";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(todayKey());
    return <Calendar value={value} onSelect={setValue} aria-label="Due date" />;
  },
};

export const BoundedMondayFirst: Story = {
  render: () => (
    <Calendar
      defaultValue={addDays(todayKey(), 3)}
      min={todayKey()}
      max={addDays(todayKey(), 40)}
      weekStartsOn={1}
      aria-label="Bounded calendar"
    />
  ),
};

export const DisabledWeekends: Story = {
  render: () => (
    <Calendar
      disabledDates={(d) => {
        const day = new Date(d + "T00:00:00").getDay();
        return day === 0 || day === 6;
      }}
      aria-label="Weekdays only"
    />
  ),
};
