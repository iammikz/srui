import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="mon">
      <SelectTrigger className="w-48" aria-label="Day">
        <SelectValue placeholder="Day" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mon">Monday</SelectItem>
        <SelectItem value="tue">Tuesday</SelectItem>
        <SelectItem value="wed">Wednesday</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select defaultValue="eu">
      <SelectTrigger className="w-56" aria-label="City">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="eu">Berlin</SelectItem>
          <SelectItem value="uk">London</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="jp">Tokyo</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const TriggerSizes: Story = {
  name: "Trigger sizes + invalid",
  render: () => (
    <div className="flex flex-col gap-3">
      <Select defaultValue="mon">
        <SelectTrigger className="w-48" size="sm" aria-label="Day (sm)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mon">Monday</SelectItem>
          <SelectItem value="tue">Tuesday</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="mon">
        <SelectTrigger className="w-48" aria-label="Day (default)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mon">Monday</SelectItem>
          <SelectItem value="tue">Tuesday</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="mon">
        <SelectTrigger className="w-48" size="lg" aria-label="Day (lg)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mon">Monday</SelectItem>
          <SelectItem value="tue">Tuesday</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="mon">
        <SelectTrigger className="w-48" invalid aria-label="Day (invalid)">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mon">Monday</SelectItem>
          <SelectItem value="tue">Tuesday</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
