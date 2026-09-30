import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChartCard } from "./ChartCard";

const meta: Meta<typeof ChartCard> = {
  title: "Super-components/ChartCard",
  component: ChartCard,
};
export default meta;

type Story = StoryObj<typeof ChartCard>;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const ranges: Record<string, number[]> = {
  "7d": [12, 18, 15, 21, 26, 24, 31],
  "30d": [42, 51, 48, 61, 59, 72, 81],
  "90d": [80, 74, 69, 77, 83, 91, 96],
};

export const LineWithRanges: Story = {
  render: () => {
    const [range, setRange] = useState("30d");
    return (
      <div className="w-full max-w-xl">
        <ChartCard
          title="Revenue"
          description="Range switches remount the chart."
          chart="line"
          area
          labels={months}
          series={[{ name: "Revenue", values: ranges[range] }]}
          timeRanges={["7d", "30d", "90d"]}
          onTimeRangeChange={setRange}
        />
      </div>
    );
  },
};

export const BarLoading: Story = {
  name: "Bar + loading overlay",
  render: () => (
    <div className="w-full max-w-xl">
      <ChartCard
        title="Signups"
        chart="bar"
        labels={months}
        series={[{ name: "Signups", values: ranges["7d"] }]}
        loading
      />
    </div>
  ),
};
