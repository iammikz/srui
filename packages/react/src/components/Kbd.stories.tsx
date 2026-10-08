import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "./Kbd";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
};
export default meta;

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Kbd>⌘</Kbd> + <Kbd>K</Kbd> opens the command palette
    </div>
  ),
};
