"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Card, CardDescription, CardHeader, CardTitle } from "./Card";
import { LoadingOverlay } from "./Loader";
import { LineChart, type LineChartSeries } from "./chart/LineChart";
import { BarChart } from "./chart/BarChart";

export interface ChartCardSlots {
  /** Extra content at the end of the header row (beside the time ranges). */
  headerAction?: React.ReactNode;
}

export interface ChartCardClassNames {
  root?: string;
  header?: string;
  content?: string;
  timeRanges?: string;
}

export interface ChartCardProps {
  title: string;
  description?: string;
  chart: "line" | "bar";
  labels: string[];
  /** Either full series definitions or a single `{ values }` shorthand. */
  series: LineChartSeries[] | { values: number[] };
  /** e.g. ["7d", "30d", "90d"] — renders a segmented button group. */
  timeRanges?: string[];
  onTimeRangeChange?: (range: string) => void;
  loading?: boolean;
  /** Fill under the line (line charts only; see LineChart's area prop). */
  area?: boolean;
  /** Tier 2 — slots + per-part classNames. */
  slots?: ChartCardSlots;
  classNames?: ChartCardClassNames;
}

function normalizeSeries(
  series: ChartCardProps["series"],
  fallbackName: string,
): LineChartSeries[] {
  if (Array.isArray(series)) return series;
  return [{ name: fallbackName, values: series.values }];
}

/**
 * Tier 3 headless hook — the ChartCard's interactive state with zero JSX:
 * the active time range plus a `chartKey` that changes with it, so
 * consumers can remount (and re-animate) any chart on range changes.
 */
export function useChartCard({
  timeRanges,
  onTimeRangeChange,
}: {
  timeRanges?: string[];
  onTimeRangeChange?: (range: string) => void;
} = {}) {
  const [activeRange, setActiveRange] = React.useState<string>(
    timeRanges?.[0] ?? "",
  );
  const range = activeRange || timeRanges?.[0] || "";
  const setRange = React.useCallback(
    (next: string) => {
      setActiveRange(next);
      onTimeRangeChange?.(next);
    },
    [onTimeRangeChange],
  );
  // chartKey changes with the range → remount charts → draw-in replays.
  return { activeRange: range, setActiveRange: setRange, chartKey: range };
}

/**
 * Card + LineChart/BarChart + optional time-range switcher and loading
 * overlay. Switching time ranges remounts the chart (via key) so the
 * draw-in animation re-triggers instead of morphing in place.
 */
export function ChartCard({
  title,
  description,
  chart,
  labels,
  series,
  timeRanges,
  onTimeRangeChange,
  loading = false,
  area = false,
  slots,
  classNames,
}: ChartCardProps) {
  const { activeRange, setActiveRange, chartKey } = useChartCard({
    timeRanges,
    onTimeRangeChange,
  });
  const normalized = normalizeSeries(series, title);

  return (
    <Card className={cn("gap-3", classNames?.root)}>
      <CardHeader className={cn(classNames?.header)}>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {(timeRanges?.length || slots?.headerAction) && (
          <div className="col-start-2 row-span-2 row-start-1 flex items-start gap-2">
            {slots?.headerAction}
            {timeRanges?.length ? (
              <div
                role="group"
                aria-label="Time range"
                className={cn(
                  "flex items-center gap-0.5 rounded-lg bg-muted p-0.5",
                  classNames?.timeRanges,
                )}
              >
                {timeRanges.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setActiveRange(r)}
                    aria-pressed={activeRange === r}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-medium outline-none transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      activeRange === r
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </CardHeader>
      <div className={cn("relative px-3", classNames?.content)}>
        <div key={chartKey}>
          {chart === "line" ? (
            <LineChart labels={labels} series={normalized} height={220} area={area} />
          ) : (
            <BarChart labels={labels} series={normalized} height={220} />
          )}
        </div>
        <LoadingOverlay active={loading} label={`Loading ${title}…`} />
      </div>
    </Card>
  );
}
