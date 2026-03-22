"use client";

/**
 * Live color picker preview — uses real HeroUI ColorPicker, ColorArea,
 * ColorSlider, and ColorSwatch so CSS tokens apply automatically.
 *
 * Shows both an inline (always-visible) picker and a popover trigger
 * so users can see how both modes are styled.
 */

import { useState } from "react";

import {
  ColorArea,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  parseColor,
} from "@/components/ui/color-picker";

// ── Preset swatches ──────────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#0485F7",
  "#14B8A6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#6366F1",
  "#F97316",
  "#64748B",
];

export function Preview() {
  const [color, setColor] = useState(parseColor("hsl(210, 98%, 48%)"));

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      {/* ── Popover trigger — click to open ── */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">
          Popover — click swatch to open
        </p>
        <ColorPicker
          value={color}
          onChange={setColor}
          aria-label="Pick a color"
        >
          <ColorPicker.Trigger className="flex items-center gap-3">
            <ColorSwatch color={color.toString("hex")} />
            <span className="font-vita-mono text-xs text-vita-text-secondary">
              {color.toString("hex")}
            </span>
          </ColorPicker.Trigger>
          <ColorPicker.Popover>
            <div className="space-y-3">
              <ColorArea
                xChannel="saturation"
                yChannel="lightness"
                aria-label="Popover area"
              >
                <ColorArea.Thumb />
              </ColorArea>
              <ColorSlider channel="hue" aria-label="Popover hue">
                <ColorSlider.Track>
                  <ColorSlider.Thumb />
                </ColorSlider.Track>
              </ColorSlider>
              <ColorSlider channel="alpha" aria-label="Popover alpha">
                <ColorSlider.Track>
                  <ColorSlider.Thumb />
                </ColorSlider.Track>
              </ColorSlider>
            </div>
          </ColorPicker.Popover>
        </ColorPicker>
      </div>

      {/* ── Preset swatches ── */}
      <div className="space-y-1.5">
        <p className="text-xs text-vita-text-muted">Preset swatches</p>
        <div className="flex flex-wrap gap-[var(--vita-color-picker-swatch-gap,6px)]">
          {PRESET_COLORS.map((hex) => (
            <ColorSwatch
              key={hex}
              color={hex}
              aria-label={hex}
              style={{ cursor: "pointer" }}
              onClick={() => setColor(parseColor(hex).toFormat("hsl"))}
            />
          ))}
        </div>
      </div>

      {/* ── Inline sub-components for direct inspection ── */}
      <div
        style={{
          borderTop: "1px solid var(--vita-neutral-200)",
          paddingTop: "0.75rem",
        }}
      >
        <p className="mb-2 text-xs text-vita-text-muted">Inline elements</p>
        <div className="space-y-2">
          <ColorSlider
            channel="hue"
            value={color}
            onChange={setColor}
            aria-label="Inline hue"
          >
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
          <ColorSlider
            channel="alpha"
            value={color}
            onChange={setColor}
            aria-label="Inline alpha"
          >
            <ColorSlider.Track>
              <ColorSlider.Thumb />
            </ColorSlider.Track>
          </ColorSlider>
        </div>
      </div>
    </div>
  );
}
