"use client";

import * as React from "react";
import { Check, Code, Copy, Eye } from "lucide-react";
import { Button, Card, CardContent } from "@iammikz/srui";

export interface LivePreviewProps {
  children: React.ReactNode;
  /** Matching code block revealed by the "view code" toggle. */
  code?: string;
  label?: string;
}

/**
 * The <LivePreview> component (implementation plan §2.6): renders its
 * children inside a bordered `Card` that reflects the current UIProvider
 * style/scheme (tokens cascade from <html data-style>), plus a "view code"
 * `Button` that toggles the matching code block — which carries a copy
 * button pinned to its top-right corner.
 */
export function LivePreview({ children, code, label }: LivePreviewProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const copyTimer = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (permission or insecure context) */
    }
  };

  return (
    <div className="live-preview my-6 flex flex-col gap-3">
      <Card className="gap-0 py-0">
        <CardContent className="flex min-h-28 flex-wrap items-center justify-center gap-4 p-6">
          {children}
        </CardContent>
      </Card>
      <div className="flex items-center gap-2">
        {label ? <span className="text-xs text-muted-foreground">{label}</span> : null}
        {code ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCode((v) => !v)}
            aria-expanded={showCode}
          >
            {showCode ? <Eye className="size-3.5" /> : <Code className="size-3.5" />}
            {showCode ? "Hide code" : "View code"}
          </Button>
        ) : null}
      </div>
      {code && showCode ? (
        <div className="relative">
          <button
            type="button"
            onClick={copyCode}
            aria-label={copied ? "Copied" : "Copy code"}
            className="absolute top-2 right-2 z-10 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {copied ? (
              <Check className="size-3.5 text-success" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
          <pre className="docs-pre overflow-x-auto rounded-lg bg-muted p-4 pr-12 text-xs leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}
