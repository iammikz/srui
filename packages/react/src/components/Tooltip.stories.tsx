import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Thanks for hovering. I am a tooltip.</TooltipContent>
    </Tooltip>
  ),
};

export const BottomWithOffset: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">Bottom, offset 10</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={10}>
        Positioned below with extra offset.
      </TooltipContent>
    </Tooltip>
  ),
};
