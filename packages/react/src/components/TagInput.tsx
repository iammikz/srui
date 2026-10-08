"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

export interface TagInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size"> {
  /** The tags, in order. */
  value: string[];
  /** Fires with the full tag list after every add/remove. */
  onChange: (tags: string[]) => void;
  /** Reject duplicates (default) or allow repeats. */
  allowDuplicates?: boolean;
  /** Hard cap on tag count; further adds are ignored. */
  maxTags?: number;
  /** Extra characters that commit a tag (default Enter and comma). */
  delimiters?: string[];
  /** Commit the pending text as a tag on blur (default true). */
  addOnBlur?: boolean;
  /** Per-tag gate; return false to reject (e.g. emails only). */
  validate?: (tag: string) => boolean;
  /** Render size of the chips (default `sm`). */
  size?: "sm" | "md";
  /** Marks the field as invalid — destructive border + `aria-invalid` on the input. */
  invalid?: boolean;
}

/**
 * A chips-and-input tags field: Enter or comma commits, Backspace on an
 * empty input removes the last tag, each chip carries its own remove
 * button. `onChange` always reports the normalized (trimmed) list.
 */
export function TagInput({
  value,
  onChange,
  allowDuplicates = false,
  maxTags,
  delimiters = [","],
  addOnBlur = true,
  validate,
  size = "sm",
  className,
  disabled,
  placeholder,
  invalid,
  ...props
}: TagInputProps) {
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (!allowDuplicates && value.includes(tag)) {
      setDraft("");
      return;
    }
    if (maxTags != null && value.length >= maxTags) return;
    if (validate && !validate(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  return (
    <div
      data-slot="tag-input"
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      onClick={() => !disabled && inputRef.current?.focus()}
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-input/30 px-2 py-1 text-sm outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:outline-destructive",
        invalid && "border-destructive",
        className,
      )}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className={cn(
            "inline-flex items-center gap-1 rounded-md bg-secondary font-medium text-secondary-foreground",
            size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
          )}
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              removeTag(i);
            }}
            className="rounded-sm outline-none transition-colors duration-(--dur-fast) hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        disabled={disabled}
        aria-label="Add tag"
        aria-invalid={invalid || undefined}
        placeholder={value.length === 0 ? placeholder : undefined}
        onChange={(e) => {
          const text = e.target.value;
          const delim = delimiters.find((d) => text.endsWith(d));
          if (delim) addTag(text.slice(0, -delim.length));
          else setDraft(text);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(draft);
          } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
            removeTag(value.length - 1);
          }
        }}
        onBlur={() => addOnBlur && addTag(draft)}
        className="min-w-[6ch] flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        {...props}
      />
    </div>
  );
}
