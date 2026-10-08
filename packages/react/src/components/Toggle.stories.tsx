import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Italic, Underline } from "lucide-react";
import { Toggle } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle defaultPressed aria-label="Toggle bold">
        <Bold />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle underline">
        <Underline />
      </Toggle>
      <Toggle disabled aria-label="Disabled toggle">
        <Bold />
      </Toggle>
    </div>
  ),
};
