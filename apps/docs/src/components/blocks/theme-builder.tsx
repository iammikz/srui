"use client";

import * as React from "react";
import { Copy } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  useToast,
} from "@iammikz/srui";

/**
 * Phase 8 "Theme builder": the Theming page's token playground expanded
 * into a full tool — color pickers for the core palette, a radius slider,
 * a live preview Card, and a generated, copy-pasteable CSS override block.
 * No persistence; the preview scope is a wrapper element.
 */
const COLORS: { token: string; label: string }[] = [
  { token: "--primary", label: "Primary" },
  { token: "--secondary", label: "Secondary" },
  { token: "--destructive", label: "Destructive" },
  { token: "--success", label: "Success" },
  { token: "--warning", label: "Warning" },
  { token: "--background", label: "Background" },
];

const hex = (v: string) => (v.startsWith("#") ? v : "#4f46e5");

export function ThemeBuilder() {
  const { toast } = useToast();
  const [colors, setColors] = React.useState<Record<string, string>>({
    "--primary": "#4f46e5",
    "--secondary": "#f4f4f5",
    "--destructive": "#c02626",
    "--success": "#16835a",
    "--warning": "#d99a26",
    "--background": "#ffffff",
  });
  const [radius, setRadius] = React.useState("0.5rem");

  const style = React.useMemo(() => {
    const out: Record<string, string> = {};
    for (const { token } of COLORS) out[token] = hex(colors[token]);
    out["--radius"] = radius;
    return out;
  }, [colors, radius]);

  const css = React.useMemo(() => {
    const lines = Object.entries(style).map(([k, v]) => `  ${k}: ${v};`);
    return `:root {\n${lines.join("\n")}\n}\n\n.dark {\n  /* add dark-mode overrides here */\n}`;
  }, [style]);

  return (
    <div className="my-6 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tokens</CardTitle>
          <CardDescription>Scoped to the preview only — nothing persists.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {COLORS.map(({ token, label }) => (
            <div key={token} className="flex items-center justify-between gap-3">
              <Label htmlFor={`tb-${token}`}>
                {label} <span className="text-xs text-muted-foreground">{token}</span>
              </Label>
              <span className="flex items-center gap-2">
                <Input
                  id={`tb-${token}`}
                  type="color"
                  value={hex(colors[token])}
                  onChange={(e) =>
                    setColors((c) => ({ ...c, [token]: e.target.value }))
                  }
                  className="h-9 w-14 px-1"
                />
                <code className="w-20 text-xs">{hex(colors[token])}</code>
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="tb-radius">Radius --radius</Label>
            <span className="flex items-center gap-2">
              <Input
                id="tb-radius"
                type="range"
                min={0}
                max={32}
                value={Number.parseFloat(radius) * 16}
                onChange={(e) => setRadius(`${Number(e.target.value) / 16}rem`)}
                className="h-9 w-32 px-1"
              />
              <code className="w-14 text-xs">{radius}</code>
            </span>
          </div>
        </CardContent>
      </Card>

      <div
        className="surface rounded-xl border border-border p-5"
        style={{ ...style, backgroundColor: "var(--background)", borderRadius: "var(--radius)" } as React.CSSProperties}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Preview</CardTitle>
            <CardDescription>Everything re-themes live.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="destructive">
              Destructive
            </Button>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Input placeholder="Input" aria-label="Preview input" className="w-40" />
          </CardContent>
        </Card>
        <pre className="mt-4 max-h-56 overflow-auto rounded-lg bg-muted p-3 text-[11px] leading-relaxed">
          <code>{css}</code>
        </pre>
        <Button
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={async () => {
            await navigator.clipboard.writeText(css);
            toast({ title: "CSS copied", variant: "success" });
          }}
        >
          <Copy aria-hidden="true" /> Copy CSS
        </Button>
      </div>
    </div>
  );
}
