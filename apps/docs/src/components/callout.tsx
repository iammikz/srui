import { Info } from "lucide-react";
import { Card, CardContent } from "@iammikz/srui";
import { cn } from "@iammikz/srui";

export interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Docs callout — a `Card` with an outline-style treatment (Phase 2.3:
 * callouts use Card, per the dogfooding principle).
 */
export function Callout({ title, children, className }: CalloutProps) {
  return (
    <Card className={cn("my-4 gap-2 border border-border bg-card py-4", className)}>
      <CardContent className="flex items-start gap-3 px-4">
        <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
        <div className="grid gap-1 text-sm">
          {title ? <span className="font-semibold">{title}</span> : null}
          <div className="text-muted-foreground">{children}</div>
        </div>
      </CardContent>
    </Card>
  );
}
