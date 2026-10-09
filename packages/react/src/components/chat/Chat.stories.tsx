import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback } from "../Avatar";
import { Button } from "../Button";
import { Attachment } from "./Attachment";
import { Bubble } from "./Bubble";
import { Message } from "./Message";
import { MessageScroller } from "./MessageScroller";

const meta: Meta<typeof MessageScroller> = {
  title: "Components/Chat",
  component: MessageScroller,
};
export default meta;

type Story = StoryObj<typeof MessageScroller>;

const ada = <Avatar className="size-8"><AvatarFallback name="Ada Lovelace" /></Avatar>;
const you = <Avatar className="size-8"><AvatarFallback name="You" /></Avatar>;

export const Conversation: Story = {
  name: "MessageScroller + Message + Bubble",
  render: () => (
    <div className="w-full max-w-md">
      <MessageScroller className="h-72 rounded-lg border border-border p-4">
        <Message avatar={ada} name="Ada" time="09:41">
          <Bubble>Morning! Did the deploy finish?</Bubble>
        </Message>
        <Message placement="end" avatar={you} name="You" time="09:41">
          <Bubble variant="sent">Yes — build 128 is live on all regions.</Bubble>
        </Message>
        <Message avatar={ada} name="Ada" time="09:42">
          <Bubble>Perfect. Attaching the report now.</Bubble>
          <Attachment name="q3-report.pdf" size={1_246_000} />
        </Message>
      </MessageScroller>
    </div>
  ),
};

export const AttachmentStates: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Attachment name="photo.png" size={284_000} kind="image" />
      <Attachment name="uploading.mp4" size={94_000_000} progress={62} />
      <Attachment name="removable.txt" size={240} onRemove={() => {}} />
    </div>
  ),
};

export const Actions: Story = {
  render: () => (
    <div className="w-full max-w-md rounded-lg border border-border p-4">
      <Message
        avatar={ada}
        name="Ada"
        time="09:41"
        actions={
          <>
            <Button variant="ghost" size="sm">Copy</Button>
            <Button variant="ghost" size="sm">Reply</Button>
          </>
        }
      >
        <Bubble>Hover this message for the action row.</Bubble>
      </Message>
    </div>
  ),
};
