import { cn } from "../../lib/cn";

export interface ChartTooltipRow {
  name: string;
  value: number;
  color: string;
}

/**
 * The hover bubble shared by the charts: label + one row per series with a
 * color dot. Position with percentages relative to the chart wrapper —
 * `leftPct` at the point's x, `topPct` just above its topmost value.
 */
export function ChartTooltip({
  label,
  rows,
  leftPct,
  topPct,
  className,
}: {
  label: string;
  rows: ChartTooltipRow[];
  /** Point x as a percentage of the chart width. */
  leftPct: number;
  /** Anchor y as a percentage of the chart height (tooltip renders above). */
  topPct: number;
  className?: string;
}) {
  // Keep the bubble inside the wrapper near the edges.
  const clampedLeft = Math.min(86, Math.max(14, leftPct));
  return (
    <div
      role="tooltip"
      className={cn(
        "surface pointer-events-none absolute z-10 min-w-28 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs shadow-lg motion-safe:animate-scale-in",
        className,
      )}
      style={{ left: `${clampedLeft}%`, top: `${topPct}%` }}
    >
      <div className="mb-1 font-medium text-foreground">{label}</div>
      {rows.map((r) => (
        <div key={r.name} className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2 rounded-full" style={{ backgroundColor: r.color }} />
            {r.name}
          </span>
          <span className="font-medium tabular-nums text-foreground">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
