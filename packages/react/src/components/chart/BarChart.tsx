"use client";

import * as React from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { cn } from "../../lib/cn";
import { ChartTooltip } from "./ChartTooltip";
import type { LineChartSeries } from "./LineChart";

export type BarChartSeries = LineChartSeries;

export interface BarChartProps {
  labels: string[];
  series: BarChartSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  /** Hover/keyboard tooltip with the values of the hovered bar group (default true). */
  tooltip?: boolean;
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
  tooltip = true,
  className,
}: BarChartProps) {
  const [active, setActive] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
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

  // Band centers for the hover/keyboard tooltip.
  const centers = labels.map((l) => (x0(l) ?? 0) + x0.bandwidth() / 2);
  const nearestIndex = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const viewX = ((clientX - rect.left) / rect.width) * WIDTH;
    let best = 0;
    let bestDist = Infinity;
    centers.forEach((cx, i) => {
      const d = Math.abs(cx - viewX);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (active == null) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setActive(labels.length - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive(Math.max(0, active - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive(Math.min(labels.length - 1, active + 1));
    } else if (e.key === "Home") {
      setActive(0);
    } else if (e.key === "End") {
      setActive(labels.length - 1);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };

  const activeTopPct =
    active != null
      ? (Math.min(...series.map((s) => y(s.values[active] ?? 0))) / height) * 100
      : 0;

  return (
    <figure
      className={cn("w-full outline-none", tooltip && "relative", className)}
      tabIndex={tooltip ? 0 : undefined}
      onKeyDown={tooltip ? onKey : undefined}
      {...(tooltip ? { "aria-label": "Use arrow keys to inspect values" } : {})}
    >
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="w-full"
          role="img"
          aria-label={
            series.length === 1
              ? `Bar chart: ${series[0].name}`
              : `Bar chart with ${series.length} series`
          }
          onPointerMove={tooltip ? (e) => setActive(nearestIndex(e.clientX)) : undefined}
          onPointerLeave={tooltip ? () => setActive(null) : undefined}
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

        {tooltip && active != null ? (
          <rect
            aria-hidden="true"
            x={x0(labels[active]) ?? 0}
            y={PADDING.top}
            width={x0.bandwidth()}
            height={baseline - PADDING.top}
            fill="currentColor"
            className="text-foreground/5"
            rx="4"
          />
        ) : null}
        </svg>
        {tooltip && active != null ? (
          <ChartTooltip
            label={labels[active]}
            rows={series.map((s, i) => ({
              name: s.name,
              value: s.values[active] ?? 0,
              color: colorFor(i, s),
            }))}
            leftPct={(centers[active] / WIDTH) * 100}
            topPct={activeTopPct}
          />
        ) : null}
      </div>
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
