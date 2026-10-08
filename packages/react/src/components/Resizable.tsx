"use client";

import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Resizable layout panels (shadcn Resizable parity) over
 * react-resizable-panels v4: a `ResizablePanelGroup` of `ResizablePanel`s
 * separated by draggable `ResizableHandle`s.
 */

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <Group
      data-slot="resizable-panel-group"
      className={cn("flex h-full w-full", className)}
      {...props}
    />
  );
}

/** A resizable panel. Set `defaultSize`/`minSize`/`maxSize`/`collapsible` per panel. */
const ResizablePanel = Panel;

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  /** Renders a visible grip inside the handle. */
  withHandle?: boolean;
}) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "flex w-px shrink-0 items-center justify-center bg-border outline-none transition-colors duration-(--dur-fast) hover:bg-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    >
      {withHandle ? (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-popover">
          <GripVertical className="size-2.5 text-muted-foreground" />
        </div>
      ) : null}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
