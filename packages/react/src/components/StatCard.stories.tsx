import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-3">
      <StatCard
        label="Monthly revenue"
        value={48219}
        formatValue={(v) => `$${v.toLocaleString()}`}
        delta={{ value: 12.4, direction: "up" }}
      />
      <StatCard label="Active users" value={3128} delta={{ value: 3.1, direction: "up" }} />
      <StatCard
        label="Churn rate"
        value={2}
        formatValue={(v) => `${v}%`}
        delta={{ value: 0.6, direction: "down" }}
      />
    </div>
  ),
};

export const NoDelta: Story = {
  args: { label: "Active users", value: 3128 },
};
