/**
 * ProgressBar — Vita ERP progress bar built on React Aria.
 *
 * Accessible progress indicator with ARIA attributes.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components";

export interface ProgressBarProps
  extends Omit<AriaProgressBarProps, "className" | "style"> {
  /** Track height */
  size?: "sm" | "md" | "lg";
  /** Fill color */
  color?: "primary" | "success" | "warning" | "danger";
  className?: string;
  style?: CSSProperties;
}

const SIZE_MAP = { sm: "4px", md: "8px", lg: "12px" };
const COLOR_MAP: Record<string, string> = {
  primary: "var(--vita-primary)",
  success: "var(--vita-success)",
  warning: "var(--vita-warning)",
  danger: "var(--vita-error)",
};

function ProgressBarInner(
  {
    size = "md",
    color = "primary",
    className,
    style,
    ...ariaProps
  }: ProgressBarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const height = SIZE_MAP[size];
  const fillColor = COLOR_MAP[color] ?? COLOR_MAP.primary;

  return (
    <AriaProgressBar
      {...ariaProps}
      ref={ref}
      data-slot="progress-bar"
      className={["vita-progress-bar", className].filter(Boolean).join(" ")}
      style={{ width: "100%", ...style }}
    >
      {({ percentage }) => (
        <div
          data-slot="progress-bar-track"
          style={{
            width: "100%",
            height,
            borderRadius: "9999px",
            backgroundColor: "var(--vita-neutral-200)",
            overflow: "hidden",
          }}
        >
          <div
            data-slot="progress-bar-fill"
            style={{
              width: `${percentage ?? 0}%`,
              height: "100%",
              borderRadius: "9999px",
              backgroundColor: fillColor,
              transitionProperty: "width",
              transitionDuration: "300ms",
              transitionTimingFunction: "ease",
            }}
          />
        </div>
      )}
    </AriaProgressBar>
  );
}

export const ProgressBar = forwardRef(ProgressBarInner);
ProgressBar.displayName = "ProgressBar";
