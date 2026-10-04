import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  ConfirmDialog,
} from "./AlertDialog";
import { Button } from "./Button";

const meta: Meta<typeof AlertDialogContent> = {
  title: "Components/AlertDialog",
  component: AlertDialogContent,
};
export default meta;

type Story = StoryObj<typeof AlertDialogContent>;

export const Compound: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the account and all of its data. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const OnePropConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Publish release
        </Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Publish release 2.4.0?"
          description="Every workspace on this channel updates on next load."
          confirmLabel="Publish"
          tone="destructive"
          onConfirm={() => console.log("published")}
        />
      </>
    );
  },
};
