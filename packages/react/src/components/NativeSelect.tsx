"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * A styled native `<select>` — SSR-friendly, works without JS, submits with
 * plain forms. For rich popovers, search, and item rendering use `Select`.
 */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  Omit<React.ComponentProps<"select">, "size"> & {
    /** Height: `sm` h-8, `default` h-9, `lg` h-10. */
    size?: "sm" | "default" | "lg";
    /** Marks the field as invalid — destructive border + `aria-invalid`. */
    invalid?: boolean;
  }
>(function NativeSelect({ className, size = "default", invalid, children, ...props }, ref) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        data-slot="native-select"
        data-size={size}
        aria-invalid={invalid || undefined}
        className={cn(
          "surface flex h-9 w-full appearance-none items-center rounded-md border border-border bg-input/30 px-3 py-2 pr-9 text-sm outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" && "h-8 py-1 text-xs",
          size === "lg" && "h-10",
          "aria-invalid:border-destructive aria-invalid:outline-destructive",
          invalid && "border-destructive",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 opacity-50"
      />
    </div>
  );
});
