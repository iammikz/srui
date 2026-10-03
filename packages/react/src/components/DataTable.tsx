"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

/** Virtualization kicks in automatically above this many rows (no pageSize). */
export const DATA_TABLE_VIRTUALIZE_THRESHOLD = 200;

export interface DataTableSlots<T> {
  /** Rendered top-right beside the CSV button; receives the table instance. */
  toolbar?: React.ComponentType<{ table: TableInstance<T> }>;
  /** Shown when the (filtered) table has no rows. */
  empty?: React.ReactNode;
}

export interface DataTableClassNames {
  root?: string;
  header?: string;
  row?: string;
  cell?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  sortable?: boolean;
  selectable?: boolean;
  pageSize?: number;
  onRowSelectionChange?: (rows: T[]) => void;
  /** Global search input above the columns; filters every column at once. */
  filterable?: boolean;
  /** Sticky first/last columns via CSS position: sticky. */
  pinColumns?: boolean;
  /** Render the client-side "Export CSV" button (default true). */
  csvExport?: boolean;
  /** Tier 2 — slots + per-part classNames. */
  slots?: DataTableSlots<T>;
  classNames?: DataTableClassNames;
}

export type TableInstance<T> = TanstackTable<T>;

export interface UseDataTableConfig<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  sortable?: boolean;
  selectable?: boolean;
  pageSize?: number;
  onRowSelectionChange?: (rows: T[]) => void;
}

/**
 * Tier 3 headless hook — a fully wired TanStack table instance (sorting,
 * filtering, pagination, selection) with zero JSX. Build any visual layout
 * on top of it; the Tier 1 <DataTable> is one such layout.
 */
export function useDataTable<T>({
  columns,
  data,
  sortable = true,
  selectable = false,
  pageSize,
  onRowSelectionChange,
}: UseDataTableConfig<T>): TableInstance<T> {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pageSize ? getPaginationRowModel() : undefined,
    globalFilterFn: "includesString",
    enableSorting: sortable,
    enableRowSelection: selectable,
    initialState: pageSize ? { pagination: { pageSize } } : undefined,
  });

  React.useEffect(() => {
    onRowSelectionChange?.(table.getSelectedRowModel().rows.map((r) => r.original as T));
    // rowSelection identity is enough — the model derives from it.
  }, [rowSelection, table, onRowSelectionChange]);

  return table;
}

function SortableHeader<T>({
  column,
  children,
}: {
  column: Column<T, unknown>;
  children: React.ReactNode;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1 text-xs font-medium uppercase outline-none transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        sorted ? "text-foreground" : "text-muted-foreground",
      )}
      onClick={() => column.toggleSorting(sorted === "asc")}
      aria-sort={
        sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined
      }
    >
      {children}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" aria-hidden="true" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" aria-hidden="true" />
      ) : (
        <ArrowUpDown className="size-3.5 opacity-50" aria-hidden="true" />
      )}
    </button>
  );
}

