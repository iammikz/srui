"use client";
import { Input, Wizard } from "@iammikz/srui";

/** Interactive Wizard demo for the docs page. */
export function WizardDemo() {
  return (
    <div className="my-6 max-w-xl">
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
