import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimePanel, TimePicker } from "./TimePicker";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
};
export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("09:30");
    return <TimePicker value={value} onChange={setValue} ariaLabel="Meeting time" className="w-40" />;
  },
};

export const TwentyFourHourQuarterSteps: Story = {
  render: () => {
    const [value, setValue] = useState("14:15");
    return (
      <TimePicker
        value={value}
        onChange={setValue}
        hour12={false}
        minuteStep={15}
        ariaLabel="Slot"
        className="w-40"
      />
    );
  },
};

export const PanelOnly: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("13:45");
    return <TimePanel value={value} onChange={setValue} aria-label="Inline time" />;
  },
};
