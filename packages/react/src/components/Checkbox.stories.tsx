import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox defaultChecked /> Accept terms
    </label>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [ok, setOk] = useState(true);
    return (
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={ok} onCheckedChange={(v) => setOk(v === true)} /> Controlled:{" "}
        {ok ? "on" : "off"}
      </label>
    );
  },
};
