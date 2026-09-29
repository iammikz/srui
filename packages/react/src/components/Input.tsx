import * as React from "react";
import { cn } from "../lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Marks the input as invalid — red border + aria-invalid. */
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-border bg-input/30 px-3 py-1 text-base outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-destructive aria-invalid:outline-destructive",
        invalid && "border-destructive",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
