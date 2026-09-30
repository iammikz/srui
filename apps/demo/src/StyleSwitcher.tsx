import { Monitor, Moon, Sun } from "lucide-react";
import { UI_STYLES, useUIStyle, cn } from "@iammikz/srui";

/**
 * Segmented control for the four presets + light/dark/system toggle.
 * The same hook (useUIStyle) drives the docs site's switcher.
 */
export function StyleSwitcher() {
  const { style, setStyle, scheme, setScheme, resolvedScheme } = useUIStyle();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label="Visual preset"
        className="surface inline-flex items-center gap-0.5 rounded-lg bg-card p-1"
      >
        {UI_STYLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStyle(s)}
            aria-pressed={style === s}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium capitalize outline-none transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              style === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label="Color scheme"
        className="surface inline-flex items-center gap-0.5 rounded-lg bg-card p-1"
      >
        {(
          [
            ["light", Sun, "Light"],
            ["dark", Moon, "Dark"],
            ["system", Monitor, "System"],
          ] as const
        ).map(([value, Icon, label]) => (
          <button
            key={value}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={scheme === value}
            onClick={() => setScheme(value)}
            className={cn(
              "grid size-7 place-items-center rounded-md outline-none transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              scheme === value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {`Preset ${style}, scheme ${resolvedScheme}`}
      </span>
    </div>
  );
}
