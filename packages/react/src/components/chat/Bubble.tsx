import * as React from "react";
import { cn } from "../../lib/cn";

export interface BubbleProps extends React.ComponentProps<"div"> {
  /** `sent` is the primary-filled outgoing bubble; `received` the surface one. */
  variant?: "sent" | "received";
  /** Side of the message row — defaults from `variant` (`end` / `start`). */
  placement?: "start" | "end";
  /** Leading avatar slot. */
  avatar?: React.ReactNode;
}

/**
 * A chat bubble: variant-styled, one-per-message or stacked. Wrap in
 * `Message` for avatars/names/timestamps; plain `Bubble`s compose too.
 */
export function Bubble({
  variant = "received",
  placement,
  avatar,
  className,
  children,
  ...props
}: BubbleProps) {
  const side = placement ?? (variant === "sent" ? "end" : "start");
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      className={cn(
        "flex w-full items-end gap-2",
        side === "end" ? "justify-end" : "justify-start",
        className,
      )}
      {...props}
    >
      {avatar && side === "start" ? (
        <div className="shrink-0">{avatar}</div>
      ) : null}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3.5 py-2 text-sm",
          variant === "sent"
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "surface rounded-bl-sm border border-border bg-popover text-popover-foreground",
        )}
      >
        {children}
      </div>
      {avatar && side === "end" ? (
        <div className="shrink-0 self-start">{avatar}</div>
      ) : null}
    </div>
  );
}
