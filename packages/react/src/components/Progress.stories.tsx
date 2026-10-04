import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Determinate: Story = {
  render: () => (
    <Progress value={62} label="Uploading build" showValue />
  ),
};

export const Indeterminate: Story = {
  render: () => <Progress label="Syncing" showValue />,
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Progress value={40} variant="success" label="Healthy" showValue />
      <Progress value={70} variant="warning" label="Degrading" showValue />
      <Progress value={95} variant="destructive" label="Critical" showValue />
    </div>
  ),
};
