import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TagInput } from "./TagInput";

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
};
export default meta;

type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: () => {
    const [tags, setTags] = useState(["react", "typescript"]);
    return <TagInput value={tags} onChange={setTags} placeholder="Add tag…" className="w-80" />;
  },
};

export const Bounded: Story = {
  render: () => {
    const [tags, setTags] = useState(["high"]);
    return (
      <TagInput
        value={tags}
        onChange={setTags}
        maxTags={3}
        validate={(t) => !t.includes(" ")}
        placeholder="One word, max 3"
        className="w-80"
      />
    );
  },
};
