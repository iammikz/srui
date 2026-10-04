"use client";

import * as React from "react";
import { Pipette } from "lucide-react";
import { cn } from "../lib/cn";
import {
  hexToHsv,
  hsvToHex,
  isValidHexColor,
  parseColorInput,
  toCssString,
  type HSV,
} from "../lib/color";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Slider } from "./Slider";

export interface ColorPickerProps {
  /** `'#RRGGBB'`, or `'#RRGGBBAA'` with `alpha`. */
  value?: string;
  /** Initial color for uncontrolled use. */
  defaultValue?: string;
  /** Fires with the normalized hex key on every change. */
  onChange?: (color: string) => void;
  /** Alpha slider + 8-digit hex values. */
  alpha?: boolean;
  /** Swatch row inside the panel (hex strings). */
  presets?: string[];
  /** Offer the screen eyedropper where the browser supports it (default on). */
  eyedropper?: boolean;
  placeholder?: string;
  /** Required for accessibility when no visible label is bound. */
  ariaLabel?: string;
  disabled?: boolean;
  /** Marks the trigger invalid — red border + `aria-invalid`. */
  invalid?: boolean;
  /** Show a trailing clear button when a color is set. */
  clearable?: boolean;
  /** Custom trigger display; receives the hex key. */
  format?: (color: string) => string;
  /** Renders a hidden input carrying the value for native form posts. */
  name?: string;
  className?: string;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

interface EyeDropperLike {
  open: () => Promise<{ sRGBHex: string }>;
}
function getEyeDropper(): (new () => EyeDropperLike) | undefined {
  return typeof window !== "undefined"
    ? (window as unknown as { EyeDropper?: new () => EyeDropperLike }).EyeDropper
    : undefined;
}

/**
 * A swatch trigger over an anchored color panel: saturation/value square,
 * hue slider, optional alpha slider, a hex field with typed commit
 * (`f09`, `#FF6600`, `rgba(37,99,235,.8)` all parse), preset swatches, and
 * the screen eyedropper where supported. Values are normalized hex keys —
 * `'#RRGGBB'`, or `'#RRGGBBAA'` with `alpha`.
 */
export function ColorPicker({
  value,
  defaultValue,
  onChange,
  alpha = false,
  presets,
  eyedropper = true,
  placeholder = "Pick a color",
  ariaLabel = "Color",
  disabled,
  invalid,
  clearable = true,
  format,
  name,
  className,
}: ColorPickerProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value !== undefined ? value : uncontrolled;
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const draggingRef = React.useRef(false);

  const initial = React.useMemo(
    () => (isValidHexColor(current ?? "") ? hexToHsv(current!) : { h: 217, s: 82, v: 92 }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const [hsv, setHsv] = React.useState<HSV>(initial);
  const [a, setA] = React.useState(() => {
    const rgba = isValidHexColor(current ?? "") ? current!.slice(1) : "";
    return rgba.length === 8 ? parseInt(rgba.slice(6, 8), 16) / 255 : 1;
  });

  // External value changes re-derive the interaction state — except while
  // a pointer drag is committing live (the drag owns the model then).
  React.useEffect(() => {
    if (draggingRef.current || !isValidHexColor(current ?? "")) return;
    setHsv(hexToHsv(current!));
    if (current!.length === 9) setA(parseInt(current!.slice(7, 9), 16) / 255);
  }, [current]);

  const commit = (next: string) => {
    setUncontrolled(next);
    onChange?.(next);
    setDraft(null);
  };

  const commitHsv = (next: HSV) => {
    setHsv(next);
    commit(hsvToHex(next, alpha ? a : undefined));
  };

  const commitAlpha = (nextA: number) => {
    setA(nextA);
    commit(hsvToHex(hsv, nextA));
  };

  const commitTyped = (raw: string) => {
    const parsed = parseColorInput(raw);
    if (parsed) {
      const normalized = alpha ? parsed : parsed.slice(0, 7);
      commit(normalized);
      setHsv(hexToHsv(normalized));
      if (normalized.length === 9) setA(parseInt(normalized.slice(7, 9), 16) / 255);
    } else {
      setDraft(null); // revert to the committed display
    }
  };

  // --- saturation/value square ---
  const svRef = React.useRef<HTMLDivElement | null>(null);
  const applyPointer = (e: React.PointerEvent) => {
    const el = svRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = {
      ...hsv,
      s: clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100),
      v: clamp(100 - ((e.clientY - rect.top) / rect.height) * 100, 0, 100),
    };
    setHsv(next);
    commit(hsvToHex(next, alpha ? a : undefined));
  };
  const onSvKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1;
    let { s, v } = hsv;
    if (e.key === "ArrowLeft") s = clamp(s - step, 0, 100);
    else if (e.key === "ArrowRight") s = clamp(s + step, 0, 100);
    else if (e.key === "ArrowUp") v = clamp(v + step, 0, 100);
    else if (e.key === "ArrowDown") v = clamp(v - step, 0, 100);
    else return;
    e.preventDefault();
    const next = { ...hsv, s, v };
    setHsv(next);
    commit(hsvToHex(next, alpha ? a : undefined));
  };

  const hueHex = hsvToHex({ h: hsv.h, s: 100, v: 100 });
  const liveCss = toCssString(hsvToHex(hsv, alpha ? a : undefined));
  const display = current ? (format ? format(current) : current.toUpperCase()) : "";
  const canEyedrop = eyedropper && !!getEyeDropper() && !disabled;

  const pickWithEyedropper = async () => {
    const EyeDropper = getEyeDropper();
    if (!EyeDropper) return;
    try {
      const { sRGBHex } = await new EyeDropper().open();
      const hex = parseColorInput(sRGBHex);
      if (hex) {
        const normalized = alpha ? hex : hex.slice(0, 7);
        commit(normalized);
        setHsv(hexToHsv(normalized));
      }
    } catch {
      /* user cancelled the eyedropper */
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative", className)}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={ariaLabel}
            aria-invalid={invalid || undefined}
            disabled={disabled}
            data-slot="color-picker-trigger"
            className={cn(
              "flex h-9 w-full min-w-0 items-center gap-2 rounded-md border border-border bg-input/30 px-2.5 py-2 text-sm outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) ease-(--ease-out) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
              !current && "text-muted-foreground",
              invalid && "border-destructive",
            )}
          >
            <span
              aria-hidden
              className="size-4 shrink-0 rounded-sm border border-border"
              style={{ backgroundColor: current ? toCssString(current) : "transparent" }}
            />
            <span className="truncate font-mono text-xs uppercase">{display || placeholder}</span>
          </button>
        </PopoverTrigger>
        {clearable && current && !disabled ? (
          <button
            type="button"
            aria-label="Clear color"
            onClick={(e) => {
              e.stopPropagation();
              commit("");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm px-0.5 text-muted-foreground outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            ×
          </button>
        ) : null}
      </div>
      <PopoverContent align="start" className="w-64 p-3" role="dialog" aria-label={`${ariaLabel} panel`}>
        <div
          ref={svRef}
          role="slider"
          tabIndex={0}
          aria-label="Saturation and brightness"
          aria-valuetext={liveCss}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={onSvKeyDown}
          onPointerDown={(e) => {
            draggingRef.current = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            applyPointer(e);
          }}
          onPointerMove={(e) => {
            if (draggingRef.current) applyPointer(e);
          }}
          onPointerUp={() => {
            draggingRef.current = false;
          }}
          onPointerCancel={() => {
            draggingRef.current = false;
          }}
          className="relative h-36 w-full cursor-crosshair touch-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueHex})`,
          }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
            style={{
              left: `${hsv.s}%`,
              top: `${100 - hsv.v}%`,
              backgroundColor: liveCss,
            }}
          />
        </div>

        <div className="mt-3 flex flex-col gap-2.5">
          <Slider
            aria-label="Hue"
            value={[Math.round(hsv.h)]}
            min={0}
            max={359}
            step={1}
            onValueChange={([h]) => commitHsv({ ...hsv, h })}
            thumbStyle={{ backgroundColor: hueHex, borderColor: "transparent" }}
            trackClassName="bg-[linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]"
            rangeClassName="bg-transparent"
          />
          {alpha ? (
            <Slider
              aria-label="Alpha"
              value={[Math.round(a * 100)]}
              min={0}
              max={100}
              step={1}
              onValueChange={([next]) => commitAlpha(next / 100)}
              thumbStyle={{ backgroundColor: hsvToHex(hsv), borderColor: "transparent" }}
              trackStyle={{ background: `linear-gradient(to right, transparent, ${hsvToHex(hsv)})` }}
              rangeClassName="bg-transparent"
            />
          ) : null}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            aria-label={`${ariaLabel} hex value`}
            value={draft ?? display}
            placeholder="#RRGGBB"
            spellCheck={false}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commitTyped(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTyped(e.currentTarget.value);
            }}
            className={cn(
              "h-8 min-w-0 flex-1 rounded-md border border-border bg-input/30 px-2 font-mono text-xs uppercase outline-none transition-[color,box-shadow,border-color] duration-(--dur-fast) placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          />
          {canEyedrop ? (
            <button
              type="button"
              aria-label="Pick a color from the screen"
              onClick={pickWithEyedropper}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border outline-none transition-colors duration-(--dur-fast) hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Pipette className="size-3.5" />
            </button>
          ) : null}
        </div>

        {presets?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {presets.map((preset) => {
              const hex = parseColorInput(preset);
              if (!hex) return null;
              return (
                <button
                  key={preset}
                  type="button"
                  aria-label={`Preset ${hex}`}
                  onClick={() => {
                    const normalized = alpha ? hex : hex.slice(0, 7);
                    commit(normalized);
                    setHsv(hexToHsv(normalized));
                  }}
                  className="size-5 rounded-sm border border-border outline-none transition-[transform,box-shadow] duration-(--dur-fast) hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  style={{ backgroundColor: toCssString(hex) }}
                />
              );
            })}
          </div>
        ) : null}
      </PopoverContent>
      {name ? <input type="hidden" name={name} value={current ?? ""} /> : null}
    </Popover>
  );
}
