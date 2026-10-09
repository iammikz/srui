"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { cn } from "../lib/cn";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  /** Selected value (single mode), controlled. */
  value?: string;
  /** Selected values (multi mode), controlled — implies `multiple`. */
  values?: string[];
  /** Initial selection without controlling (single mode). */
  defaultValue?: string;
  /** Initial selection without controlling (multi mode) — implies `multiple`. */
  defaultValues?: string[];
  /** Multi-select mode: items toggle with checks and the popover stays open. */
  multiple?: boolean;
  /** Single mode: fires with the picked value (empty string deselects). */
  onChange?: (value: string) => void;
  /** Multi mode: fires with the full selection after every toggle. */
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
  /** Shown when no option matches the query. English default; override for i18n. */
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  /** Marks the combobox as invalid — destructive trigger border + `aria-invalid`. */
  invalid?: boolean;
  /** Accessible name for the trigger button (no visible label). */
  "aria-label"?: string;
}

/**
 * Text-filterable select: cmdk list inside a Popover. Matches Select's visual
 * footprint (same trigger height and surface treatment). Single selection by
 * default; `multiple` (or `values`/`defaultValues`) switches to check-toggle
 * multi-select that keeps the popover open.
 */
export function Combobox({
  options,
  value,
  values,
  defaultValue,
  defaultValues,
  multiple = false,
  onChange,
  onValuesChange,
  placeholder = "Select…",
  emptyText = "No results found.",
  className,
  disabled,
  invalid,
  ...triggerProps
}: ComboboxProps) {
  const isMulti = multiple || values !== undefined || defaultValues !== undefined;
  const [open, setOpen] = React.useState(false);
  const [internalSingle, setInternalSingle] = React.useState(defaultValue ?? "");
  const [internalMulti, setInternalMulti] = React.useState<string[]>(defaultValues ?? []);

  const currentSingle = value ?? internalSingle;
  const currentMulti = values ?? internalMulti;
  const selectedLabels = options
    .filter((o) => currentMulti.includes(o.value))
    .map((o) => o.label);
  const triggerLabel = isMulti
    ? selectedLabels.length > 0
      ? selectedLabels.join(", ")
      : placeholder
    : (options.find((o) => o.value === currentSingle)?.label ?? placeholder);

  const pickSingle = (option: ComboboxOption) => {
    const next = option.value === currentSingle ? "" : option.value;
    setInternalSingle(next);
    onChange?.(next);
    setOpen(false);
  };

  const toggleMulti = (option: ComboboxOption) => {
    const next = currentMulti.includes(option.value)
      ? currentMulti.filter((v) => v !== option.value)
      : [...currentMulti, option.value];
    setInternalMulti(next);
    onValuesChange?.(next);
  };

  const isSelected = (option: ComboboxOption) =>
    isMulti ? currentMulti.includes(option.value) : option.value === currentSingle;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        aria-label={triggerProps["aria-label"]}
        aria-invalid={invalid || undefined}
        className={cn(
          "surface flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-input/30 px-3 py-2 text-sm outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:outline-destructive",
          invalid && "border-destructive",
          className,
        )}
        aria-expanded={open}
      >
        <span
          className={cn(
            "truncate",
            (isMulti ? currentMulti.length === 0 : currentSingle === "") &&
              "text-muted-foreground",
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-1" align="start">
        <Command>
          <Command.Input
            placeholder={placeholder}
            className="flex h-9 w-full rounded-sm bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Command.List className="max-h-64 overflow-y-auto outline-none">
            <Command.Empty className="px-2 py-4 text-center text-sm text-muted-foreground">
              {emptyText}
            </Command.Empty>
            {options.map((o) => (
              <Command.Item
                key={o.value}
                value={o.label}
                onSelect={() => (isMulti ? toggleMulti(o) : pickSingle(o))}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors duration-(--dur-fast) data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                  !isMulti && o.value === currentSingle && "font-medium text-primary",
                )}
              >
                {o.label}
                <Check
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 transition-opacity duration-(--dur-fast)",
                    isSelected(o) ? "opacity-100" : "opacity-0",
                  )}
                />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
