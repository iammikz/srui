import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NativeSelect } from "./NativeSelect";

const meta: Meta<typeof NativeSelect> = {
  title: "Components/NativeSelect",
  component: NativeSelect,
};
export default meta;

type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("mon");
    return (
      <div className="w-full max-w-56">
        <NativeSelect
          aria-label="Day"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="mon">Monday</option>
          <option value="tue">Tuesday</option>
          <option value="wed">Wednesday</option>
        </NativeSelect>
      </div>
    );
  },
};

export const SizesAndInvalid: Story = {
  render: () => (
    <div className="flex w-full max-w-56 flex-col gap-3">
      <NativeSelect size="sm" aria-label="Day (sm)" defaultValue="mon">
        <option value="mon">Monday</option>
        <option value="tue">Tuesday</option>
      </NativeSelect>
      <NativeSelect size="lg" aria-label="Day (lg)" defaultValue="mon">
        <option value="mon">Monday</option>
        <option value="tue">Tuesday</option>
      </NativeSelect>
      <NativeSelect invalid aria-label="Day (invalid)" defaultValue="">
        <option value="">Pick a day…</option>
      </NativeSelect>
    </div>
  ),
};
