"use client";

import * as React from "react";
import { Code, Eye } from "lucide-react";
import { Button, Card, CardContent } from "@srui/react";

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
 * `Button` that toggles the matching code block.
 */
export function LivePreview({ children, code, label }: LivePreviewProps) {
  const [showCode, setShowCode] = React.useState(false);

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
        <pre className="docs-pre overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}
