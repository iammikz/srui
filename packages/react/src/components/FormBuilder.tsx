"use client";

import * as React from "react";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { FormField } from "./FormField";
import { Input } from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { Textarea } from "./Textarea";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  placeholder?: string;
  /** Helper text (validation errors take precedence). */
  hint?: string;
}

export interface FormBuilderSlots {
  /** Extra content after the submit button (e.g. a cancel link). */
  footer?: React.ReactNode;
}

export interface FormBuilderClassNames {
  form?: string;
  field?: string;
  submit?: string;
}

export interface FormBuilderProps<Schema extends z.ZodType> {
  schema: Schema;
  fields: FormFieldConfig[];
  onSubmit: (values: z.infer<Schema>) => void | Promise<void>;
  submitLabel?: string;
  /** Tier 2 — slots + per-part classNames. */
  slots?: FormBuilderSlots;
  classNames?: FormBuilderClassNames;
}

/**
 * Tier 3 headless hook — a react-hook-form instance bound to the Zod
 * schema, plus per-field binding helpers. Zero JSX; build any form layout.
 */
export function useFormBuilder<Schema extends z.ZodType>(
  schema: Schema,
  fields: FormFieldConfig[],
): {
  form: UseFormReturn<z.infer<Schema>>;
  /** id + resolved Zod error for a field, pre-paired for FormField. */
  fieldProps: (name: string) => { id: string; name: string; error?: string };
  configOf: (name: string) => FormFieldConfig | undefined;
} {
  const form = useForm<z.infer<Schema>>({
    resolver: zodResolver(schema) as never,
  });

  const fieldProps = React.useCallback(
    (name: string) => ({
      id: `srui-form-${name}`,
      name,
      error: (form.formState.errors as Record<string, { message?: string }>)[name]
        ?.message as string | undefined,
    }),
    [form.formState.errors],
  );
  const configOf = React.useCallback(
    (name: string) => fields.find((f) => f.name === name),
    [fields],
  );

  return { form, fieldProps, configOf };
}

interface RhfFieldProps {
  onChange: (...args: unknown[]) => void;
  onBlur: () => void;
  value: unknown;
  name: string;
  ref: React.RefCallback<HTMLElement>;
}

function FieldControl({
  config,
  id,
  field,
  invalid,
}: {
  config: FormFieldConfig;
  id: string;
  field: RhfFieldProps;
  invalid: boolean;
}) {
  const { onChange, onBlur, value, name, ref } = field;

  switch (config.type) {
    case "checkbox":
      return (
        <Checkbox
          id={id}
          name={name}
          checked={!!value}
          onCheckedChange={(v) => onChange(v)}
          onBlur={onBlur}
          ref={ref}
        />
      );
    case "select":
      return (
        <Select
          name={name}
          value={(value as string) ?? ""}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger id={id} aria-invalid={invalid || undefined}>
            <SelectValue placeholder={config.placeholder ?? "Select…"} />
          </SelectTrigger>
          <SelectContent>
            {(config.options ?? []).map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "textarea":
      return (
        <Textarea
          id={id}
          name={name}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={config.placeholder}
          invalid={invalid}
          ref={ref}
        />
      );
    default:
      return (
        <Input
          id={id}
          name={name}
          type={config.type}
          value={(value as string | number) ?? ""}
          onChange={(e) =>
            onChange(config.type === "number" ? Number(e.target.value) : e.target.value)
          }
          onBlur={onBlur}
          placeholder={config.placeholder}
          invalid={invalid}
          aria-invalid={invalid || undefined}
          ref={ref}
        />
      );
  }
}

/**
 * Schema-driven form: one FormField per config entry, wired to
 * react-hook-form + the Zod schema. Field-level Zod errors render under
 * the field; the submit Button shows its loading state while onSubmit
 * is pending.
 */
export function FormBuilder<Schema extends z.ZodType>({
  schema,
  fields,
  onSubmit,
  submitLabel = "Submit",
  slots,
  classNames,
}: FormBuilderProps<Schema>) {
  const { form, fieldProps } = useFormBuilder(schema, fields);
  const [pending, setPending] = React.useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    setPending(true);
    try {
      await onSubmit(values as z.infer<Schema>);
    } finally {
      setPending(false);
    }
  });

  return (
    <form noValidate onSubmit={handleSubmit} className={cn("grid gap-5", classNames?.form)}>
      {fields.map((config) => {
        const { id, error } = fieldProps(config.name);
        return (
          <FormField
            key={config.name}
            label={config.label}
            htmlFor={id}
            error={error}
            hint={config.hint}
            className={classNames?.field}
          >
            <Controller
              control={form.control}
              name={config.name as never}
              render={({ field }) => (
                <FieldControl config={config} id={id} field={field as RhfFieldProps} invalid={!!error} />
              )}
            />
          </FormField>
        );
      })}
      <div className={cn("flex items-center gap-3", classNames?.submit)}>
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
        {slots?.footer}
      </div>
    </form>
  );
}
