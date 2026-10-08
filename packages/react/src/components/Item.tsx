import * as React from "react";
import { cn } from "../lib/cn";

/**
 * List-item layout primitive: media + content (title/description) + trailing
 * end slot, in a row or a column.
 */
function Item({
  className,
  variant = "row",
  ...props
}: React.ComponentProps<"div"> & {
  /** `row` lays media/content/end out horizontally; `column` stacks them. */
  variant?: "row" | "column";
}) {
  return (
    <div
      data-slot="item"
      data-variant={variant}
      className={cn(
        "flex w-full gap-3 data-[variant=row]:flex-row data-[variant=column]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

/** Leading icon/avatar/thumbnail. `align="start"` pins it to the first line. */
function ItemMedia({
  className,
  align = "center",
  ...props
}: React.ComponentProps<"div"> & { align?: "start" | "center" }) {
  return (
    <div
      data-slot="item-media"
      data-align={align}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground data-[align=start]:mt-0.5 [&_svg]:size-5 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Trailing slot — meta text, badges, actions. */
function ItemEnd({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-end"
      className={cn("ml-auto flex shrink-0 items-center gap-2 self-center", className)}
      {...props}
    />
  );
}

export { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemEnd };
