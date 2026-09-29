"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { cn } from "../lib/cn";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps extends React.ComponentPropsWithoutRef<"button"> {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Shown when no option matches the query. English default; override for i18n. */
  emptyText?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Text-filterable select: cmdk list inside a Popover. Matches Select's visual
 * footprint (same trigger height and surface treatment).
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  emptyText = "No results found.",
  className,
  disabled,
  ...triggerProps
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        aria-label={triggerProps["aria-label"]}
        className={cn(
          "surface flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-input/30 px-3 py-2 text-sm outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        aria-expanded={open}
      >
        <span className={cn(!selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className="size-4 shrink-0 opacity-50"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
                onSelect={() => {
                  onChange(o.value === value ? "" : o.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors duration-(--dur-fast) data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                  o.value === value && "font-medium text-primary",
                )}
              >
                {o.label}
                {o.value === value ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                    className="size-4"
                  >
                    <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
