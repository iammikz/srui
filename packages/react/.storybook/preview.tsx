import type { Preview, ReactRenderer } from "@storybook/react";
import { Decorator } from "@storybook/react";
import { UIProvider, ToastProvider, TooltipProvider } from "../src/index";
import "./preview.css";

/**
 * Every story renders inside the real providers, with the four presets
 * switchable via a global toolbar option (data-style on the wrapper).
 */
const withSrui: Decorator<ReactRenderer, unknown> = (Story, context) => {
  const preset = (context.globals.preset ?? "flat") as string;
  return (
    <div data-style={preset}>
      <UIProvider>
        <ToastProvider>
          <TooltipProvider>
            <Story />
          </TooltipProvider>
        </ToastProvider>
      </UIProvider>
    </div>
  );
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
  },
  globalTypes: {
    preset: {
      description: "srui visual preset",
      toolbar: {
        icon: "paintbrush",
        title: "Preset",
        items: [
          { value: "flat", title: "Flat" },
          { value: "glass", title: "Glass" },
          { value: "neumorphic", title: "Neumorphic" },
          { value: "skeuomorphic", title: "Skeuomorphic" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { preset: "flat" },
  decorators: [withSrui],
};

export default preview;
