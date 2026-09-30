"use client";

import * as React from "react";
import { Button, ChartCard } from "@iammikz/srui";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const ranges: Record<string, number[]> = {
  "7d": [12, 18, 15, 21, 26, 24, 31],
  "30d": [42, 51, 48, 61, 59, 72, 81],
  "90d": [80, 74, 69, 77, 83, 91, 96],
};

/** Interactive ChartCard demo: ranges + loading toggle. */
export function ChartCardDemo() {
  const [range, setRange] = React.useState("30d");
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="my-6">
      <ChartCard
        title="Revenue"
        description="Switching ranges remounts the chart — watch the draw-in replay."
        chart="line"
        area
        labels={months}
        series={[{ name: "Revenue", values: ranges[range] }]}
        timeRanges={["7d", "30d", "90d"]}
        onTimeRangeChange={setRange}
        loading={loading}
        slots={{
          headerAction: (
            <Button size="sm" variant="ghost" onClick={() => setLoading((v) => !v)}>
              {loading ? "Stop" : "Simulate loading"}
            </Button>
          ),
        }}
      />
    </div>
  );
}
