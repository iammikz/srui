"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface TreeItemData {
  /** Stable id — reported by `onSelect`. */
  id: string;
  /** Visible label. */
  label: React.ReactNode;
  /** Children render a nested group. */
  children?: TreeItemData[];
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Initially expanded (uncontrolled). */
  defaultExpanded?: boolean;
  /** Row is not selectable. */
  disabled?: boolean;
}

export interface TreeViewProps {
  /** The full tree, nested via `children`. */
  items: TreeItemData[];
  /** Id of the selected row (controlled). */
  selectedId?: string;
  /** Initially selected id (uncontrolled). */
  defaultSelectedId?: string;
  /** Fires with the clicked row's id. */
  onSelect?: (id: string) => void;
  /** Which rows start expanded (overrides per-item `defaultExpanded`). */
  defaultExpandedIds?: string[];
  /** Required — the tree's accessible name. */
  "aria-label": string;
  className?: string;
}

interface FlatRow {
  item: TreeItemData;
  level: number;
}

/** Depth-first visible rows (expanded branches only) for arrow navigation. */
function flatten(items: TreeItemData[], expanded: Set<string>, level = 1): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const item of items) {
    rows.push({ item, level });
    if (item.children?.length && expanded.has(item.id)) {
      rows.push(...flatten(item.children, expanded, level + 1));
    }
  }
  return rows;
}

/**
 * A single-select tree with full tree semantics: `role="tree"` /
 * `treeitem` / `group`, `aria-expanded`/`aria-level`/`aria-selected`, and
 * the arrow-key map — Down/Up walk visible rows, Right expands or dives,
 * Left collapses or hops to the parent, Home/End jump the trail.
 */
export function TreeView({
  items,
  selectedId,
  defaultSelectedId,
  onSelect,
  defaultExpandedIds,
  className,
  "aria-label": ariaLabel,
}: TreeViewProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(() => {
    const ids = new Set<string>(defaultExpandedIds);
    if (!defaultExpandedIds) {
      const walk = (nodes: TreeItemData[]) => {
        for (const n of nodes) {
          if (n.defaultExpanded) ids.add(n.id);
          if (n.children) walk(n.children);
        }
      };
      walk(items);
    }
    return ids;
  });
  const [uncontrolledSelected, setUncontrolledSelected] = React.useState(defaultSelectedId);
  const selected = selectedId !== undefined ? selectedId : uncontrolledSelected;

  const rows = React.useMemo(() => flatten(items, expanded), [items, expanded]);
  const rowRefs = React.useRef(new Map<string, HTMLDivElement>());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const select = (item: TreeItemData) => {
    if (item.disabled) return;
    setUncontrolledSelected(item.id);
    onSelect?.(item.id);
  };

  const parentOf = React.useCallback((id: string, nodes: TreeItemData[], parent?: TreeItemData): TreeItemData | undefined => {
    for (const n of nodes) {
      if (n.id === id) return parent;
      if (n.children) {
        const found = parentOf(id, n.children, n);
        if (found !== undefined || n.children.some((c) => c.id === id)) return found ?? n;
      }
    }
    return undefined;
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = rows.findIndex((r) => r.item.id === selected);
    const current = rows[idx];
    if (!current) return;
    const focus = (id: string) => {
      e.preventDefault();
      rowRefs.current.get(id)?.focus();
    };

    switch (e.key) {
      case "ArrowDown":
        if (idx < rows.length - 1) focus(rows[idx + 1].item.id);
        break;
      case "ArrowUp":
        if (idx > 0) focus(rows[idx - 1].item.id);
        break;
      case "ArrowRight":
        e.preventDefault();
        if (current.item.children?.length && !expanded.has(current.item.id)) toggle(current.item.id);
        else if (idx < rows.length - 1) focus(rows[idx + 1].item.id);
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (current.item.children?.length && expanded.has(current.item.id)) toggle(current.item.id);
        else {
          const parent = parentOf(current.item.id, items);
          if (parent) focus(parent.id);
        }
        break;
      case "Home":
        focus(rows[0].item.id);
        break;
      case "End":
        focus(rows[rows.length - 1].item.id);
        break;
    }
  };

  const renderRows = (nodes: TreeItemData[], level: number): React.ReactNode =>
    nodes.map((item) => {
      const hasChildren = !!item.children?.length;
      const isOpen = expanded.has(item.id);
      const isSelected = selected === item.id;
      return (
        <React.Fragment key={item.id}>
          <div
            ref={(el) => {
              if (el) rowRefs.current.set(item.id, el);
              else rowRefs.current.delete(item.id);
            }}
            role="treeitem"
            aria-level={level}
            aria-selected={isSelected}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-disabled={item.disabled || undefined}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => {
              select(item);
              if (hasChildren && isSelected) toggle(item.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                select(item);
              }
            }}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring aria-selected:bg-accent aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
            )}
            style={{ paddingInlineStart: `${(level - 1) * 1.25 + 0.5}rem` }}
          >
            {hasChildren ? (
              <ChevronRight
                aria-hidden
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(item.id);
                }}
                className={cn("size-4 text-muted-foreground transition-transform duration-(--dur-fast)", isOpen && "rotate-90")}
              />
            ) : (
              <span aria-hidden className="size-4" />
            )}
            {item.icon}
            <span className="truncate">{item.label}</span>
          </div>
          {hasChildren && isOpen ? (
            <div role="group" aria-label={typeof item.label === "string" ? item.label : undefined}>
              {renderRows(item.children!, level + 1)}
            </div>
          ) : null}
        </React.Fragment>
      );
    });

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn("w-fit min-w-[12rem]", className)}
    >
      {renderRows(items, 1)}
    </div>
  );
}
