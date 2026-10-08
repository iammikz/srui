import type { Meta, StoryObj } from "@storybook/react";
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "./Field";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";

const meta: Meta<typeof Field> = {
  title: "Components/Field",
  component: Field,
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Wired: Story = {
  name: "Label + description + error auto-wired to the control",
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input placeholder="ada@example.com" />
        </FieldControl>
        <FieldDescription>We only use this for sign-in.</FieldDescription>
      </Field>
      <Field name="plan" invalid>
        <FieldLabel>Plan</FieldLabel>
        <FieldControl>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pick a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </FieldControl>
        <FieldDescription>Billing renews monthly.</FieldDescription>
        <FieldError>Pick a plan to continue.</FieldError>
      </Field>
    </div>
  ),
};
