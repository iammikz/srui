"use client";
import { cn } from "../../lib/cn";

export interface DonutChartProps {
  /** Text under the value (e.g. "Storage"). */
  label: string;
  /** Portion of the ring, 0–100. */
  value: number;
  /** Rendered after the value (e.g. "%"). */
  suffix?: string;
  /** SVG size in px. */
  size?: number;
  /** Arc color. */
  color?: string;
  className?: string;
}

/**
 * Donut/gauge on the same `pathLength={1}` technique as LineChart: the
 * resting `strokeDashoffset` is the final state (1 − value/100), and the
 * `animate-draw` keyframes sweep from 1 — so reduced-motion users see the
 * complete arc immediately.
 */
export function DonutChart({
  label,
  value,
  suffix = "",
  size = 160,
  color = "var(--chart-2)",
  className,
}: DonutChartProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const rest = 1 - clamped / 100;
  const strokeWidth = size / 12;

  return (
    <figure className={cn("inline-flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          role="img"
          aria-label={`${label}: ${clamped}${suffix}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="50"
            cy="50"
            r={42}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />
          <circle
            cx="50"
            cy="50"
            r={42}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={rest}
            className="motion-safe:animate-draw"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-2xl font-semibold tabular-nums">
            {Math.round(clamped)}
            <span className="text-base font-medium text-muted-foreground">{suffix}</span>
          </span>
        </div>
      </div>
      <figcaption className="text-sm text-muted-foreground">{label}</figcaption>
    </figure>
  );
}
