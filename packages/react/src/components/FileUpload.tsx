"use client";

import * as React from "react";
import { FileUp, Paperclip, X, type LucideIcon } from "lucide-react";
import { cn } from "../lib/cn";

export interface FileUploadProps {
  /** Controlled file list. */
  value?: File[];
  /** Fires with the full list after every add/remove. */
  onChange?: (files: File[]) => void;
  /** Fires with only the newly accepted files (side-effect uploads). */
  onFilesAdded?: (files: File[]) => void;
  /** `accept` attribute forwarded to the input (`.pdf,image/*`). */
  accept?: string;
  /** Allow more than one file (default true). */
  multiple?: boolean;
  /** Reject files above this size, per file (bytes). */
  maxSizeBytes?: number;
  /** Cap the total file count. */
  maxFiles?: number;
  disabled?: boolean;
  /** Override the dropzone icon. */
  icon?: LucideIcon;
  /** Dropzone call to action. */
  prompt?: string;
  /** Hint under the prompt (defaults to a generated accept/size summary). */
  hint?: string;
  /** Hide the file list (you own rendering it). */
  hideFileList?: boolean;
  className?: string;
  "aria-label"?: string;
}

export interface FileRejection {
  file: File;
  reason: "type" | "size" | "count";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function typeAllowed(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(",").some((token) => {
    const t = token.trim().toLowerCase();
    if (t.startsWith(".")) return file.name.toLowerCase().endsWith(t);
    if (t.endsWith("/*")) return file.type.startsWith(t.slice(0, -1));
    return file.type === t;
  });
}

/**
 * A keyboard-accessible dropzone + file list: click, Enter, or drop adds
 * files; per-file type/size/count rejections come back via `onReject`
 * (upgradable surface) and render as reason badges on the list.
 */
export function FileUpload({
  value,
  onChange,
  onFilesAdded,
  accept,
  multiple = true,
  maxSizeBytes,
  maxFiles,
  disabled,
  icon: Icon = FileUp,
  prompt = "Drag files here or click to browse",
  hint,
  hideFileList = false,
  className,
  "aria-label": ariaLabel = "Upload files",
  onReject,
}: FileUploadProps & { onReject?: (rejections: FileRejection[]) => void }) {
  const [files, setFiles] = React.useState<File[]>(value ?? []);
  const controlled = value !== undefined;
  const list = controlled ? value : files;
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const acceptHint =
    hint ??
    [
      accept ? accept.replace(/,/g, ", ") : "any type",
      maxSizeBytes ? `≤ ${formatBytes(maxSizeBytes)}` : undefined,
    ]
      .filter(Boolean)
      .join(" · ");

  const setList = (next: File[]) => {
    if (!controlled) setFiles(next);
    onChange?.(next);
  };

  const ingest = (incoming: FileList | File[]) => {
    if (disabled) return;
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    for (const file of Array.from(incoming)) {
      if (!typeAllowed(file, accept)) rejected.push({ file, reason: "type" });
      else if (maxSizeBytes && file.size > maxSizeBytes) rejected.push({ file, reason: "size" });
      else if (maxFiles != null && list.length + accepted.length >= maxFiles)
        rejected.push({ file, reason: "count" });
      else accepted.push(file);
      if (!multiple) break;
    }
    onReject?.(rejected);
    if (accepted.length) {
      const next = multiple ? [...list, ...accepted] : [accepted[0]];
      setList(next);
      onFilesAdded?.(accepted);
    }
  };

  const remove = (index: number) => setList(list.filter((_, i) => i !== index));

  return (
    <div data-slot="file-upload" className={cn("flex flex-col gap-2", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          ingest(e.dataTransfer.files);
        }}
        data-drag-over={dragOver || undefined}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-8 text-center outline-none transition-colors duration-(--dur-fast) hover:border-ring hover:bg-accent/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          "data-[drag-over]:border-ring data-[drag-over]:bg-accent/30",
        )}
      >
        <Icon aria-hidden className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">{prompt}</span>
        <span className="text-xs text-muted-foreground">{acceptHint}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={ariaLabel}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          ingest(e.target.files ?? []);
          e.target.value = "";
        }}
      />
      {!hideFileList && list.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {list.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
            >
              <Paperclip aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{file.name}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {formatBytes(file.size)}
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => remove(i)}
                className="rounded-sm p-0.5 text-muted-foreground outline-none transition-colors duration-(--dur-fast) hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export { formatBytes };
