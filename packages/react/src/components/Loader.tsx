"use client";

import * as React from "react";
import { cn } from "../lib/cn";

/** Rotating circular indicator. */
export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      role="presentation"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={cn("size-5 motion-safe:animate-spin", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}

/** Three pulsing dots — the quieter alternative to Spinner. */
export function DotsLoader({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      role="presentation"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full bg-current motion-safe:animate-bounce",
            i === 1 && "[animation-delay:120ms]",
            i === 2 && "[animation-delay:240ms]",
          )}
        />
      ))}
    </span>
  );
}

/** Shimmering placeholder block for loading content. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="presentation"
      className={cn(
        "rounded-md bg-muted bg-[linear-gradient(90deg,transparent_0%,color-mix(in_oklab,var(--foreground)_7%,transparent)_50%,transparent_100%)] bg-[length:200%_100%] motion-safe:animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}

export interface LoadingOverlayProps {
  /** Whether work is in flight. The overlay hides/shows around this. */
  active: boolean;
  /** Announced to screen readers; also rendered under the indicator. */
  label?: string;
  /** Delay before the overlay appears (avoids flashing on fast requests). */
  delayMs?: number;
  /** Minimum time the overlay stays visible once shown (avoids flicker). */
  minDisplayMs?: number;
  /** Which indicator to render. */
  variant?: "spinner" | "dots";
  className?: string;
}

/**
 * Covers its nearest positioned ancestor while `active`. Place it inside a
 * `relative` container. Appearance is delayed by `delayMs` and held for at
 * least `minDisplayMs`, so quick operations never flash a spinner.
 */
export function LoadingOverlay({
  active,
  label = "Loading…",
  delayMs = 200,
  minDisplayMs = 400,
  variant = "spinner",
  className,
}: LoadingOverlayProps) {
  const [visible, setVisible] = React.useState(false);
  const shownAtRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) =>
      timers.push(window.setTimeout(fn, ms));

    if (active) {
      schedule(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
      }, delayMs);
    } else if (shownAtRef.current != null) {
      const shownAt = shownAtRef.current;
      shownAtRef.current = null;
      const remaining = minDisplayMs - (Date.now() - shownAt);
      if (remaining > 0) {
        schedule(() => setVisible(false), remaining);
      } else {
        setVisible(false);
      }
    }

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [active, delayMs, minDisplayMs]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "absolute inset-0 z-10 grid place-items-center rounded-[inherit] bg-background/60 backdrop-blur-[2px] motion-safe:animate-fade-in",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        {variant === "spinner" ? <Spinner /> : <DotsLoader />}
        {label ? <span className="text-sm">{label}</span> : null}
      </div>
    </div>
  );
}
