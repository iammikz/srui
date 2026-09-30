import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithInitialsFallback: Story = {
  name: "Image fails -> initials fallback",
  render: () => (
    <Avatar>
      <AvatarImage src="/definitely-missing.png" alt="Jane Doe" />
      <AvatarFallback name="Jane Doe" />
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <span className="flex items-center gap-3">
      <Avatar className="size-8"><AvatarFallback name="Ada Lovelace" /></Avatar>
      <Avatar className="size-10"><AvatarFallback name="Ada Lovelace" /></Avatar>
      <Avatar className="size-14"><AvatarFallback name="Ada Lovelace" /></Avatar>
    </span>
  ),
};
