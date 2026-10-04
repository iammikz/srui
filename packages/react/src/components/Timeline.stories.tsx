import type { Meta, StoryObj } from "@storybook/react";
import { Timeline, TimelineItem } from "./Timeline";

const meta: Meta<typeof Timeline> = {
  title: "Components/Timeline",
  component: Timeline,
};
export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => (
    <Timeline className="w-80">
      <TimelineItem title="Deployed" time="12:04" description="Build 128 is live on production." variant="success" />
      <TimelineItem title="Tests passed" time="12:01" description="412 tests, 0 failures." />
      <TimelineItem title="Build queued" time="11:58" description="main @ a92e86b" variant="info" />
      <TimelineItem title="Rollback" time="09:30" description="Build 127 rolled back after error spike." variant="destructive" />
    </Timeline>
  ),
};
