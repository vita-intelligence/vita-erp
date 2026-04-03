/**
 * ProgressCircle — Vita ERP circular progress indicator.
 *
 * Accessible via React Aria ProgressBar with circular SVG rendering.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from "react-aria-components";

export interface ProgressCircleProps
  extends Omit<AriaProgressBarProps, "className" | "style"> {
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "success" | "warning" | "danger";
  className?: string;
  style?: CSSProperties;
}

const COLOR_MAP: Record<string, string> = {
  primary: "var(--vita-primary)",
  success: "var(--vita-success)",
  warning: "var(--vita-warning)",
  danger: "var(--vita-error)",
};

function ProgressCircleInner(
  {
    size = 40,
    strokeWidth = 3,
    color = "primary",
    className,
    style,
    ...ariaProps
  }: ProgressCircleProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const fillColor = COLOR_MAP[color] ?? COLOR_MAP.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <AriaProgressBar
      {...ariaProps}
      ref={ref}
      data-slot="progress-circle"
      className={["vita-progress-circle", className].filter(Boolean).join(" ")}
      style={{ display: "inline-flex", ...style }}
    >
      {({ percentage }) => (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--vita-neutral-200)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={fillColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={
              circumference - ((percentage ?? 0) / 100) * circumference
            }
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 300ms ease" }}
          />
        </svg>
      )}
    </AriaProgressBar>
  );
}

export const ProgressCircle = forwardRef(ProgressCircleInner);
ProgressCircle.displayName = "ProgressCircle";
