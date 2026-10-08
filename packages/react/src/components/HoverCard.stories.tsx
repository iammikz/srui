import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback } from "./Avatar";
import { Button } from "./Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";

const meta: Meta<typeof HoverCard> = {
  title: "Components/HoverCard",
  component: HoverCard,
};
export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@adalovelace</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback name="Ada Lovelace" />
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Ada Lovelace</p>
            <p className="text-xs text-muted-foreground">First programmer</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
