"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button, UI_STYLES, useUIStyle } from "@srui/react";

/**
 * Style/dark-mode switcher for the docs top nav — a row of `Button`s per
 * the Phase 2 dogfooding principle. Uses the SAME useUIStyle hook as
 * apps/demo (implementation plan §2.1 DoD) — one implementation of style
 * state.
 */
export function StyleSwitcher() {
  const { style, setStyle, scheme, setScheme } = useUIStyle();

  return (
    <div className="flex items-center gap-1.5">
      <div role="group" aria-label="Visual preset" className="flex items-center gap-0.5">
        {UI_STYLES.map((s) => (
          <Button
            key={s}
            variant={style === s ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setStyle(s)}
            aria-pressed={style === s}
            title={`Preset: ${s}`}
            className="px-2 capitalize"
          >
            {s}
          </Button>
        ))}
      </div>
      <div role="group" aria-label="Color scheme" className="flex items-center gap-0.5">
        {(
          [
            ["light", Sun, "Light"],
            ["dark", Moon, "Dark"],
            ["system", Monitor, "System"],
          ] as const
        ).map(([value, Icon, label]) => (
          <Button
            key={value}
            variant={scheme === value ? "secondary" : "ghost"}
            size="icon"
            title={label}
            aria-label={label}
            aria-pressed={scheme === value}
            onClick={() => setScheme(value)}
            className="size-8"
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>
    </div>
  );
}
