"use client";

import * as React from "react";
import * as DrawerPrimitive from "@radix-ui/react-dialog";
import { cn } from "../lib/cn";

const Drawer = DrawerPrimitive.Root;
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerClose = DrawerPrimitive.Close;

export interface DrawerContentProps
  extends React.ComponentProps<typeof DrawerPrimitive.Content> {
  /** Drag past this fraction of the drawer's height dismisses it (default 1/3). */
  dismissThreshold?: number;
}

/**
 * Bottom sheet on Dialog primitives with a grab handle and pointer
 * drag-to-dismiss: the sheet tracks the finger while dragging and closes
 * past `dismissThreshold` (keyboard and Escape dismiss always work).
 */
function DrawerContent({
  className,
  children,
  dismissThreshold = 0.33,
  ...props
}: DrawerContentProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const drag = React.useRef<{ startY: number; height: number } | null>(null);
  const [dragY, setDragY] = React.useState(0);
  const dragging = dragY > 0;

  const onPointerDown = (e: React.PointerEvent) => {
    // Only the handle area starts a drag; content stays scrollable.
    if (!(e.target instanceof HTMLElement) || !e.target.closest("[data-drawer-handle]")) {
      return;
    }
    drag.current = {
      startY: e.clientY,
      height: contentRef.current?.offsetHeight ?? 1,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setDragY(Math.max(0, e.clientY - drag.current.startY));
  };

  const endDrag = () => {
    if (!drag.current) return;
    const passed = dragY / drag.current.height > dismissThreshold;
    drag.current = null;
    setDragY(0);
    if (passed) {
      // Radix honors a cancel event on the dialog; emulate Escape dismissal.
      contentRef.current?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    }
  };

  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-[2px] motion-safe:animate-fade-in" />
      <DrawerPrimitive.Content
        ref={contentRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "surface fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-xl border-t border-border bg-popover text-popover-foreground shadow-lg outline-none motion-safe:animate-slide-in-bottom",
          dragging && "transition-none",
          !dragging && "transition-transform duration-(--dur-base) ease-(--ease-out)",
          className,
        )}
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
        {...props}
      >
        <div
          data-drawer-handle
          className="flex cursor-grab touch-none justify-center py-3"
          aria-hidden
        >
          <div className="h-1.5 w-10 rounded-full bg-border" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 pb-3", className)} {...props} />;
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-lg font-semibold leading-none", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col-reverse gap-2 px-6 pb-6 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
};
