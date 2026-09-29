"use client";

import * as React from "react";
import { Input, Wizard } from "@srui/react";

/** Interactive Wizard demo for the docs page. */
export function WizardDemo() {
  return (
    <div className="not-prose my-6 max-w-xl">
      <Wizard
        steps={[
          { label: "Account", content: <Input placeholder="Workspace name" aria-label="Workspace name" /> },
          { label: "Team", content: <p className="text-sm text-muted-foreground">Invite teammates in the next step.</p> },
          { label: "Confirm", content: <p className="text-sm text-muted-foreground">Review and finish.</p> },
        ]}
        onComplete={() => {}}
      />
    </div>
  );
}
