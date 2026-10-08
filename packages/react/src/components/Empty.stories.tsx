import type { Meta, StoryObj } from "@storybook/react";
import { SearchX } from "lucide-react";
import { Button } from "./Button";
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "./Empty";

const meta: Meta<typeof Empty> = {
  title: "Components/Empty",
  component: Empty,
};
export default meta;

type Story = StoryObj<typeof Empty>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Empty>
        <EmptyMedia>
          <SearchX />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try different keywords or clear the active filters.
        </EmptyDescription>
        <EmptyContent>
          <Button variant="outline" size="sm">
            Clear filters
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
};
