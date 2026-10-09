"use client";

import * as React from "react";
import { cn } from "../../lib/cn";

/**
 * A chat transcript container that sticks to the bottom: it starts scrolled
 * to the newest message, follows new content down while the user is at (or
 * near) the bottom, and stops following the moment they scroll up to read —
 * resuming when they return to the bottom.
 */
export function MessageScroller({
  className,
  children,
  tabIndex,
  onScroll,
  ...props
}: React.ComponentProps<"ol">) {
  const ref = React.useRef<HTMLOListElement | null>(null);
  const stick = React.useRef(true);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "auto") => {
    const el = ref.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  React.useLayoutEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Follow new content while pinned; ignore growth while reading history.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      if (stick.current) scrollToBottom("smooth");
    });
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [scrollToBottom]);

  return (
    <ol
      ref={ref}
      data-slot="message-scroller"
      tabIndex={tabIndex ?? 0}
      className={cn(
        "flex list-none flex-col gap-3 overflow-y-auto outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      onScroll={(e) => {
        const el = e.currentTarget;
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
        onScroll?.(e);
      }}
      {...props}
    >
      {children}
    </ol>
  );
}
