"use client";

import * as React from "react";
import {
  Attachment,
  Avatar,
  AvatarFallback,
  Bubble,
  Button,
  Message,
  MessageScroller,
} from "@iammikz/srui";

const ada = <Avatar className="size-8"><AvatarFallback name="Ada Lovelace" /></Avatar>;
const you = <Avatar className="size-8"><AvatarFallback name="You" /></Avatar>;

export function ChatDemo() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="my-6 w-full max-w-md">
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
        {Array.from({ length: count }, (_, i) => (
          <Message key={i} placement="end" avatar={you} name="You" time="09:4?">
            <Bubble variant="sent">Pinned follow-up #{i + 1} — the scroller follows.</Bubble>
          </Message>
        ))}
      </MessageScroller>
      <div className="mt-3">
        <Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
          Send a message
        </Button>
      </div>
    </div>
  );
}
