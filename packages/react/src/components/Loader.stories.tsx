import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DotsLoader, LoadingOverlay, Skeleton, Spinner } from "./Loader";
import { Button } from "./Button";

const meta: Meta<typeof Spinner> = {
  title: "Components/Loader",
  component: Spinner,
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const SpinnerStory: Story = {
  name: "Spinner",
  render: () => <Spinner />,
};

export const SlowSpinner: Story = {
  render: () => <Spinner className="size-8 motion-safe:animate-spin-slow" />,
};

export const Dots: Story = {
  render: () => <DotsLoader className="text-muted-foreground" />,
};

export const Skeletons: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  ),
};

export const Overlay: Story = {
  name: "LoadingOverlay (delay + min-display)",
  render: () => {
    const [busy, setBusy] = useState(false);
    return (
      <div className="relative grid min-h-40 w-72 place-items-center rounded-lg border border-border p-6">
        <p className="text-sm text-muted-foreground">Content that gets covered.</p>
        <LoadingOverlay active={busy} label="Fetching data…" />
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setBusy(true);
            setTimeout(() => setBusy(false), 1800);
          }}
        >
          Trigger overlay
        </Button>
      </div>
    );
  },
};
