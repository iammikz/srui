import type { Meta, StoryObj } from "@storybook/react";
import { Wizard } from "./Wizard";
import { Input } from "./Input";

const meta: Meta<typeof Wizard> = {
  title: "Super-components/Wizard",
  component: Wizard,
};
export default meta;

type Story = StoryObj<typeof Wizard>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Wizard
        steps={[
          {
            label: "Account",
            content: <Input placeholder="Workspace name" aria-label="Workspace name" />,
          },
          {
            label: "Team",
            content: (
              <p className="text-sm text-muted-foreground">Invite teammates next.</p>
            ),
          },
          {
            label: "Confirm",
            content: (
              <p className="text-sm text-muted-foreground">Review and finish.</p>
            ),
          },
        ]}
        onComplete={() => console.log("complete")}
      />
    </div>
  ),
};
