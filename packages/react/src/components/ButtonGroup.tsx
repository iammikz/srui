import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Joins sibling buttons into one control: corners merge, a hairline seam
 * separates them, and hover/focus raise the active button above its
 * neighbours. Wrap any buttons (Button, Toggle, …) as direct children.
 */
function ButtonGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  /** `horizontal` merges left/right corners; `vertical` top/bottom. */
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        "inline-flex w-fit items-center [&>*]:relative [&>*]:z-0 [&>*]:rounded-none [&>*:focus-visible]:z-10 [&>*:hover]:z-10",
        orientation === "horizontal"
          ? "[&>*:not(:first-child)]:ml-px [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md"
          : "flex-col items-stretch [&>*:not(:first-child)]:mt-px [&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md",
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup };
