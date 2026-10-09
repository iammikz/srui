import type { Meta, StoryObj } from "@storybook/react";
import { Search, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./InputGroup";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
};
export default meta;

type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <User />
        </InputGroupAddon>
        <InputGroupInput placeholder="Username" aria-label="Username" />
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Search…" aria-label="Search" />
        <InputGroupAddon align="end">
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <InputGroupInput placeholder="example.com" aria-label="Domain" />
        <InputGroupButton variant="outline" className="rounded-r-md">
          Go
        </InputGroupButton>
      </InputGroup>
    </div>
  ),
};
