"use client";

import * as React from "react";
import { ChevronRight, Menu } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";

export interface AppShellBreadcrumb {
  label: string;
  href?: string;
}

export interface AppShellSlots {
  /** Extra content at the end of the topbar (after the drawer toggle). */
  topbarEnd?: React.ReactNode;
  /** Content pinned to the bottom of the desktop sidebar. */
  sidebarFooter?: React.ReactNode;
}

export interface AppShellClassNames {
  root?: string;
  sidebar?: string;
  topbar?: string;
  main?: string;
  breadcrumbs?: string;
}

export interface AppShellProps {
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
  breadcrumbs?: AppShellBreadcrumb[];
  children: React.ReactNode;
  /** Tier 2 — slots + per-part classNames. */
  slots?: AppShellSlots;
  classNames?: AppShellClassNames;
}

export const APP_SHELL_BREAKPOINT = 768;

/**
 * Tier 3 headless hook — the responsive-shell state with zero JSX: the
 * desktop media-query flag plus drawer open/close. Use it to build a
 * completely different shell layout than the Tier 1 component renders.
 */
export function useAppShell() {
  const [isDesktop, setIsDesktop] = React.useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(`(min-width: ${APP_SHELL_BREAKPOINT}px)`).matches;
  });
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${APP_SHELL_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      // Crossing the breakpoint closes the drawer: the sidebar is either
      // docked (desktop) or hidden (mobile), never both.
      if (e.matches) setDrawerOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return {
    isDesktop,
    drawerOpen,
    setDrawerOpen,
    openDrawer: React.useCallback(() => setDrawerOpen(true), []),
    closeDrawer: React.useCallback(() => setDrawerOpen(false), []),
  };
}

function SidebarContent({
  children,
  footer,
  className,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col gap-2 bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <nav aria-label="Sidebar" className="flex-1 overflow-y-auto p-3">
        {children}
      </nav>
      {footer ? <div className="border-t border-sidebar-border p-3">{footer}</div> : null}
    </div>
  );
}

/**
 * App layout shell: a fixed-width sidebar on desktop (`sidebar` token
 * colors) that collapses into a Dialog-based drawer below 768px — the
 * drawer reuses Phase 0's Dialog rather than a second overlay system.
 * The main content area keeps a stable width across the breakpoint swap.
 */
export function AppShell({
  sidebar,
  topbar,
  breadcrumbs,
  children,
  slots,
  classNames,
}: AppShellProps) {
  const { isDesktop, drawerOpen, setDrawerOpen } = useAppShell();

  return (
    <div className={cn("flex min-h-svh w-full", classNames?.root)}>
      {isDesktop ? (
        <aside
          className={cn(
            "sticky top-0 hidden h-svh shrink-0 border-r border-sidebar-border md:block",
            classNames?.sidebar,
          )}
        >
          <SidebarContent footer={slots?.sidebarFooter}>{sidebar}</SidebarContent>
        </aside>
      ) : (
        <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
            // flex (over the grid base) + overflow-hidden: the SidebarContent
            // column needs a real height constraint, else the nav's
            // overflow-y-auto never engages and the long menu overflows.
            className="surface left-0 top-0 flex h-svh max-w-[calc(100%-4rem)] w-72 translate-x-0 translate-y-0 flex-col overflow-hidden rounded-none border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground motion-safe:animate-fade-in"
          >
            <DialogTitle className="sr-only">Navigation</DialogTitle>
            <SidebarContent footer={slots?.sidebarFooter}>{sidebar}</SidebarContent>
          </DialogContent>
        </Dialog>
      )}

      <div className={cn("flex min-w-0 flex-1 flex-col", classNames?.main)}>
        <header
          className={cn(
            "surface sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-4",
            classNames?.topbar,
          )}
        >
          {!isDesktop ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu />
            </Button>
          ) : null}
          {topbar}
          <div className="ml-auto flex items-center gap-2">{slots?.topbarEnd}</div>
        </header>

        {breadcrumbs?.length ? (
          <nav
            aria-label="Breadcrumb"
            className={cn("border-b border-border px-4 py-2", classNames?.breadcrumbs)}
          >
            <ol className="flex flex-wrap items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, i) => {
                const last = i === breadcrumbs.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                    {crumb.href && !last ? (
                      <a
                        href={crumb.href}
                        className="text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground"
                      >
                        {crumb.label}
                      </a>
                    ) : (
                      <span
                        aria-current={last ? "page" : undefined}
                        className={last ? "font-medium" : "text-muted-foreground"}
                      >
                        {crumb.label}
                      </span>
                    )}
                    {!last ? (
                      <ChevronRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
