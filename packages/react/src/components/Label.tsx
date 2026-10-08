"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../lib/cn";

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /** Marks the associated field as invalid — destructive label text. */
  invalid?: boolean;
}

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, invalid, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-invalid={invalid || undefined}
    className={cn(
      "flex select-none items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      "data-[invalid]:text-destructive",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";
