import * as React from "react";
import { cn } from "../../lib/cn";

export interface MessageProps extends React.ComponentProps<"li"> {
  /** Side of the stream the message sits on. */
  placement?: "start" | "end";
  /** Leading (start) or trailing (end) avatar slot. */
  avatar?: React.ReactNode;
  /** Sender name — shown above the content on the opposite side. */
  name?: string;
  /** Timestamp — rendered beside the name, muted. */
  time?: string;
  /** Hover-visible action row under the content (copy, reply, …). */
  actions?: React.ReactNode;
}

/**
 * One chat message row: avatar, name/time line, content (Bubbles,
 * Attachments), and a hover action row. Children render as the content.
 */
export function Message({
  placement = "start",
  avatar,
  name,
  time,
  actions,
  className,
  children,
  ...props
}: MessageProps) {
  const end = placement === "end";
  return (
    <li
      data-slot="message"
      data-placement={placement}
      className={cn("group flex w-full gap-2", end && "flex-row-reverse", className)}
      {...props}
    >
      {avatar ? <div className="shrink-0 self-start">{avatar}</div> : null}
      <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-1", end && "items-end")}>
        {name || time ? (
          <div
            className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground",
              end && "flex-row-reverse",
            )}
          >
            {name ? <span className="font-medium text-foreground">{name}</span> : null}
            {time ? <span>{time}</span> : null}
          </div>
        ) : null}
        {children}
        {actions ? (
          <div
            className={cn(
              "flex items-center gap-1 opacity-0 transition-opacity duration-(--dur-fast) focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none",
              end && "flex-row-reverse",
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </li>
  );
}
