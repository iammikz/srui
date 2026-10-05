import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./ScrollArea";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/ScrollArea",
  component: ScrollArea,
};
export default meta;

type Story = StoryObj<typeof ScrollArea>;

const TAGS = Array.from({ length: 24 }, (_, i) => `tag-${i + 1}`);

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-md border border-border p-4">
      <div className="text-sm font-medium">Tags</div>
      {TAGS.map((tag) => (
        <div key={tag} className="mt-2 text-sm">
          {tag}
        </div>
      ))}
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      className="w-56 whitespace-nowrap rounded-md border border-border p-4"
    >
      <div className="flex w-max space-x-4 text-sm">
        {TAGS.slice(0, 10).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea orientation="both" className="h-44 w-64 rounded-md border border-border p-4">
      <div className="w-96 text-sm">
        {TAGS.map((tag) => (
          <div key={tag} className="py-0.5">
            {tag} — a row wide enough to need the horizontal bar too
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
