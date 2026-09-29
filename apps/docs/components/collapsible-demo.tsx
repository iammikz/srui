"use client";

import * as React from "react";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@srui/react";

/** Interactive Collapsible demo for the docs page. */
export function CollapsibleDemo() {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Show details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
        Hidden until opened — with a smooth height transition.
      </CollapsibleContent>
    </Collapsible>
  );
}
