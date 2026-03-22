"use client";

/**
 * ColorInput — wraps HeroUI ColorPicker in a compact trigger+popover pattern
 * used throughout the theme editor's color sections (brand, text, gradients).
 *
 * Replaces native `<input type="color">` with the styled HeroUI component
 * so color-picker CSS tokens apply consistently.
 */

import {
  ColorArea,
  ColorPicker,
  ColorSlider,
  parseColor,
} from "@/components/ui/color-picker";

type ColorInputProps = {
  /** Current CSS color value (hex, oklch, etc.) */
  value: string;
  /** Called with the new hex color string on change */
  onChange: (hex: string) => void;
  /** Accessible label */
  title?: string;
};

export function ColorInput({ value, onChange, title }: ColorInputProps) {
  // Normalize to a Color object for the picker
  const fallback = parseColor("#808080").toFormat("hsl");
  let parsed: typeof fallback;
  try {
    parsed = parseColor(value).toFormat("hsl");
  } catch {
    // Fallback for oklch or other formats the picker can't parse
    parsed = fallback;
  }

  return (
    <ColorPicker
      value={parsed}
      onChange={(c) => onChange(c.toString("hex"))}
      aria-label={title ?? "Pick color"}
    >
      <ColorPicker.Trigger>
        {/* Use a plain div with CSS background instead of ColorSwatch
            because ColorSwatch crashes on oklch() colors */}
        <div
          className="h-7 w-7 cursor-pointer rounded-vita-sm border border-vita-neutral-200"
          style={{ background: value }}
        />
      </ColorPicker.Trigger>
      <ColorPicker.Popover>
        <div className="space-y-3">
          <ColorArea
            xChannel="saturation"
            yChannel="lightness"
            aria-label="Color area"
          >
            <ColorArea.Thumb />
          </ColorArea>
          <ColorSlider channel="hue" aria-label="Hue">
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
        </div>
      </ColorPicker.Popover>
    </ColorPicker>
  );
}
