import type { Meta, StoryObj } from "@storybook/react";
import { z } from "zod";
import { FormBuilder } from "./FormBuilder";

const meta: Meta<typeof FormBuilder> = {
  title: "Super-components/FormBuilder",
  component: FormBuilder,
};
export default meta;

type Story = StoryObj<typeof FormBuilder>;

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  role: z.string().min(1, "Pick a role."),
});

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FormBuilder
        schema={schema}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Ada Lovelace" },
          { name: "email", label: "Email", type: "email" },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: [
              { value: "admin", label: "Admin" },
              { value: "editor", label: "Editor" },
              { value: "viewer", label: "Viewer" },
            ],
          },
        ]}
        submitLabel="Create account"
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 900));
        }}
      />
    </div>
  ),
};
