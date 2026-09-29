"use client";

import * as React from "react";
import { scaleLinear, scalePoint } from "d3-scale";
import { line, area as d3area, curveMonotoneX } from "d3-shape";
import { cn } from "../../lib/cn";

export interface LineChartSeries {
  name: string;
  values: number[];
  /** Any CSS color. Defaults to the chart palette (var(--chart-1..8)). */
  color?: string;
}

export interface LineChartProps {
  labels: string[];
  series: LineChartSeries[];
  /** Pixel height of the plot area (viewBox is always 600 × height). */
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  /** Fill under the line (added in Phase 5; harmless in Phase 0 usage). */
  area?: boolean;
  className?: string;
}

const WIDTH = 600;
const PADDING = { top: 12, right: 12, bottom: 24, left: 36 };

/**
 * Hand-rolled SVG line chart on d3-scale/d3-shape. Each path draws itself in
 * using the `pathLength={1}` + stroke-dasharray/dashoffset trick: the inline
 * `strokeDashoffset: 0` is the final state, and the `animate-draw` keyframes
 * animate from offset 1 — so reduced-motion users simply see the full line
 * (see the gotcha table in the implementation plan).
 */
export function LineChart({
  labels,
  series,
  height = 240,
  showGrid = true,
  showLegend = true,
  area = false,
  className,
}: LineChartProps) {
  const allValues = series.flatMap((s) => s.values);
  const min = Math.min(0, ...allValues);
  const max = Math.max(1, ...allValues);

  const x = React.useMemo(
    () =>
      scalePoint()
        .domain(labels)
        .range([PADDING.left, WIDTH - PADDING.right])
        .padding(0.5),
    [labels],
  );
  const y = React.useMemo(
    () =>
      scaleLinear()
        .domain([min, max])
        .nice()
        .range([height - PADDING.bottom, PADDING.top]),
    [min, max, height],
  );

  const lineGen = React.useMemo(
    () =>
      line<number>()
        .x((_, i) => x(labels[i]) ?? PADDING.left)
        .y((v) => y(v))
        .curve(curveMonotoneX),
    [x, y, labels],
  );

  const areaGen = React.useMemo(
    () =>
      d3area<number>()
        .x((_, i) => x(labels[i]) ?? PADDING.left)
        .y0(height - PADDING.bottom)
        .y1((v) => y(v))
        .curve(curveMonotoneX),
    [x, y, height, labels],
  );

  const ticks = y.ticks(4);
  const colorFor = (i: number, s: LineChartSeries) =>
    s.color ?? `var(--chart-${Math.min(i, 7) + 1})`;

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="w-full"
        role="img"
        aria-label={
          series.length === 1
            ? `Line chart: ${series[0].name}`
            : `Line chart with ${series.length} series`
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

        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 8) === 0 || i === labels.length - 1 ? (
            <text
              key={l + i}
              x={x(l)}
              y={height - 6}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {l}
            </text>
          ) : null,
        )}

        {series.map((s, i) => {
          const color = colorFor(i, s);
          return (
            <g key={s.name}>
              {area ? (
                <path
                  d={areaGen(s.values) ?? undefined}
                  fill={color}
                  opacity="0.15"
                  className="motion-safe:animate-fade-in"
                />
              ) : null}
              <path
                d={lineGen(s.values) ?? undefined}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={0}
                className="motion-safe:animate-draw"
                style={
                  series.length > 1
                    ? { animationDelay: `${i * 120}ms` }
                    : undefined
                }
              />
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
