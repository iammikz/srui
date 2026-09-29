import * as React from "react";
import { cn } from "../lib/cn";
import { Label } from "./Label";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  /** Validation error — takes precedence over `hint` (they never both render). */
  error?: string;
  /** Helper text shown when there is no error. */
  hint?: string;
  /** The Input / Select / Textarea / … control. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Label + control + inline feedback. Renders `error` in text-destructive or
 * `hint` in text-muted-foreground — never both.
 */
export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-feedback`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-feedback`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
