import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: { variant: { control: "radio" }, size: { control: "radio" } },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Button" } };

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Icon">
        ⌘
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { children: "Save changes", loading: true },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

export const AsChild: Story = {
  name: "asChild (renders the child element)",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild>
        <a href="https://example.com" target="_blank" rel="noreferrer">
          Anchor button
        </a>
      </Button>
      <Button asChild variant="outline">
        <a href="https://example.com" target="_blank" rel="noreferrer">
          Outline anchor
        </a>
      </Button>
      <Button asChild disabled>
        <a href="https://example.com" target="_blank" rel="noreferrer">
          Disabled anchor
        </a>
      </Button>
    </div>
  ),
};
