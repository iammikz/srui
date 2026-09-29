"use client";

import * as React from "react";
import { Code, Eye } from "lucide-react";

export interface LivePreviewProps {
  children: React.ReactNode;
  /** Matching code block revealed by the "view code" toggle. */
  code?: string;
  label?: string;
}

/**
 * The <LivePreview> MDX component (implementation plan §2.6): renders its
 * children inside a bordered `surface` box that reflects the current
 * UIProvider style/scheme (tokens cascade from <html data-style>), plus a
 * "view code" toggle that reveals the matching code block.
 */
export function LivePreview({ children, code, label }: LivePreviewProps) {
  const [showCode, setShowCode] = React.useState(false);

  return (
    <div className="live-preview not-prose my-6 flex flex-col gap-3">
      <div className="surface flex min-h-28 flex-wrap items-center justify-center gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground">
        {children}
      </div>
      <div className="flex items-center gap-2">
        {label ? (
          <span className="text-xs text-muted-foreground">{label}</span>
        ) : null}
        {code ? (
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            aria-expanded={showCode}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {showCode ? <Eye className="size-3.5" /> : <Code className="size-3.5" />}
            {showCode ? "Hide code" : "View code"}
          </button>
        ) : null}
      </div>
      {code && showCode ? (
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}
