import type { Meta, StoryObj } from "@storybook/react";
import { FileText } from "lucide-react";
import { Badge } from "./Badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemEnd,
  ItemMedia,
  ItemTitle,
} from "./Item";

const meta: Meta<typeof Item> = {
  title: "Components/Item",
  component: Item,
};
export default meta;

type Story = StoryObj<typeof Item>;

export const Row: Story = {
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-border p-4">
      <Item>
        <ItemMedia align="start">
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Q3 report.pdf</ItemTitle>
          <ItemDescription>Updated 2 hours ago · 1.2 MB</ItemDescription>
        </ItemContent>
        <ItemEnd>
          <Badge variant="secondary">Shared</Badge>
        </ItemEnd>
      </Item>
      <Item>
        <ItemMedia align="start">
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Draft — budget.xlsx</ItemTitle>
          <ItemDescription>You edited this file</ItemDescription>
        </ItemContent>
        <ItemEnd>
          <Badge variant="success">Live</Badge>
        </ItemEnd>
      </Item>
    </div>
  ),
};
