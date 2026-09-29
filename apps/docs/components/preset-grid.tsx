"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  UI_STYLES,
  type UIStyle,
} from "@srui/react";

export interface PresetGridProps {
  /** Custom demo content; defaults to a Card with a button and input. */
  children?: React.ReactNode;
  /** Restrict the grid to a single preset (used on the Presets page). */
  only?: UIStyle;
}

/**
 * The <PresetGrid> MDX component (implementation plan §2.2 / §2.5): shows
 * the same content rendered in several presets SIMULTANEOUSLY by scoping
 * `data-style` to each cell's own wrapper — not to <html>, which
 * UIProvider owns for the page as a whole (see the scoped-tokens gotcha).
 */
export function PresetGrid({ children, only }: PresetGridProps) {
  const styles: UIStyle[] = only ? [only] : [...UI_STYLES];

  return (
    <div className="preset-grid not-prose my-6 grid gap-4 sm:grid-cols-2">
      {styles.map((s) => (
        <div
          key={s}
          data-style={s}
          className="relative overflow-hidden rounded-xl border border-border p-4"
        >
          {/* Glass needs contrast behind it to read at all (known gotcha) —
              give the glass cell its own colorful backdrop since the preset's
              <body> gradient doesn't exist inside a grid cell. */}
          {s === "glass" ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                backgroundImage:
                  "radial-gradient(18rem 12rem at 10% 0%, oklch(0.78 0.13 195 / 0.5), transparent 60%), radial-gradient(16rem 12rem at 100% 30%, oklch(0.72 0.15 330 / 0.45), transparent 60%), radial-gradient(14rem 12rem at 40% 110%, oklch(0.8 0.13 140 / 0.4), transparent 60%)",
              }}
            />
          ) : null}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {s}
            </span>
            <code className="text-[10px] text-muted-foreground">
              data-style=&quot;{s}&quot;
            </code>
          </div>
          {children ?? <DefaultPresetDemo />}
        </div>
      ))}
    </div>
  );
}

function DefaultPresetDemo() {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">Card</CardTitle>
        <CardDescription>Same tokens, different recipe.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-4">
        <Input placeholder="Input" aria-label="Demo input" />
        <div className="flex gap-2">
          <Button size="sm">Button</Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
