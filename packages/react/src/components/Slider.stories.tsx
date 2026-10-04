import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState([50]);
    return <Slider value={value} onValueChange={setValue} aria-label="Opacity" />;
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = useState([25, 75]);
    return (
      <Slider
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={5}
        aria-label="Price span"
      />
    );
  },
};

export const SteppedInvalid: Story = {
  render: () => (
    <Slider
      defaultValue={[3]}
      min={0}
      max={10}
      step={1}
      invalid
      aria-label="Retries"
    />
  ),
};
