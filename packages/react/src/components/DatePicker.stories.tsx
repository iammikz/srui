import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "./DatePicker";
import { addDays, todayKey } from "../lib/date";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <DatePicker value={value} onChange={setValue} ariaLabel="Due date" className="w-56" />;
  },
};

export const DateTime: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <DatePicker timepicker value={value} onChange={setValue} ariaLabel="Starts at" className="w-64" />
    );
  },
};

export const Bounded: Story = {
  render: () => (
    <DatePicker
      min={todayKey()}
      max={addDays(todayKey(), 30)}
      ariaLabel="Within a month"
      className="w-56"
    />
  ),
};
