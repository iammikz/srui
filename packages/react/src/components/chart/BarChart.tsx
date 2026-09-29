"use client";

import * as React from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { cn } from "../../lib/cn";
import type { LineChartSeries } from "./LineChart";

export type BarChartSeries = LineChartSeries;

export interface BarChartProps {
  labels: string[];
  series: BarChartSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
}

const WIDTH = 600;
const PADDING = { top: 12, right: 12, bottom: 24, left: 36 };

/**
 * Hand-rolled SVG bar chart on d3-scale. Bars grow from their own baseline
 * via `transform-box: fill-box` + `transform-origin: bottom` and the
 * staggered `animate-grow-y` utility. Without the transform-box (see the
 * gotcha table), scaleY would animate from the SVG viewport's origin.
 */
export function BarChart({
  labels,
  series,
  height = 240,
  showGrid = true,
  showLegend = true,
  className,
}: BarChartProps) {
  const allValues = series.flatMap((s) => s.values);
  const max = Math.max(1, ...allValues);

  const x0 = React.useMemo(
    () =>
      scaleBand()
        .domain(labels)
        .range([PADDING.left, WIDTH - PADDING.right])
        .paddingInner(0.3)
        .paddingOuter(0.15),
    [labels],
  );
  const x1 = React.useMemo(
    () =>
      scaleBand()
        .domain(series.map((s) => s.name))
        .range([0, x0.bandwidth()])
        .paddingInner(0.12),
    [series, x0],
  );
  const y = React.useMemo(
    () =>
      scaleLinear()
        .domain([0, max])
        .nice()
        .range([height - PADDING.bottom, PADDING.top]),
    [max, height],
  );

  const ticks = y.ticks(4);
  const colorFor = (i: number, s: BarChartSeries) =>
    s.color ?? `var(--chart-${Math.min(i, 7) + 1})`;
  const baseline = height - PADDING.bottom;
  const barWidth = Math.max(2, x1.bandwidth());

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="w-full"
        role="img"
        aria-label={
          series.length === 1
            ? `Bar chart: ${series[0].name}`
            : `Bar chart with ${series.length} series`
        }
      >
        {showGrid
          ? ticks.map((t) => (
              <g key={t}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={y(t)}
                  y2={y(t)}
                  className="stroke-border"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={PADDING.left - 6}
                  y={y(t)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  {t}
                </text>
              </g>
            ))
          : null}

        {labels.map((l, i) => (
          <text
            key={l + i}
            x={(x0(l) ?? 0) + x0.bandwidth() / 2}
            y={height - 6}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            {l}
          </text>
        ))}

        {series.map((s, si) => {
          const color = colorFor(si, s);
          return (
            <g key={s.name}>
              {s.values.map((v, i) => {
                const barH = Math.max(1, baseline - y(v));
                return (
                  <rect
                    key={i}
                    x={(x0(labels[i]) ?? 0) + (x1(s.name) ?? 0)}
                    y={baseline - barH}
                    width={barWidth}
                    height={barH}
                    rx={Math.min(4, barWidth / 2)}
                    fill={color}
                    className="motion-safe:animate-grow-y"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "bottom",
                      animationDelay: `${(i * series.length + si) * 45}ms`,
                    }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>
      {showLegend && series.length > 1 ? (
        <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {series.map((s, i) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: colorFor(i, s) }}
              />
              {s.name}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}
