"use client";

import * as React from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@srui/react";

/**
 * The live "token playground" from the Theming page (implementation plan
 * §2.4): color/text inputs bound to --primary, --radius and --background,
 * applied to a preview Card in real time. No persistence — scope the
 * overrides to the wrapper element only.
 */
export function TokenPlayground() {
  const [primary, setPrimary] = React.useState("#4f46e5");
  const [radius, setRadius] = React.useState("0.5rem");
  const [background, setBackground] = React.useState("#ffffff");

  return (
    <div className="token-playground not-prose my-6 grid gap-6 md:grid-cols-2">
      <div className="surface flex flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground">
        <h3 className="text-sm font-semibold">Tokens</h3>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">
            <code className="text-xs">--primary</code>
          </span>
          <span className="flex items-center gap-2">
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="size-9 cursor-pointer rounded-md border border-border bg-transparent"
              aria-label="--primary color"
            />
            <code className="text-xs">{primary}</code>
          </span>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">
            <code className="text-xs">--radius</code>
          </span>
          <span className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={32}
              step={1}
              value={Number.parseFloat(radius) * 16}
              onChange={(e) => setRadius(`${Number(e.target.value) / 16}rem`)}
              className="w-full accent-(--primary)"
              aria-label="--radius in pixels"
            />
            <code className="w-14 text-xs">{radius}</code>
          </span>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="text-muted-foreground">
            <code className="text-xs">--background</code>
          </span>
          <span className="flex items-center gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="size-9 cursor-pointer rounded-md border border-border bg-transparent"
              aria-label="--background color"
            />
            <code className="text-xs">{background}</code>
          </span>
        </label>
        <p className="text-xs text-muted-foreground">
          These controls only redefine the tokens on the preview wrapper —
          nothing is persisted.
        </p>
      </div>

      <div
        className="surface rounded-lg border border-border p-5 transition-[border-radius] duration-(--dur-base)"
        style={
          {
            "--primary": primary,
            "--radius": radius,
            "--background": background,
            backgroundColor: "var(--background)",
            borderRadius: "var(--radius)",
          } as React.CSSProperties
        }
      >
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="text-sm">Preview card</CardTitle>
            <CardDescription>Watch it restyle as you change tokens.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Input placeholder="Input uses --radius too" aria-label="Playground input" />
            <div className="flex gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
