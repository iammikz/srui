"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export type TimelineVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface TimelineItemProps extends Omit<React.ComponentProps<"li">, "title"> {
  /** Bold first line (the event). */
  title: React.ReactNode;
  /** Timestamp or ordering hint, right-aligned (PRUI upgrade). */
  time?: React.ReactNode;
  /** Body copy under the title. */
  description?: React.ReactNode;
  /** Custom marker instead of the status dot. */
  icon?: React.ReactNode;
  /** Dot tone; `default` is the neutral primary dot. */
  variant?: TimelineVariant;
}

const DOTS: Record<TimelineVariant, string> = {
  default: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

/**
 * A vertical activity feed: markers on a spine, one item per event. Purely
 * presentational — feed it reversed or ordered data and it stays a list
 * (`<ol>` semantics via the Timeline wrapper).
 */
export function TimelineItem({
  title,
  time,
  description,
  icon,
  variant = "default",
  className,
  ...props
}: TimelineItemProps) {
  return (
    <li className={cn("relative flex gap-3 pb-6 last:pb-0", className)} {...props}>
      {/* Spine stops at the last item via last:* utilities. */}
      <span
        aria-hidden
        className="absolute top-4 bottom-0 left-[7px] w-px bg-border last:hidden"
      />
      <span
        aria-hidden
        className={cn(
          "relative mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-full",
          icon ? "size-6" : DOTS[variant],
        )}
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3">
        <div className="min-w-0">
          <div className="text-sm font-medium leading-6">{title}</div>
          {description ? (
            <div className="text-sm text-muted-foreground">{description}</div>
          ) : null}
        </div>
        {time ? <span className="text-xs text-muted-foreground">{time}</span> : null}
      </div>
    </li>
  );
}

export function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return <ol className={cn("flex flex-col", className)} {...props} />;
}
