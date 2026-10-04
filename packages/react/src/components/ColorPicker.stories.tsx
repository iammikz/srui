import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ColorPicker } from "./ColorPicker";

const meta: Meta<typeof ColorPicker> = {
  title: "Components/ColorPicker",
  component: ColorPicker,
};
export default meta;

type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState("#2563EB");
    return <ColorPicker value={color} onChange={setColor} ariaLabel="Brand color" className="w-40" />;
  },
};

export const WithAlphaAndPresets: Story = {
  render: () => {
    const [color, setColor] = useState("#10B981CC");
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        alpha
        presets={["#000000", "#64748B", "#DC2626", "#F59E0B", "#10B981", "#2563EB", "#7C3AED"]}
        ariaLabel="Overlay tint"
        className="w-44"
      />
    );
  },
};
