"use client";

import { z } from "zod";
import { FormBuilder } from "@srui/react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  role: z.string().min(1, "Pick a role."),
  bio: z.string().max(120, "Keep it under 120 characters.").optional(),
});

/** Interactive FormBuilder demo for the docs page. */
export function FormBuilderDemo() {
  return (
    <div className="my-6 max-w-md">
      <FormBuilder
        schema={schema}
        fields={[
          { name: "name", label: "Name", type: "text", placeholder: "Ada Lovelace" },
          { name: "email", label: "Email", type: "email", placeholder: "ada@example.com" },
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
          { name: "bio", label: "Bio (optional)", type: "textarea", hint: "Up to 120 characters." },
        ]}
        submitLabel="Create account"
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 900));
        }}
      />
    </div>
  );
}
