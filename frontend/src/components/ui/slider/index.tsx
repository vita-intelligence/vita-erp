/**
 * Slider — Vita ERP wrapper for HeroUI Slider (compound component).
 *
 * Applies theme tokens as inline styles on the Root, Track, Fill, and Thumb
 * sub-components so they override HeroUI's built-in Tailwind styles.
 * Hover transforms remain in CSS for :hover pseudo-class support.
 *
 * Compound usage:
 *   <Slider>
 *     <Slider.Output />
 *     <Slider.Track>
 *       <Slider.Fill />
 *       <Slider.Thumb />
 *     </Slider.Track>
 *   </Slider>
 */

"use client";

import {
  SliderFill as HeroSliderFill,
  SliderRoot as HeroSliderRoot,
  SliderThumb as HeroSliderThumb,
  SliderTrack as HeroSliderTrack,
  type SliderFillProps,
  SliderMarks,
  type SliderMarksProps,
  SliderOutput,
  type SliderOutputProps,
  type SliderRootProps,
  type SliderThumbProps,
  type SliderTrackProps,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedSliderRoot({ children, style, ...props }: SliderRootProps) {
  return (
    <HeroSliderRoot
      {...props}
      style={{
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
    </HeroSliderRoot>
  );
}

function ThemedSliderTrack({ children, style, ...props }: SliderTrackProps) {
  return (
    <HeroSliderTrack
      {...props}
      style={{
        borderRadius: "var(--vita-slider-track-radius, 9999px)",
        height: "var(--vita-slider-track-height, 6px)",
        ...style,
      }}
    >
      {children}
    </HeroSliderTrack>
  );
}

function ThemedSliderFill({ style, ...props }: SliderFillProps) {
  return (
    <HeroSliderFill
      {...props}
      style={{
        borderRadius: "var(--vita-slider-track-radius, 9999px)",
        ...style,
      }}
    />
  );
}

function ThemedSliderThumb({ children, style, ...props }: SliderThumbProps) {
  return (
    <HeroSliderThumb
      {...props}
      style={{
        width: "var(--vita-slider-thumb-size, 20px)",
        height: "var(--vita-slider-thumb-size, 20px)",
        borderRadius: "var(--vita-slider-thumb-radius, 9999px)",
        transitionDuration: "var(--vita-slider-transition-duration, 150ms)",
        ...style,
      }}
    >
      {children}
    </HeroSliderThumb>
  );
}

// ── Named Exports ────────────────────────────────────────────────────────────

export { ThemedSliderRoot as SliderRoot };
export { SliderOutput };
export { ThemedSliderTrack as SliderTrack };
export { ThemedSliderFill as SliderFill };
export { ThemedSliderThumb as SliderThumb };
export { SliderMarks };
export type {
  SliderRootProps,
  SliderOutputProps,
  SliderTrackProps,
  SliderFillProps,
  SliderThumbProps,
  SliderMarksProps,
};

// ── Compound Export ──────────────────────────────────────────────────────────

export const Slider = Object.assign(ThemedSliderRoot, {
  Root: ThemedSliderRoot,
  Output: SliderOutput,
  Track: ThemedSliderTrack,
  Fill: ThemedSliderFill,
  Thumb: ThemedSliderThumb,
  Marks: SliderMarks,
});
