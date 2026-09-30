import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./Collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
};
export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">Show details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
        Hidden until opened.
      </CollapsibleContent>
    </Collapsible>
  ),
};
