/**
 * ColorPicker — Vita ERP wrapper for HeroUI ColorPicker compound component.
 *
 * Applies theme tokens as inline styles on each sub-component
 * (Popover, ColorArea, ColorSlider tracks/thumbs, ColorSwatch)
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize color-picker appearance.
 */

"use client";

import {
  type ColorAreaRootProps,
  type ColorAreaThumbProps,
  type ColorPickerPopoverProps,
  type ColorPickerRootProps,
  type ColorPickerTriggerProps,
  type ColorSliderRootProps,
  type ColorSliderThumbProps,
  type ColorSliderTrackProps,
  type ColorSwatchRootProps,
  ColorAreaRoot as HeroColorAreaRoot,
  ColorAreaThumb as HeroColorAreaThumb,
  ColorPickerPopover as HeroColorPickerPopover,
  ColorPickerRoot as HeroColorPickerRoot,
  ColorPickerTrigger as HeroColorPickerTrigger,
  ColorSliderRoot as HeroColorSliderRoot,
  ColorSliderThumb as HeroColorSliderThumb,
  ColorSliderTrack as HeroColorSliderTrack,
  ColorSwatchRoot as HeroColorSwatchRoot,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Popover ───────────────────────────────────────────────────────────

function ThemedColorPickerPopover({
  children,
  ...props
}: ColorPickerPopoverProps) {
  return (
    <HeroColorPickerPopover
      {...props}
      style={{
        borderRadius: "var(--vita-color-picker-popover-radius, 8px)",
        boxShadow:
          "var(--vita-color-picker-popover-shadow, 0 4px 14px oklch(0 0 0 / 0.1))",
        padding: "var(--vita-color-picker-popover-padding, 16px)",
        borderWidth: "var(--vita-color-picker-popover-border-width, 1px)",
        borderStyle:
          "var(--vita-color-picker-popover-border-style, solid)" as React.CSSProperties["borderStyle"],
      }}
    >
      {children}
    </HeroColorPickerPopover>
  );
}

// ── Themed ColorArea Root ────────────────────────────────────────────────────

function ThemedColorAreaRoot({
  children,
  style,
  ...props
}: ColorAreaRootProps) {
  return (
    <HeroColorAreaRoot
      {...props}
      style={(renderProps) => {
        const userStyle =
          typeof style === "function" ? style(renderProps) : style;
        return {
          ...renderProps.defaultStyle,
          borderRadius: "var(--vita-color-picker-area-radius, 8px)",
          "--color-area-background": renderProps.defaultStyle.background,
          ...userStyle,
        };
      }}
    >
      {children}
    </HeroColorAreaRoot>
  );
}

// ── Themed ColorArea Thumb ───────────────────────────────────────────────────

function ThemedColorAreaThumb({ style, ...props }: ColorAreaThumbProps) {
  return (
    <HeroColorAreaThumb
      {...props}
      style={(renderProps) => {
        const userStyle =
          typeof style === "function" ? style(renderProps) : style;
        return {
          "--color-area-thumb-color": renderProps.defaultStyle.backgroundColor,
          width: "var(--vita-color-picker-thumb-size, 18px)",
          height: "var(--vita-color-picker-thumb-size, 18px)",
          borderWidth: "var(--vita-color-picker-thumb-border-width, 2px)",
          transitionProperty: "transform, box-shadow",
          transitionDuration:
            "var(--vita-color-picker-transition-duration, 150ms)",
          ...userStyle,
        };
      }}
    />
  );
}

// ── Themed ColorSlider Track ─────────────────────────────────────────────────

function ThemedColorSliderTrack({
  children,
  style,
  ...props
}: ColorSliderTrackProps) {
  return (
    <HeroColorSliderTrack
      {...props}
      style={(renderProps) => {
        const userStyle =
          typeof style === "function" ? style(renderProps) : style;
        return {
          ...renderProps.defaultStyle,
          borderRadius: "var(--vita-color-picker-slider-radius, 9999px)",
          height: "var(--vita-color-picker-slider-height, 12px)",
          ...userStyle,
        };
      }}
    >
      {children}
    </HeroColorSliderTrack>
  );
}

// ── Themed ColorSlider Thumb ─────────────────────────────────────────────────

function ThemedColorSliderThumb({
  children,
  style,
  ...props
}: ColorSliderThumbProps) {
  return (
    <HeroColorSliderThumb
      {...props}
      style={(renderProps) => {
        const userStyle =
          typeof style === "function" ? style(renderProps) : style;
        return {
          ...renderProps.defaultStyle,
          width: "var(--vita-color-picker-thumb-size, 18px)",
          height: "var(--vita-color-picker-thumb-size, 18px)",
          borderWidth: "var(--vita-color-picker-thumb-border-width, 2px)",
          transitionProperty: "transform, box-shadow",
          transitionDuration:
            "var(--vita-color-picker-transition-duration, 150ms)",
          ...userStyle,
        };
      }}
    >
      {children}
    </HeroColorSliderThumb>
  );
}

// ── Themed ColorSwatch ───────────────────────────────────────────────────────

function ThemedColorSwatchRoot({ style, ...props }: ColorSwatchRootProps) {
  return (
    <HeroColorSwatchRoot
      {...props}
      style={(renderProps) => {
        const userStyle =
          typeof style === "function" ? style(renderProps) : style;
        return {
          "--color-swatch-current": renderProps.color.toString("css"),
          borderRadius: "var(--vita-color-picker-swatch-radius, 6px)",
          width: "var(--vita-color-picker-swatch-size, 28px)",
          height: "var(--vita-color-picker-swatch-size, 28px)",
          borderWidth: "var(--vita-color-picker-swatch-border-width, 2px)",
          transitionProperty: "transform, box-shadow",
          transitionDuration:
            "var(--vita-color-picker-transition-duration, 150ms)",
          ...userStyle,
        };
      }}
    />
  );
}

// ── Compound Exports ─────────────────────────────────────────────────────────

export const ColorPickerRoot = HeroColorPickerRoot;
export const ColorPickerTrigger = HeroColorPickerTrigger;
export const ColorPickerPopover = ThemedColorPickerPopover;

export const ColorPicker = Object.assign(HeroColorPickerRoot, {
  Root: HeroColorPickerRoot,
  Trigger: HeroColorPickerTrigger,
  Popover: ThemedColorPickerPopover,
});

export const ColorAreaRoot = ThemedColorAreaRoot;
export const ColorAreaThumb = ThemedColorAreaThumb;

export const ColorArea = Object.assign(ThemedColorAreaRoot, {
  Root: ThemedColorAreaRoot,
  Thumb: ThemedColorAreaThumb,
});

export const ColorSliderRoot = HeroColorSliderRoot;
export const ColorSliderTrack = ThemedColorSliderTrack;
export const ColorSliderThumb = ThemedColorSliderThumb;

export const ColorSlider = Object.assign(
  (props: ColorSliderRootProps) => <HeroColorSliderRoot {...props} />,
  {
    Root: HeroColorSliderRoot,
    Track: ThemedColorSliderTrack,
    Thumb: ThemedColorSliderThumb,
  },
);

export const ColorSwatchRoot = ThemedColorSwatchRoot;

export const ColorSwatch = Object.assign(ThemedColorSwatchRoot, {
  Root: ThemedColorSwatchRoot,
});
