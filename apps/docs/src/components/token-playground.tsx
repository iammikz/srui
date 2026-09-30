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
} from "@iammikz/srui";

/**
 * The live "token playground" from the Theming page (implementation plan
 * §2.4): inputs rendered with srui's own `Input`, bound to `--primary`,
 * `--radius` and `--background`, applied to a preview `Card` in real time.
 * No persistence — scope the overrides to the wrapper element only.
 */
export function TokenPlayground() {
  const [primary, setPrimary] = React.useState("#4f46e5");
  const [radius, setRadius] = React.useState("0.5rem");
  const [background, setBackground] = React.useState("#ffffff");

  return (
    <div className="token-playground my-6 grid gap-6 md:grid-cols-2">
      <Card className="gap-4 p-5 py-5">
        <CardHeader className="px-0">
          <CardTitle className="text-sm">Tokens</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">
              <code className="text-xs">--primary</code>
            </span>
            <span className="flex items-center gap-2">
              <Input
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                aria-label="--primary color"
                className="h-9 w-14 px-1"
              />
              <code className="text-xs">{primary}</code>
            </span>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">
              <code className="text-xs">--radius</code>
            </span>
            <span className="flex items-center gap-2">
              <Input
                type="range"
                min={0}
                max={32}
                step={1}
                value={Number.parseFloat(radius) * 16}
                onChange={(e) => setRadius(`${Number(e.target.value) / 16}rem`)}
                aria-label="--radius in pixels"
                className="h-9 px-1"
              />
              <code className="w-14 text-xs">{radius}</code>
            </span>
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">
              <code className="text-xs">--background</code>
            </span>
            <span className="flex items-center gap-2">
              <Input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                aria-label="--background color"
                className="h-9 w-14 px-1"
              />
              <code className="text-xs">{background}</code>
            </span>
          </label>
          <p className="text-xs text-muted-foreground">
            These controls only redefine the tokens on the preview wrapper —
            nothing is persisted.
          </p>
        </CardContent>
      </Card>

      <div
        className="surface rounded-lg border border-border p-5"
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
