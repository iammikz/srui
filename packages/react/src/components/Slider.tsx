"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../lib/cn";

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** Marks the slider invalid — destructive track/thumb treatment. */
  invalid?: boolean;
  /** Class applied to every thumb (e.g. ColorPicker's colored grips). */
  thumbClassName?: string;
  /** Style applied to every thumb. */
  thumbStyle?: React.CSSProperties;
  /** Class applied to the track (e.g. gradient tracks). */
  trackClassName?: string;
  /** Style applied to the track. */
  trackStyle?: React.CSSProperties;
  /** Class applied to the filled range (e.g. transparent over gradients). */
  rangeClassName?: string;
};

/**
 * A range input on Radix Slider: one thumb for a value, two for a span —
 * thumbs render from `value`/`defaultValue` (`number[]`), so the component
 * stays a single element. Keyboard, pointer, and `aria-valuenow/min/max`
 * semantics come from the primitive.
 */
function Slider({
  className,
  invalid,
  thumbClassName,
  thumbStyle,
  trackClassName,
  trackStyle,
  rangeClassName,
  ...props
}: SliderProps) {
  const thumbs = props.value ?? props.defaultValue ?? [0];
  // Each thumb is its own role="slider" and needs a name; derive one per
  // thumb from the control's label (min/max for two-thumb spans).
  const label = props["aria-label"];
  const thumbLabel = (i: number) => {
    if (!label) return undefined;
    if (thumbs.length === 1) return label;
    return `${label} (${i === 0 ? "minimum" : i === thumbs.length - 1 ? "maximum" : i + 1})`;
  };
  return (
    <SliderPrimitive.Root
      data-invalid={invalid || undefined}
      className={cn(
        "group relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 group-data-[invalid]:bg-destructive/25",
          trackClassName,
        )}
        style={trackStyle}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full group-data-[invalid]:bg-destructive",
            rangeClassName,
          )}
        />
      </SliderPrimitive.Track>
      {thumbs.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          aria-label={thumbLabel(i)}
          data-slot="slider-thumb"
          className={cn(
            "block size-4 shrink-0 rounded-full border-2 border-primary bg-background shadow-sm outline-none transition-[border-color,box-shadow] duration-(--dur-fast) hover:border-primary/80 focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none group-data-[invalid]:border-destructive",
            thumbClassName,
          )}
          style={thumbStyle}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
