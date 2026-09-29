"use client";

import * as React from "react";
import { scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import { curveMonotoneX } from "d3-shape";
import { cn } from "../../lib/cn";

export interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

/**
 * Minimal LineChart variant — no axes, gridlines or labels — sized for
 * inline use (table cell, StatCard-style tile). Same draw-in technique.
 */
export function Sparkline({
  values,
  width = 120,
  height = 36,
  color = "var(--chart-1)",
  strokeWidth = 2,
  className,
}: SparklineProps) {
  const path = React.useMemo(() => {
    if (values.length < 2) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const x = scaleLinear()
      .domain([0, values.length - 1])
      .range([2, width - 2]);
    const y = scaleLinear()
      .domain([min === max ? min - 1 : min, max === max ? max + 1e-9 : max])
      .range([height - 3, 3]);
    const gen = line<number>()
      .x((_, i) => x(i))
      .y((v) => y(v))
      .curve(curveMonotoneX);
    return gen(values) ?? null;
  }, [values, width, height]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("shrink-0", className)}
      role="img"
      aria-label={`Trend: ${values.length} points, last ${values[values.length - 1] ?? "n/a"}`}
    >
      <path
        d={path ?? undefined}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={0}
        className="motion-safe:animate-draw"
      />
    </svg>
  );
}
