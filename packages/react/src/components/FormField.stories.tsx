import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";
import { Input } from "./Input";

const meta: Meta<typeof FormField> = {
  title: "Components/FormField",
  component: FormField,
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const WithHint: Story = {
  render: () => (
    <FormField
      label="Email"
      htmlFor="story-email"
      hint="We'll never share your email."
      className="w-80"
    >
      <Input id="story-email" type="email" placeholder="you@example.com" />
    </FormField>
  ),
};

export const WithError: Story = {
  render: () => (
    <FormField
      label="Username"
      htmlFor="story-username"
      error="That username is taken."
      className="w-80"
    >
      <Input id="story-username" invalid value="srui" readOnly />
    </FormField>
  ),
};
