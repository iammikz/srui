import * as React from "react";
import { FileText, Image as ImageIcon, X } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatBytes } from "../FileUpload";

export interface AttachmentProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** File name. */
  name: string;
  /** File size in bytes — rendered human-readable when given. */
  size?: number;
  /** `image` renders the thumbnail when `previewUrl` is set; `file` the icon chip. */
  kind?: "file" | "image";
  /** Image thumbnail source. */
  previewUrl?: string;
  /** Upload progress 0–100 — renders a progress bar while < 100. */
  progress?: number;
  /** Renders the ✕ and fires on click. */
  onRemove?: () => void;
}

/**
 * A message attachment chip: image thumbnail or file icon + name + size,
 * optional upload progress, optional remove button.
 */
export function Attachment({
  name,
  size,
  kind = "file",
  previewUrl,
  progress,
  onRemove,
  className,
  ...props
}: AttachmentProps) {
  return (
    <div
      data-slot="attachment"
      className={cn(
        "surface relative flex items-center gap-2.5 rounded-lg border border-border bg-popover p-2 pr-8 text-sm",
        kind === "image" && "w-52 flex-none",
        className,
      )}
      {...props}
    >
      {kind === "image" && previewUrl ? (
        <img
          src={previewUrl}
          alt={name}
          className="size-12 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {kind === "image" ? <ImageIcon className="size-5" /> : <FileText className="size-5" />}
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-medium text-foreground">{name}</span>
        {size != null ? (
          <span className="text-xs text-muted-foreground">{formatBytes(size)}</span>
        ) : null}
        {progress != null && progress < 100 ? (
          <span
            role="progressbar"
            aria-label={`Uploading ${name}`}
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1 w-24 overflow-hidden rounded-full bg-muted"
          >
            <span
              className="block h-full rounded-full bg-primary transition-[width] duration-(--dur-fast)"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </span>
        ) : null}
      </span>
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${name}`}
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 rounded-sm p-0.5 text-muted-foreground outline-none transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}
