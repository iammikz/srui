import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "Email address", className: "w-72" } };

export const Invalid: Story = {
  args: { value: "not-an-email", invalid: true, readOnly: true, className: "w-72" },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true, className: "w-72" },
};
