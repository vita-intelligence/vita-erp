/**
 * ColorPicker — Vita ERP color picker built on React Aria.
 *
 * Fully accessible color selection with area, sliders, and swatches.
 * All visual properties driven by --vita-color-picker-* CSS custom properties.
 *
 * Compound usage:
 *   <ColorPicker value={color} onChange={setColor}>
 *     <ColorPicker.Trigger>...</ColorPicker.Trigger>
 *     <ColorPicker.Popover>
 *       <ColorArea xChannel="saturation" yChannel="lightness">
 *         <ColorArea.Thumb />
 *       </ColorArea>
 *       <ColorSlider channel="hue">
 *         <ColorSlider.Track><ColorSlider.Thumb /></ColorSlider.Track>
 *       </ColorSlider>
 *     </ColorPicker.Popover>
 *   </ColorPicker>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Button as AriaButton,
  ColorArea as AriaColorArea,
  type ColorAreaProps as AriaColorAreaProps,
  ColorPicker as AriaColorPicker,
  type ColorPickerProps as AriaColorPickerProps,
  ColorSlider as AriaColorSlider,
  type ColorSliderProps as AriaColorSliderProps,
  ColorSwatch as AriaColorSwatch,
  type ColorSwatchProps as AriaColorSwatchProps,
  ColorThumb as AriaColorThumb,
  type ColorThumbProps as AriaColorThumbProps,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
  SliderTrack as AriaSliderTrack,
  type SliderTrackProps as AriaSliderTrackProps,
} from "react-aria-components";
import { parseColor } from "react-stately";

// Re-export parseColor for consumer convenience
export { parseColor };

// ── ColorPicker Root ────────────────────────────────────────────────────────

export interface ColorPickerRootProps
  extends Omit<AriaColorPickerProps, "children"> {
  children?: ReactNode;
}

function ColorPickerRootInner({
  children,
  ...ariaProps
}: ColorPickerRootProps) {
  return (
    <AriaColorPicker {...ariaProps} data-slot="color-picker">
      <AriaDialogTrigger>{children}</AriaDialogTrigger>
    </AriaColorPicker>
  );
}

// ── ColorPicker Trigger ─────────────────────────────────────────────────────

export interface ColorPickerTriggerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ColorPickerTriggerInner(
  { className, style, children }: ColorPickerTriggerProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <AriaButton
      ref={ref}
      data-slot="color-picker-trigger"
      className={className}
      style={{
        appearance: "none",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: 0,
        outline: "none",
        ...style,
      }}
    >
      {children}
    </AriaButton>
  );
}

export const ColorPickerTrigger = forwardRef(ColorPickerTriggerInner);
ColorPickerTrigger.displayName = "ColorPickerTrigger";

// ── ColorPicker Popover ─────────────────────────────────────────────────────

export interface ColorPickerPopoverProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ColorPickerPopover({
  className,
  style,
  children,
}: ColorPickerPopoverProps) {
  return (
    <AriaPopover
      data-slot="color-picker-popover"
      className={["vita-color-picker-popover", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderRadius: "var(--vita-color-picker-popover-radius, 8px)",
        boxShadow:
          "var(--vita-color-picker-popover-shadow, 0 4px 14px oklch(0 0 0 / 0.1))",
        padding: "var(--vita-color-picker-popover-padding, 16px)",
        borderWidth: "var(--vita-color-picker-popover-border-width, 1px)",
        borderStyle:
          "var(--vita-color-picker-popover-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor:
          "var(--vita-color-picker-border-color, var(--vita-neutral-200))",
        backgroundColor: "var(--vita-surface)",
        ...style,
      }}
    >
      <AriaDialog style={{ outline: "none" }}>{children}</AriaDialog>
    </AriaPopover>
  );
}

// ── Compound ColorPicker ────────────────────────────────────────────────────

export const ColorPickerRoot = ColorPickerRootInner;

export const ColorPicker = Object.assign(ColorPickerRootInner, {
  Root: ColorPickerRootInner,
  Trigger: ColorPickerTrigger,
  Popover: ColorPickerPopover,
});

// ── ColorArea ───────────────────────────────────────────────────────────────

export interface ColorAreaRootProps
  extends Omit<AriaColorAreaProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ColorAreaRootInner(
  { className, style, children, ...ariaProps }: ColorAreaRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaColorArea
      {...ariaProps}
      ref={ref}
      data-slot="color-area"
      className={["vita-color-area", className].filter(Boolean).join(" ")}
      style={{
        borderRadius: "var(--vita-color-picker-area-radius, 8px)",
        width: "100%",
        height: "160px",
        ...style,
      }}
    >
      {children}
    </AriaColorArea>
  );
}

const ColorAreaWithRef = forwardRef(ColorAreaRootInner);
ColorAreaWithRef.displayName = "ColorArea";

// ── ColorArea Thumb ─────────────────────────────────────────────────────────

export interface ColorAreaThumbProps
  extends Omit<AriaColorThumbProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function ColorAreaThumbInner(
  { className, style, ...ariaProps }: ColorAreaThumbProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaColorThumb
      {...ariaProps}
      ref={ref}
      data-slot="color-area-thumb"
      className={className}
      style={{
        width: "var(--vita-color-picker-thumb-size, 18px)",
        height: "var(--vita-color-picker-thumb-size, 18px)",
        borderRadius: "9999px",
        border: "var(--vita-color-picker-thumb-border-width, 2px) solid white",
        boxShadow:
          "0 0 0 1px oklch(0 0 0 / 0.2), 0 1px 3px oklch(0 0 0 / 0.15)",
        ...style,
      }}
    />
  );
}

const ColorAreaThumbWithRef = forwardRef(ColorAreaThumbInner);
ColorAreaThumbWithRef.displayName = "ColorAreaThumb";

export const ColorAreaRoot = ColorAreaWithRef;
export const ColorAreaThumb = ColorAreaThumbWithRef;

export const ColorArea = Object.assign(ColorAreaWithRef, {
  Root: ColorAreaWithRef,
  Thumb: ColorAreaThumbWithRef,
});

// ── ColorSlider ─────────────────────────────────────────────────────────────

export interface ColorSliderRootProps
  extends Omit<AriaColorSliderProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ColorSliderRootInner(
  { className, style, children, ...ariaProps }: ColorSliderRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaColorSlider
      {...ariaProps}
      ref={ref}
      data-slot="color-slider"
      className={["vita-color-slider", className].filter(Boolean).join(" ")}
      style={{ width: "100%", ...style }}
    >
      {children}
    </AriaColorSlider>
  );
}

const ColorSliderWithRef = forwardRef(ColorSliderRootInner);
ColorSliderWithRef.displayName = "ColorSlider";

// ── ColorSlider Track ───────────────────────────────────────────────────────

export interface ColorSliderTrackProps
  extends Omit<AriaSliderTrackProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ColorSliderTrackInner(
  { className, style, children, ...ariaProps }: ColorSliderTrackProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaSliderTrack
      {...ariaProps}
      ref={ref}
      data-slot="color-slider-track"
      className={className}
      style={{
        borderRadius: "var(--vita-color-picker-slider-radius, 9999px)",
        height: "var(--vita-color-picker-slider-height, 12px)",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </AriaSliderTrack>
  );
}

const ColorSliderTrackWithRef = forwardRef(ColorSliderTrackInner);
ColorSliderTrackWithRef.displayName = "ColorSliderTrack";

// ── ColorSlider Thumb ───────────────────────────────────────────────────────

export interface ColorSliderThumbProps
  extends Omit<AriaColorThumbProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function ColorSliderThumbInner(
  { className, style, ...ariaProps }: ColorSliderThumbProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaColorThumb
      {...ariaProps}
      ref={ref}
      data-slot="color-slider-thumb"
      className={className}
      style={{
        width: "var(--vita-color-picker-thumb-size, 18px)",
        height: "var(--vita-color-picker-thumb-size, 18px)",
        borderRadius: "9999px",
        border: "var(--vita-color-picker-thumb-border-width, 2px) solid white",
        boxShadow:
          "0 0 0 1px oklch(0 0 0 / 0.2), 0 1px 3px oklch(0 0 0 / 0.15)",
        top: "50%",
        ...style,
      }}
    />
  );
}

const ColorSliderThumbWithRef = forwardRef(ColorSliderThumbInner);
ColorSliderThumbWithRef.displayName = "ColorSliderThumb";

export const ColorSliderRoot = ColorSliderWithRef;
export const ColorSliderTrack = ColorSliderTrackWithRef;
export const ColorSliderThumb = ColorSliderThumbWithRef;

export const ColorSlider = Object.assign(ColorSliderWithRef, {
  Root: ColorSliderWithRef,
  Track: ColorSliderTrackWithRef,
  Thumb: ColorSliderThumbWithRef,
});

// ── ColorSwatch ─────────────────────────────────────────────────────────────

export interface ColorSwatchRootProps
  extends Omit<AriaColorSwatchProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler;
}

function ColorSwatchRootInner(
  { className, style, onClick, ...ariaProps }: ColorSwatchRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaColorSwatch
      {...ariaProps}
      ref={ref}
      data-slot="color-swatch"
      className={["vita-color-swatch", className].filter(Boolean).join(" ")}
      onClick={onClick}
      style={{
        borderRadius: "var(--vita-color-picker-swatch-radius, 6px)",
        width: "var(--vita-color-picker-swatch-size, 28px)",
        height: "var(--vita-color-picker-swatch-size, 28px)",
        borderWidth: "var(--vita-color-picker-swatch-border-width, 2px)",
        borderStyle: "solid",
        borderColor:
          "var(--vita-color-picker-border-color, oklch(0 0 0 / 0.1))",
        transitionProperty: "transform, box-shadow",
        transitionDuration:
          "var(--vita-color-picker-transition-duration, 150ms)",
        ...style,
      }}
    />
  );
}

export const ColorSwatchRoot = forwardRef(ColorSwatchRootInner);
ColorSwatchRoot.displayName = "ColorSwatchRoot";

export const ColorSwatch = Object.assign(forwardRef(ColorSwatchRootInner), {
  Root: forwardRef(ColorSwatchRootInner),
});
ColorSwatch.displayName = "ColorSwatch";
