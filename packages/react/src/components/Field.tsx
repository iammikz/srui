"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "./Label";
import { cn } from "../lib/cn";

/**
 * Context-wired form field (shadcn Field parity): generates a control id,
 * collects description/error ids, and `FieldControl` injects
 * `id`/`aria-describedby`/`aria-invalid` into any control. Works with any
 * input-like component — srui's or plain HTML.
 */

interface FieldContextValue {
  id: string;
  invalid?: boolean;
  describedBy: string[];
  registerDescribedBy: (id: string) => void;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useField(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

export interface FieldProps extends React.ComponentProps<"div"> {
  /** Field name; derives the control id (`${name}-control`). */
  name?: string;
  /** Marks the field invalid — destructive styling across label/description. */
  invalid?: boolean;
}

export function Field({ name, invalid, className, ...props }: FieldProps) {
  const autoId = React.useId();
  const id = name ? `${name}-control` : autoId;
  const describedByRef = React.useRef<string[]>([]);
  const [describedBy, setDescribedBy] = React.useState<string[]>([]);

  const registerDescribedBy = React.useCallback((partId: string) => {
    if (describedByRef.current.includes(partId)) return;
    describedByRef.current = [...describedByRef.current, partId];
    setDescribedBy(describedByRef.current);
  }, []);

  const value = React.useMemo(
    () => ({ id, invalid, describedBy, registerDescribedBy }),
    [id, invalid, describedBy, registerDescribedBy],
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        data-slot="field"
        data-invalid={invalid || undefined}
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      />
    </FieldContext.Provider>
  );
}

export function FieldLabel({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<typeof Label>) {
  const field = React.useContext(FieldContext);
  return (
    <Label
      data-slot="field-label"
      htmlFor={htmlFor ?? field?.id}
      invalid={field?.invalid}
      className={className}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const field = React.useContext(FieldContext);
  const id = React.useId();
  React.useEffect(() => {
    field?.registerDescribedBy(id);
  }, [field, id]);
  return (
    <p
      data-slot="field-description"
      id={id}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Error text — presence implies the field is invalid. */
export function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const field = React.useContext(FieldContext);
  const id = React.useId();
  React.useEffect(() => {
    field?.registerDescribedBy(id);
  }, [field, id]);
  if (children == null) return null;
  return (
    <p
      data-slot="field-error"
      id={id}
      role="alert"
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * The control slot: clones its single child, injecting the field id,
 * `aria-describedby` (description + error) and `aria-invalid`.
 * Supports `asChild` passthrough controls the same way.
 */
export function FieldControl({
  children,
  ...props
}: React.ComponentProps<"div">) {
  const field = React.useContext(FieldContext);
  return (
    <Slot
      data-slot="field-control"
      {...(field
        ? {
            id: field.id,
            "aria-describedby": field.describedBy.length
              ? field.describedBy.join(" ")
              : undefined,
            "aria-invalid": field.invalid || undefined,
            "data-invalid": field.invalid || undefined,
          }
        : {})}
      {...props}
    >
      {children}
    </Slot>
  );
}
