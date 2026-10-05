import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const InviteFlow: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    return (
      <>
        <Button onClick={() => setOpen(true)}>Invite teammate</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Invite a teammate"
          description="They'll receive an email with a join link that expires in 7 days."
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button disabled={!email.trim()} onClick={() => setOpen(false)}>
                Send invite
              </Button>
            </>
          }
        >
          <Input
            type="email"
            placeholder="teammate@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Modal>
      </>
    );
  },
};

export const Informational: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          What's new
        </Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          size="sm"
          title="Release 1.3.0"
          description="New: Slider, ColorPicker, and the date/time picker family."
          footer={<Button onClick={() => setOpen(false)}>Got it</Button>}
        />
      </>
    );
  },
};
