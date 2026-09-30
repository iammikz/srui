"use client";

import * as React from "react";
import { Button, CommandPalette } from "@iammikz/srui";

/** Interactive CommandPalette demo for the docs page. */
export function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="my-6">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={[
          {
            label: "Scroll to top",
            onSelect: () => window.scrollTo({ top: 0, behavior: "smooth" }),
            shortcut: "S T",
          },
          {
            label: "Open the theming page",
            onSelect: () => {
              window.location.href = "/docs/theming";
            },
          },
        ]}
      />
    </div>
  );
}
