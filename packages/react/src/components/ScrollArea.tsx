"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../lib/cn";

export interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  /** Which scrollbars to mount (default `"vertical"`). */
  orientation?: "vertical" | "horizontal" | "both";
}

/**
 * Themed scrollbars over native scrolling: content goes straight in — the
 * Viewport (required by Radix for the machinery to work) and the default
 * scrollbar are composed for you. `orientation` mounts the scrollbar set;
 * size the box itself (`h-48`, `w-56`, …).
 */
const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    { className, children, orientation = "vertical", ...props },
    ref,
  ) {
    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          // Tabbable so keyboard users can scroll the region (axe
          // scrollable-region-focusable); native overflow scrolls on arrows.
          tabIndex={0}
          className="size-full rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:outline-ring"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        {orientation !== "horizontal" ? <ScrollBar /> : null}
        {orientation !== "vertical" ? <ScrollBar orientation="horizontal" /> : null}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  },
);

export interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> {
  orientation?: "vertical" | "horizontal";
}

function ScrollBar({ className, orientation = "vertical", ...props }: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      orientation={orientation}
      className={cn(
        "z-10 flex touch-none select-none p-0.5 transition-colors duration-(--dur-fast)",
        orientation === "vertical" && "h-full w-2.5",
        orientation === "horizontal" && "h-2.5 w-full flex-col",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border transition-colors duration-(--dur-fast) hover:bg-muted-foreground/40" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

function ScrollViewport({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>) {
  return (
    <ScrollAreaPrimitive.Viewport
      className={cn("size-full rounded-[inherit] outline-none", className)}
      {...props}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
  );
}

export { ScrollArea, ScrollBar, ScrollViewport };
