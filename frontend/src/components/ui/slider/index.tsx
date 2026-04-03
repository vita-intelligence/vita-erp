/**
 * Slider — Vita ERP slider built on React Aria.
 *
 * Fully accessible with keyboard navigation (Arrow keys, Home, End),
 * drag interaction, and screen reader support.
 *
 * All visual properties driven by --vita-slider-* CSS custom properties.
 *
 * Compound usage:
 *   <Slider minValue={0} maxValue={100} value={[50]} onChange={setVal}>
 *     <Slider.Output />
 *     <Slider.Track>
 *       <Slider.Fill />
 *       <Slider.Thumb />
 *     </Slider.Track>
 *   </Slider>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  type SliderOutputProps as AriaSliderOutputProps,
  type SliderProps as AriaSliderProps,
  SliderThumb as AriaSliderThumb,
  type SliderThumbProps as AriaSliderThumbProps,
  SliderTrack as AriaSliderTrack,
  type SliderTrackProps as AriaSliderTrackProps,
} from "react-aria-components";

// ── Slider Root ─────────────────────────────────────────────────────────────

export interface SliderRootProps
  extends Omit<AriaSliderProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SliderRootInner(
  { className, style, children, ...ariaProps }: SliderRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaSlider
      {...ariaProps}
      ref={ref}
      data-slot="slider"
      className={["vita-slider", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        transform:
          "perspective(800px)" +
          " rotateX(var(--vita-slider-rotate-x, 0deg))" +
          " rotateY(var(--vita-slider-rotate-y, 0deg))" +
          " rotateZ(var(--vita-slider-rotate-z, 0deg))",
        transitionProperty: "transform",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-slider-transition-duration, 150ms)",
        ...style,
      }}
    >
      {children}
    </AriaSlider>
  );
}

// ── Slider Output ───────────────────────────────────────────────────────────

export interface SliderOutputProps
  extends Omit<AriaSliderOutputProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SliderOutputInner(
  { className, style, children, ...ariaProps }: SliderOutputProps,
  ref: ForwardedRef<HTMLOutputElement>,
) {
  return (
    <AriaSliderOutput
      {...ariaProps}
      ref={ref}
      data-slot="slider-output"
      className={className}
      style={{
        fontSize: "12px",
        color: "var(--vita-text-secondary)",
        ...style,
      }}
    >
      {children}
    </AriaSliderOutput>
  );
}

export const SliderOutput = forwardRef(SliderOutputInner);
SliderOutput.displayName = "SliderOutput";

// ── Slider Track ────────────────────────────────────────────────────────────

export interface SliderTrackProps
  extends Omit<AriaSliderTrackProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function SliderTrackInner(
  { className, style, children, ...ariaProps }: SliderTrackProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaSliderTrack
      {...ariaProps}
      ref={ref}
      data-slot="slider-track"
      className={["vita-slider-track", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        height: "var(--vita-slider-track-height, 6px)",
        width: "100%",
        borderRadius: "var(--vita-slider-track-radius, 9999px)",
        ...style,
      }}
    >
      {children}
    </AriaSliderTrack>
  );
}

export const SliderTrack = forwardRef(SliderTrackInner);
SliderTrack.displayName = "SliderTrack";

// ── Slider Fill ─────────────────────────────────────────────────────────────

export interface SliderFillProps {
  className?: string;
  style?: CSSProperties;
}

export function SliderFill({ className, style }: SliderFillProps) {
  return (
    <span
      data-slot="slider-fill"
      className={["vita-slider-fill", className].filter(Boolean).join(" ")}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        borderRadius: "var(--vita-slider-track-radius, 9999px)",
        backgroundColor: "var(--vita-primary)",
        ...style,
      }}
    />
  );
}

// ── Slider Thumb ────────────────────────────────────────────────────────────

export interface SliderThumbProps
  extends Omit<AriaSliderThumbProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SliderThumbInner(
  { className, style, ...ariaProps }: SliderThumbProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaSliderThumb
      {...ariaProps}
      ref={ref}
      data-slot="slider-thumb"
      className={["vita-slider-thumb", className].filter(Boolean).join(" ")}
      style={{
        width: "var(--vita-slider-thumb-size, 20px)",
        height: "var(--vita-slider-thumb-size, 20px)",
        borderRadius: "var(--vita-slider-thumb-radius, 9999px)",
        backgroundColor: "var(--vita-surface)",
        border: "2px solid var(--vita-primary)",
        boxShadow:
          "var(--vita-slider-thumb-shadow, 0 1px 3px oklch(0 0 0 / 0.15))",
        cursor: "grab",
        top: "50%",
        transitionDuration: "var(--vita-slider-transition-duration, 150ms)",
        ...style,
      }}
    />
  );
}

export const SliderThumb = forwardRef(SliderThumbInner);
SliderThumb.displayName = "SliderThumb";

// ── Compound Export ─────────────────────────────────────────────────────────

const SliderRootWithRef = forwardRef(SliderRootInner);
SliderRootWithRef.displayName = "SliderRoot";

export { SliderRootWithRef as SliderRoot };

export const Slider = Object.assign(SliderRootWithRef, {
  Root: SliderRootWithRef,
  Output: SliderOutput,
  Track: SliderTrack,
  Fill: SliderFill,
  Thumb: SliderThumb,
});
Slider.displayName = "Slider";
