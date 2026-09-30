import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      {["default", "comfortable", "compact"].map((v) => (
        <label key={v} className="flex items-center gap-2 text-sm capitalize">
          <RadioGroupItem value={v} /> {v}
        </label>
      ))}
    </RadioGroup>
  ),
};
