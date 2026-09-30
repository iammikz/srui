import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Tell us a little bit about yourself", className: "w-80" },
};

export const Invalid: Story = {
  args: { value: "Too short", invalid: true, readOnly: true, className: "w-80" },
};
