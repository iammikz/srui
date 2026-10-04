"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Visible-page window with ellipsis markers: `1 … 4 5 6 … 12` — first and
 * last page always shown, `siblings` around the current page.
 */
export function usePaginationRange(
  page: number,
  totalPages: number,
  siblings = 1,
): Array<number | "ellipsis-start" | "ellipsis-end"> {
  return React.useMemo(() => {
    if (totalPages <= 0) return [];
    const clamp = (n: number) => Math.min(Math.max(n, 1), totalPages);
    const current = clamp(page);
    // Enough room: show everything (4 + siblings*2 covers the full width).
    if (totalPages <= 4 + siblings * 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const middleStart = Math.max(clamp(current - siblings), 2);
    const middleEnd = Math.min(clamp(current + siblings), totalPages - 1);
    const items: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];
    if (middleStart > 2) items.push("ellipsis-start");
    for (let p = middleStart; p <= middleEnd; p++) items.push(p);
    if (middleEnd < totalPages - 1) items.push("ellipsis-end");
    items.push(totalPages);
    return items;
  }, [page, totalPages, siblings]);
}

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol className={cn("flex flex-row items-center gap-1", className)} {...props} />
  );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={className} {...props} />;
}

export interface PaginationLinkProps extends React.ComponentProps<"button"> {
  /** Marks the current page — `aria-current="page"` + selected styling. */
  isActive?: boolean;
}

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md text-sm font-medium outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-[current=page]:border aria-[current=page]:border-ring aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, children = "Previous", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Go to previous page"
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-sm font-medium outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <ChevronLeft aria-hidden className="size-4" />
      {children}
    </button>
  );
}

function PaginationNext({ className, children = "Next", ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Go to next page"
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-sm font-medium outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden className="size-4" />
    </button>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4 text-muted-foreground" />
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
