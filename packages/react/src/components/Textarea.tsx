"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Marks the textarea as invalid — red border + aria-invalid. */
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-md border border-border bg-input/30 px-3 py-2 text-base outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-destructive aria-invalid:outline-destructive",
        invalid && "border-destructive",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
