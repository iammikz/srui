"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface ProgressProps extends React.ComponentProps<"div"> {
  /** 0–100; omit (or `null`) for the indeterminate animation. */
  value?: number | null;
  /** Upper bound; value is normalized against it (PRUI upgrade). */
  max?: number;
  /** Announced label; also rendered above the bar when `showLabel` is on. */
  label?: string;
  /** Render the label + percentage readout above the bar. */
  showValue?: boolean;
  /** Height preset. */
  size?: "sm" | "md";
  /** Status tone; `indeterminate` ignores it (PRUI upgrade). */
  variant?: "default" | "success" | "warning" | "destructive";
}

const VARIANT_BAR: Record<string, string> = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

/**
 * Determinate or indeterminate progress with `role="progressbar"` semantics.
 * Determinate mode announces `aria-valuenow/min/max` and the optional
 * value readout; indeterminate animates a partial bar across the track.
 */
export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  size = "md",
  variant = "default",
  className,
  ...props
}: ProgressProps) {
  const indeterminate = value == null || Number.isNaN(Number(value));
  const pct = Math.min(100, Math.max(0, (Number(value ?? 0) / max) * 100));

  return (
    <div
      data-slot="progress"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {showValue ? (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span aria-hidden>
            {indeterminate ? "…" : `${Math.round(pct)}%`}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : Math.round(Number(value))}
        aria-valuetext={indeterminate ? "Loading" : `${Math.round(pct)}%`}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          size === "sm" ? "h-1.5" : "h-2.5",
        )}
      >
        {indeterminate ? (
          <div className="absolute inset-y-0 w-1/3 rounded-full bg-primary motion-safe:animate-progress-indeterminate" />
        ) : (
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-(--dur-base) ease-(--ease-out)",
              VARIANT_BAR[variant],
            )}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}
