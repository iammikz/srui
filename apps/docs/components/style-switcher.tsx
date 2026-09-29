"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { UI_STYLES, useUIStyle } from "@srui/react";

/**
 * Style/dark-mode switcher for the docs top nav. Uses the SAME useUIStyle
 * hook as apps/demo (implementation plan §2.1 DoD) — one implementation of
 * style state, duplicated markup (~20 lines) per the plan's allowance.
 */
export function StyleSwitcher({ compact = false }: { compact?: boolean }) {
  const { style, setStyle, scheme, setScheme } = useUIStyle();

  return (
    <div className="flex items-center gap-1.5">
      <div
        role="group"
        aria-label="Visual preset"
        className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5"
      >
        {UI_STYLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStyle(s)}
            aria-pressed={style === s}
            title={`Preset: ${s}`}
            className={
              "rounded-md px-2 py-1 text-xs font-medium capitalize outline-none transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
              (style === s
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
            }
          >
            {compact ? s.slice(0, 2) : s}
          </button>
        ))}
      </div>
      <div
        role="group"
        aria-label="Color scheme"
        className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5"
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
            className={
              "grid size-6 place-items-center rounded-md outline-none transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
              (scheme === value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
            }
          >
            <Icon className="size-3.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
