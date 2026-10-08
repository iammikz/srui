"use client";

import * as React from "react";
import { scaleLinear, scalePoint } from "d3-scale";
import { line, area as d3area, curveMonotoneX } from "d3-shape";
import { cn } from "../../lib/cn";
import { ChartTooltip } from "./ChartTooltip";

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
  /** Hover/keyboard tooltip with the values at the nearest point (default true). */
  tooltip?: boolean;
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
  tooltip = true,
  className,
}: LineChartProps) {
  const [active, setActive] = React.useState<number | null>(null);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
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

  // Nearest-label lookup for the hover/keyboard tooltip.
  const points = labels.map((l) => x(l) ?? PADDING.left);
  const nearestIndex = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const viewX = ((clientX - rect.left) / rect.width) * WIDTH;
    let best = 0;
    let bestDist = Infinity;
    points.forEach((px, i) => {
      const d = Math.abs(px - viewX);
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
              ? `Line chart: ${series[0].name}`
              : `Line chart with ${series.length} series`
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

        {tooltip && active != null ? (
          <g aria-hidden="true">
            <line
              x1={points[active]}
              x2={points[active]}
              y1={PADDING.top}
              y2={height - PADDING.bottom}
              className="stroke-border"
              strokeWidth="1"
            />
            {series.map((s, i) => (
              <circle
                key={s.name}
                cx={points[active]}
                cy={y(s.values[active] ?? 0)}
                r="3.5"
                fill={colorFor(i, s)}
                stroke="var(--popover)"
                strokeWidth="1.5"
              />
            ))}
          </g>
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
            leftPct={(points[active] / WIDTH) * 100}
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
