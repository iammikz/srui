import type { Meta, StoryObj } from "@storybook/react";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import { DonutChart } from "./DonutChart";
import { Sparkline } from "./Sparkline";

const meta: Meta<typeof LineChart> = {
  title: "Components/Charts",
  component: LineChart,
};
export default meta;

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export const LineSingleSeries: StoryObj<typeof LineChart> = {
  name: "LineChart",
  render: () => (
    <div className="w-full max-w-xl">
      <LineChart
        labels={labels}
        series={[{ name: "Revenue", values: [42, 51, 48, 61, 59, 72, 81] }]}
      />
    </div>
  ),
};

export const LineMultiSeries: StoryObj<typeof LineChart> = {
  name: "LineChart (multi-series + area)",
  render: () => (
    <div className="w-full max-w-xl">
      <LineChart
        area
        labels={labels}
        series={[
          { name: "Revenue", values: [42, 51, 48, 61, 59, 72, 81] },
          { name: "Signups", values: [12, 18, 15, 21, 26, 24, 31] },
        ]}
      />
    </div>
  ),
};

export const Bars: StoryObj<typeof BarChart> = {
  name: "BarChart (grouped)",
  render: () => (
    <div className="w-full max-w-xl">
      <BarChart
        labels={labels}
        series={[
          { name: "2024", values: [12, 18, 15, 21, 26, 24, 31] },
          { name: "2025", values: [15, 22, 19, 26, 30, 29, 38] },
        ]}
      />
    </div>
  ),
};

export const Donut: StoryObj<typeof DonutChart> = {
  name: "DonutChart (gauge)",
  render: () => <DonutChart label="Storage" value={68} suffix="%" />,
};

export const InlineSparkline: StoryObj<typeof Sparkline> = {
  name: "Sparkline (inline)",
  render: () => (
    <div className="flex items-center gap-6">
      <div>
        <div className="text-xs text-muted-foreground">Weekly signups</div>
        <div className="text-xl font-semibold tabular-nums">1,284</div>
      </div>
      <Sparkline values={[12, 18, 15, 21, 26, 24, 31, 29, 38]} />
    </div>
  ),
};
