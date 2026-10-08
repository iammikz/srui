"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { VariantProps } from "tailwind-variants";
import { toggle } from "./Toggle";
import { cn } from "../lib/cn";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggle>>({});

/** A set of `Toggle`s sharing one value: single (`type="single"`) or many. */
function ToggleGroup({
  className,
  variant,
  size,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggle>) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive.Root
        data-slot="toggle-group"
        className={cn("flex w-fit items-center gap-1 rounded-md", className)}
        {...props}
      />
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggle>) {
  const context = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggle({ variant: variant ?? context.variant, size: size ?? context.size }),
        "min-w-0 flex-1 shrink-0 rounded-sm",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
