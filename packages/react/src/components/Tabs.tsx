"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../lib/cn";

const Tabs = TabsPrimitive.Root;
const TabsAnimationContext = React.createContext(false);

/**
 * Positions the sliding pill over the active trigger. The pill mounts
 * already in place (no transition on first paint), then travels between
 * triggers as `data-state` flips. Placement state lives on the DOM node
 * (data-placed) so it survives any re-render lifecycle quirks.
 */
function useTabsIndicator(
  listRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  const pillRef = React.useRef<HTMLSpanElement | null>(null);

  const position = React.useCallback(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const active = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!active) {
      pill.style.opacity = "0";
      return;
    }
    const firstPlacement = !pill.dataset.placed;
    if (firstPlacement) pill.style.transition = "none";
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.height = `${active.offsetHeight}px`;
    pill.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
    pill.style.opacity = "1";
    if (firstPlacement) {
      // Land the start position with transitions off; re-enable on the
      // next frame so only subsequent moves animate.
      requestAnimationFrame(() => {
        pill.style.transition = "";
        pill.dataset.placed = "1";
      });
    }
  }, [listRef]);

  React.useLayoutEffect(() => {
    if (!enabled) return;
    const list = listRef.current;
    if (!list) return;
    position();
    // Radix flips data-state on the triggers as the value changes.
    const mo = new MutationObserver(position);
    mo.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state"],
    });
    // Font loads / container resize shift trigger geometry.
    const ro = new ResizeObserver(position);
    ro.observe(list);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, [position, listRef, enabled]);

  return pillRef;
}

function TabsList({
  className,
  children,
  animation = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  /** Enable the sliding active-tab highlight. Defaults to false. */
  animation?: boolean;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const pillRef = useTabsIndicator(listRef, animation);

  return (
    <TabsAnimationContext.Provider value={animation}>
      <TabsPrimitive.List
        ref={listRef}
        className={cn(
          "relative inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
          className,
        )}
        {...props}
      >
        {/* The active pill slides between triggers when animation is enabled. */}
        {animation && (
          <span
            ref={pillRef}
            aria-hidden
            className={cn(
              "surface absolute top-0 left-0 z-0 rounded-md bg-background",
              "motion-safe:transition-[transform,width,height,opacity] motion-safe:duration-(--dur-base) motion-safe:ease-(--ease-spring)",
            )}
          />
        )}
        {children}
      </TabsPrimitive.List>
    </TabsAnimationContext.Provider>
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  const animation = React.useContext(TabsAnimationContext);
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "relative z-10 inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
        animation
          ? "motion-safe:transition-colors motion-safe:duration-(--dur-base) motion-safe:ease-(--ease-out)"
          : "data-[state=active]:surface data-[state=active]:bg-background",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "outline-none motion-safe:animate-fade-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
