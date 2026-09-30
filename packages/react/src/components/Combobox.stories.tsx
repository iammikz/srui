import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Combobox } from "./Combobox";

const meta: Meta<typeof Combobox> = {
  title: "Components/Combobox",
  component: Combobox,
};
export default meta;

type Story = StoryObj<typeof Combobox>;

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("react");
    return (
      <Combobox
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Framework…"
        className="w-56"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Combobox options={options} value="" onChange={() => {}} disabled className="w-56" />
  ),
};
