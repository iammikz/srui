import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TreeView, type TreeItemData } from "./TreeView";

const meta: Meta<typeof TreeView> = {
  title: "Components/TreeView",
  component: TreeView,
};
export default meta;

type Story = StoryObj<typeof TreeView>;

const tree: TreeItemData[] = [
  {
    id: "src",
    label: "src",
    defaultExpanded: true,
    children: [
      { id: "components", label: "components", children: [{ id: "button", label: "Button.tsx" }] },
      { id: "lib", label: "lib", children: [{ id: "date", label: "date.ts" }] },
    ],
  },
  { id: "tests", label: "tests", children: [{ id: "visual", label: "visual.spec.ts" }] },
  { id: "package", label: "package.json" },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState("button");
    return <TreeView items={tree} selectedId={selected} onSelect={setSelected} aria-label="Project files" />;
  },
};
