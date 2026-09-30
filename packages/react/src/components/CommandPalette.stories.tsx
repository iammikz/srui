import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "./Button";
import { CommandPalette } from "./CommandPalette";

const meta: Meta<typeof CommandPalette> = {
  title: "Super-components/CommandPalette",
  component: CommandPalette,
};
export default meta;

type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open palette (or press Ctrl/Cmd+K)
        </Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          commands={[
            {
              label: "Log a result",
              onSelect: () => console.log("ran command"),
              shortcut: "L R",
            },
            { label: "Another command", onSelect: () => {} },
          ]}
        />
      </>
    );
  },
};
