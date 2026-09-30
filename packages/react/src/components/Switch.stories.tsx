import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm">
      <Switch defaultChecked /> Airplane mode
    </label>
  ),
};

