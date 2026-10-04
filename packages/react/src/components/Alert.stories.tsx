import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert variant="info" title="Heads up">
        Scheduled maintenance Sunday 02:00–03:00 UTC.
      </Alert>
      <Alert variant="success" title="Deployed">
        Build 128 is live on all regions.
      </Alert>
      <Alert variant="warning" title="Approaching limit">
        85% of the monthly build minutes are used.
      </Alert>
      <Alert variant="destructive" title="Payment failed">
        Update your card to avoid suspension.
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return open ? (
      <Alert variant="info" title="Cookie notice" onDismiss={() => setOpen(false)}>
        We use cookies to keep you signed in.
      </Alert>
    ) : (
      <button type="button" onClick={() => setOpen(true)} className="text-sm underline">
        Show the alert again
      </button>
    );
  },
};