function exportCsv<T>(table: TableInstance<T>) {
  const visibleCols = table.getVisibleLeafColumns().filter((c) => c.id !== "__select");
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    visibleCols.map((c) => escape(c.id)).join(","),
    ...table
      .getFilteredRowModel()
      .rows.map((r) => visibleCols.map((c) => escape(r.getValue(c.id))).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "srui-export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Tier 1 super-component: sortable, filterable, paginatable, selectable
 * table with optional sticky column pinning, automatic virtualization for
 * large datasets (>200 rows without pageSize) and client-side CSV export.
 * Sort → filter → paginate compose through Tanstack's row pipeline.
 */
export function DataTable<T>({
  columns,
  data,
  sortable = true,
  selectable = false,
  pageSize,
  onRowSelectionChange,
  filterable = false,
  pinColumns = false,
  csvExport = true,
  slots,
  classNames,
}: DataTableProps<T>) {
  // The select column is presentational (a Checkbox), so it lives here in
  // Tier 1; the headless hook stays JSX-free.
  const allColumns = React.useMemo(() => {
    if (!selectable) return columns;
    const selectColumn: ColumnDef<T, unknown> = {
      id: "__select",
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows on this page"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Select row ${row.index + 1}`}
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
    };
    return [selectColumn, ...columns];
  }, [selectable, columns]);

  const table = useDataTable<T>({
    columns: allColumns,
    data,
    sortable,
    selectable,
    pageSize,
    onRowSelectionChange,
  });

  const rows = table.getRowModel().rows;
  const useVirtual = !pageSize && rows.length > DATA_TABLE_VIRTUALIZE_THRESHOLD;
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 44,
    overscan: 12,
  });

  const pinned = (i: number, count: number) =>
    pinColumns && count > 1
      ? i === 0
        ? "sticky left-0 z-10 bg-card"
        : i === count - 1
          ? "sticky right-0 z-10 bg-card"
          : ""
      : "";

  const Toolbar = slots?.toolbar;

  return (
    <div
      className={cn(
        "surface overflow-hidden rounded-xl bg-card text-card-foreground",
        classNames?.root,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {filterable ? (
            <Input
              type="search"
              value={(table.getState().globalFilter as string) ?? ""}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
              placeholder="Search all columns…"
              aria-label="Search all columns"
              className="h-8 w-full max-w-56 text-xs"
            />
          ) : null}
          <span
            className="whitespace-nowrap text-xs text-muted-foreground"
            aria-live="polite"
          >
            {table.getFilteredRowModel().rows.length} rows
          </span>
        </div>
        <div className="flex items-center gap-2">
          {Toolbar ? <Toolbar table={table} /> : null}
          {csvExport ? (
            <Button variant="outline" size="sm" onClick={() => exportCsv(table)}>
              <Download aria-hidden="true" /> CSV
            </Button>
          ) : null}
        </div>
      </div>

      <div ref={scrollRef} className={cn("overflow-auto", useVirtual && "max-h-96")}>
        <table className="w-full border-collapse text-sm">
          <thead className={cn("sticky top-0 z-20 bg-card", classNames?.header)}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border">
                {hg.headers.map((h, i) => (
                  <th
                    key={h.id}
                    scope="col"
                    className={cn(
                      "px-3 py-2 text-left",
                      h.column.id === "__select" && "w-10",
                      pinned(i, hg.headers.length),
                      classNames?.cell,
                    )}
                  >
                    {h.isPlaceholder
                      ? null
                      : sortable && h.column.getCanSort() ? (
                          <SortableHeader column={h.column}>
                            {flexRender(h.column.columnDef.header, h.getContext())}
                          </SortableHeader>
                        ) : (
                          flexRender(h.column.columnDef.header, h.getContext())
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {useVirtual ? (
              virtualizer.getVirtualItems().map((vi) => {
                const row = rows[vi.index];
                return (
                  <tr
                    key={row.id}
                    data-index={vi.index}
                    ref={(el) => virtualizer.measureElement(el)}
                    className={cn("border-b border-border", classNames?.row)}
                    style={{ height: vi.size }}
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-3 py-2",
                          pinned(i, row.getVisibleCells().length),
                          classNames?.cell,
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="p-6 text-center text-sm text-muted-foreground"
                >
                  {slots?.empty ?? "No rows."}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  data-selected={row.getIsSelected() || undefined}
                  className={cn(
                    "border-b border-border transition-colors duration-(--dur-fast) hover:bg-accent/50",
                    row.getIsSelected() && "bg-accent/30",
                    classNames?.row,
                  )}
                >
                  {row.getVisibleCells().map((cell, i) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-3 py-2",
                        pinned(i, row.getVisibleCells().length),
                        classNames?.cell,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize ? (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-3 py-2">
          <div className="mr-auto flex items-center gap-2">
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              Rows per page
            </span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger
                aria-label="Rows per page"
                className="h-7 w-[4.25rem] text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...new Set([pageSize, 10, 20, 30, 50])]
                  .sort((a, b) => a - b)
                  .map((size) => (
                    <SelectItem key={size} value={String(size)} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
