import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { useToast } from "./Toast";

const meta: Meta<typeof Button> = {
  title: "Components/Toast",
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

function FireVariants() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast({ title: "Saved", variant: "success" })}>Success</Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Upload failed",
            description: "The file was too large.",
            variant: "destructive",
          })
        }
      >
        Destructive
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({ title: "Draft shared", action: { label: "Undo", onClick: () => {} } })
        }
      >
        With action
      </Button>
    </div>
  );
}

export const Default: Story = { render: () => <FireVariants /> };
