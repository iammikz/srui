"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../lib/cn";
import { Card, CardAction, CardContent, CardHeader } from "./Card";

export interface StatCardProps {
  label: string;
  value: number;
  /** Format the number before display (currency, percent, …). */
  formatValue?: (v: number) => string;
  /** Optional change indicator shown top-right. */
  delta?: { value: number; direction: "up" | "down" };
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A KPI tile: label, big animated number, optional delta. The value counts up
 * over `--dur-slow` (skipped entirely under reduced motion) and fades in.
 */
export function StatCard({
  label,
  value,
  formatValue,
  delta,
  className,
}: StatCardProps) {
  const [display, setDisplay] = React.useState(0);
  const formatted = React.useMemo(
    () => (formatValue ? formatValue(display) : String(display)),
    [display, formatValue],
  );

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 500; // --dur-slow
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <Card className={cn("gap-2", className)}>
      <CardHeader>
        <span className="text-sm text-muted-foreground">{label}</span>
        {delta ? (
          <CardAction>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium",
                delta.direction === "up"
                  ? "text-success"
                  : "text-destructive",
              )}
            >
              {delta.direction === "up" ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
              {delta.value}
            </span>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-3xl font-semibold tabular-nums motion-safe:animate-count-fade",
          )}
        >
          {formatted}
        </div>
      </CardContent>
    </Card>
  );
}
