"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../lib/cn";

const toggle = tv({
  base: "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow] duration-(--dur-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  variants: {
    variant: {
      default:
        "bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      outline:
        "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
    },
    size: {
      sm: "h-8 px-2",
      default: "h-9 px-2.5",
      lg: "h-10 px-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggle>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    data-slot="toggle"
    className={cn(toggle({ variant, size }), className)}
    {...props}
  />
));
Toggle.displayName = "Toggle";

export { toggle, toggle as toggleStyles };
