"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
  action?: { label: string; onClick: () => void };
  /** How long the toast stays open (ms). Default 5000. */
  duration?: number;
  /** Fires when the toast closes — swipe, X, action, or timeout. */
  onDismiss?: () => void;
}

export type ToastPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "bottom"
  | "bottom-left"
  | "bottom-right";

interface ToastRecord extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  /** Shows a toast; returns its id for `update`/`dismiss`. */
  toast: (options: ToastOptions) => number;
  /** Closes a toast by id. */
  dismiss: (id: number) => void;
  /** Merges options into a live toast (e.g. progress → success). */
  update: (id: number, options: Partial<ToastOptions>) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/** Call from any component below <ToastProvider> to show a toast. */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside a <ToastProvider>.");
  return ctx;
}

const VIEWPORT_POSITIONS: Record<ToastPosition, string> = {
  top: "top-0 left-1/2 -translate-x-1/2 flex-col",
  "top-left": "top-0 left-0 flex-col",
  "top-right": "top-0 right-0 flex-col",
  bottom: "bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse",
  "bottom-left": "bottom-0 left-0 flex-col-reverse",
  "bottom-right": "bottom-0 right-0 flex-col-reverse",
};

/**
 * Place once near the app root (alongside UIProvider). Holds the toast list
 * and renders the viewport; components below it call `toast({...})`.
 */
export function ToastProvider({
  children,
  position = "bottom-right",
}: {
  children: React.ReactNode;
  /** Where toasts stack. Default `bottom-right`. */
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const counter = React.useRef(0);

  const toast = React.useCallback((options: ToastOptions) => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { ...options, id }]);
    return id;
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const update = React.useCallback((id: number, options: Partial<ToastOptions>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...options } : t)));
  }, []);

  const value = React.useMemo(() => ({ toast, dismiss, update }), [toast, dismiss, update]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <Toast key={t.id} record={t} onOpenChange={(open) => !open && dismiss(t.id)} />
        ))}
        <ToastViewport position={position} />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

function Toast({
  record,
  onOpenChange,
}: {
  record: ToastRecord;
  onOpenChange: (open: boolean) => void;
}) {
  const { title, description, variant = "default", action, duration, onDismiss } = record;
  return (
    <ToastPrimitive.Root
      duration={duration ?? 5000}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) onDismiss?.();
      }}
      className={cn(
        "surface group grid w-full items-center gap-1 rounded-lg border p-4 text-sm outline-none motion-safe:animate-scale-in",
        variant === "default" && "border-border bg-popover text-popover-foreground",
        variant === "success" && "border-transparent bg-success text-success-foreground",
        variant === "destructive" &&
          "border-transparent bg-destructive text-destructive-foreground",
      )}
    >
      <div className="grid gap-0.5">
        <ToastTitle>{title}</ToastTitle>
        {description ? <ToastDescription>{description}</ToastDescription> : null}
      </div>
      {action ? (
        <ToastAction altText={action.label} asChild onClick={action.onClick}>
          <button
            type="button"
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium outline-none transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
              variant === "default"
                ? "bg-accent text-accent-foreground hover:bg-accent/70"
                : "bg-black/15 hover:bg-black/25",
            )}
          >
            {action.label}
          </button>
        </ToastAction>
      ) : null}
      <ToastPrimitive.Close
        className={cn(
          "absolute top-2 right-2 rounded-sm p-1 opacity-70 outline-none transition-opacity duration-(--dur-fast) hover:opacity-100 focus-visible:opacity-100",
        )}
        aria-label="Dismiss"
      >
        <X className="size-3.5" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

function ToastTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title className={cn("font-semibold", className)} {...props} />
  );
}

function ToastDescription({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description className={cn("opacity-90", className)} {...props} />
  );
}

function ToastAction({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>) {
  return <ToastPrimitive.Action className={cn("outline-none", className)} {...props} />;
}

function ToastViewport({
  className,
  position = "bottom-right",
  ...props
}: React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> & {
  position?: ToastPosition;
}) {
  return (
    <ToastPrimitive.Viewport
      className={cn(
        "fixed z-[60] flex w-full max-w-[26rem] list-none gap-2 p-4 outline-none",
        VIEWPORT_POSITIONS[position],
        className,
      )}
      {...props}
    />
  );
}

export { Toast, ToastTitle, ToastDescription, ToastAction, ToastViewport };
