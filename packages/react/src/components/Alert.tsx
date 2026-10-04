"use client";

import * as React from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "destructive";

export interface AlertProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Visual + semantic tone. `info` is the neutral default. */
  variant?: AlertVariant;
  /** Bold first line. */
  title?: React.ReactNode;
  /** Body copy; children also work directly. */
  children?: React.ReactNode;
  /** Overrides the variant's default icon; `null` disables it. */
  icon?: LucideIcon | null;
  /** Renders a dismiss button and fires when it's clicked. */
  onDismiss?: () => void;
}

const ICONS: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  destructive: CircleAlert,
};

const TONES: Record<AlertVariant, string> = {
  info: "text-info border-info/40 bg-info/10 [&_svg]:text-info",
  success: "text-success border-success/40 bg-success/10 [&_svg]:text-success",
  warning: "text-warning border-warning/40 bg-warning/10 [&_svg]:text-warning",
  destructive:
    "text-destructive border-destructive/40 bg-destructive/10 [&_svg]:text-destructive",
};

/**
 * A static, inline callout for statuses and problems the page should
 * announce without interrupting: tone variants, optional dismiss, and a
 * `role="alert"` mapping for the destructive/warning tones.
 */
export function Alert({
  variant = "info",
  title,
  children,
  icon,
  onDismiss,
  className,
  ...props
}: AlertProps) {
  const Icon = icon === null ? null : (icon ?? ICONS[variant]);
  return (
    <div
      data-slot="alert"
      role={variant === "destructive" || variant === "warning" ? "alert" : "status"}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-sm",
        TONES[variant],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon aria-hidden className="mt-0.5 size-4 shrink-0" /> : null}
      <div className="flex-1 [&>strong]:font-semibold [&_a]:underline">
        {title ? <div className="mb-0.5 font-semibold text-foreground">{title}</div> : null}
        {children ? <div className="text-foreground/85">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="rounded-sm p-0.5 text-muted-foreground outline-none transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
