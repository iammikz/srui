import type { Meta, StoryObj } from "@storybook/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
};
export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <ResizablePanelGroup orientation="horizontal" className="min-h-48 rounded-lg border border-border">
        <ResizablePanel defaultSize={50} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          One
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          Two
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="h-64 w-full max-w-xl">
      <ResizablePanelGroup orientation="vertical" className="rounded-lg border border-border">
        <ResizablePanel defaultSize={60} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          Header
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} className="flex items-center justify-center p-4 text-sm text-muted-foreground">
          Detail
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
