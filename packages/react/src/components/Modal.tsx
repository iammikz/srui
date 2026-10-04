"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";

export interface ModalProps {
  /** Controlled open state. */
  open: boolean;
  /** Fires when the modal requests to close (Escape, overlay, X). */
  onOpenChange: (open: boolean) => void;
  /** Bold heading; required for accessibility unless you compose Dialog yourself. */
  title: React.ReactNode;
  /** Muted subheading. */
  description?: React.ReactNode;
  /** Body content. */
  children?: React.ReactNode;
  /** Right-aligned action row (Buttons usually). */
  footer?: React.ReactNode;
  /** Width preset (default `md`). */
  size?: "sm" | "md" | "lg" | "xl";
  /** Hide the corner × (when the footer owns dismissal). */
  showCloseButton?: boolean;
  className?: string;
}

const SIZES: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

/**
 * An opinionated one-prop modal: title/description/footer slots over the
 * Dialog primitives with focus trap, Escape/overlay dismissal, and centered
 * scale-in. Reach for `Dialog` when you need trigger composition or custom
 * layout instead.
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={showCloseButton} className={cn(SIZES[size], className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
