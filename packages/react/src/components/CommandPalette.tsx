"use client";

import * as React from "react";
import { Command } from "cmdk";
import { cn } from "../lib/cn";
import { Dialog, DialogContent, DialogTitle } from "./Dialog";

export interface CommandItem {
  label: string;
  onSelect: () => void;
  /** Display-only shortcut hint, e.g. "⌘S". */
  shortcut?: string;
}

export interface CommandPaletteSlots {
  /** Shown when no command matches the query. English default; override for i18n. */
  empty?: React.ReactNode;
  /** Content under the list (e.g. hint row). */
  footer?: React.ReactNode;
}

export interface CommandPaletteClassNames {
  dialog?: string;
  input?: string;
  list?: string;
  item?: string;
}

export interface CommandPaletteProps {
  commands: CommandItem[];
  /** Controlled open state (defaults to internal state + Cmd/Ctrl+K). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  /** Tier 2 — slots + per-part classNames. */
  slots?: CommandPaletteSlots;
  classNames?: CommandPaletteClassNames;
}

/**
 * Tier 3 headless hook — the palette's open state plus the Cmd/Ctrl+K
 * listener (registered once, cleaned up on unmount). Zero JSX.
 */
export function useCommandPalette(onOpen?: (open: boolean) => void) {
  const [open, setOpen] = React.useState(false);
  const openRef = React.useRef(open);
  openRef.current = open;

  const toggle = React.useCallback(
    (next?: boolean) => {
      const value = next ?? !openRef.current;
      setOpen(value);
      onOpen?.(value);
    },
    [onOpen],
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return { open, setOpen: toggle };
}

/**
 * Cmd/Ctrl+K command palette: a cmdk list inside srui's Dialog (Phase 0),
 * not cmdk's own — one overlay system. Arrow keys move the selection,
 * Enter runs the command, Escape closes.
 */
export function CommandPalette({
  commands,
  open: controlledOpen,
  onOpenChange,
  placeholder = "Type a command…",
  slots,
  classNames,
}: CommandPaletteProps) {
  const { open, setOpen } = useCommandPalette(onOpenChange);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;

  const close = () => {
    if (!isControlled) setOpen(false);
    onOpenChange?.(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(next) => (next ? onOpenChange?.(true) : close())}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className={cn("top-[15%] translate-y-0 gap-2 p-3 sm:max-w-lg", classNames?.dialog)}
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <Command>
          <Command.Input
            placeholder={placeholder}
            className={cn(
              "flex h-10 w-full rounded-md border border-border bg-input/30 px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              classNames?.input,
            )}
          />
          <Command.List className={cn("max-h-72 overflow-y-auto outline-none", classNames?.list)}>
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              {slots?.empty ?? "No matching command."}
            </Command.Empty>
            {commands.map((c) => (
              <Command.Item
                key={c.label}
                value={c.label}
                onSelect={() => {
                  close();
                  c.onSelect();
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors duration-(--dur-fast) data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
                  classNames?.item,
                )}
              >
                {c.label}
                {c.shortcut ? (
                  <kbd className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {c.shortcut}
                  </kbd>
                ) : null}
              </Command.Item>
            ))}
          </Command.List>
          {slots?.footer ? <div className="border-t border-border pt-2">{slots.footer}</div> : null}
        </Command>
      </DialogContent>
    </Dialog>
  );
}
