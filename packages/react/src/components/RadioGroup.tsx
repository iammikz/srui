"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "../lib/cn";

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  /** Marks the group as invalid — destructive rings on the items. */
  invalid?: boolean;
}

export const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, invalid, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    aria-invalid={invalid || undefined}
    data-invalid={invalid || undefined}
    className={cn("group grid gap-2", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "aspect-square size-4 shrink-0 rounded-full border border-border bg-input/30 outline-none transition-[color,background-color,border-color,box-shadow] duration-(--dur-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary",
      "group-data-[invalid]:border-destructive group-data-[invalid]:outline-destructive group-data-[invalid]:data-[state=checked]:border-destructive",
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="grid place-items-center">
      <div className="size-2 rounded-full bg-primary motion-safe:animate-scale-in" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";
