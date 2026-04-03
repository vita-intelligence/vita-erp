/**
 * Badge — Vita ERP status badge component.
 *
 * Positioned indicator (dot, count) typically overlaid on another element.
 * Uses --vita-badge-* tokens shared with Chip for visual consistency.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";

export interface BadgeProps {
  /** Content rendered inside the badge (number, text, or empty for dot) */
  content?: ReactNode;
  /** Color variant */
  color?: "default" | "primary" | "success" | "warning" | "danger";
  /** Whether to show the badge */
  isInvisible?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const COLOR_MAP: Record<string, string> = {
  default: "var(--vita-neutral-500)",
  primary: "var(--vita-primary)",
  success: "var(--vita-success)",
  warning: "var(--vita-warning)",
  danger: "var(--vita-error)",
};

function BadgeInner(
  {
    content,
    color = "danger",
    isInvisible,
    className,
    style,
    children,
  }: BadgeProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const bg = COLOR_MAP[color] ?? COLOR_MAP.default;
  const isDot = content === undefined || content === null;

  return (
    <span
      ref={ref}
      data-slot="badge-wrapper"
      className={className}
      style={{ position: "relative", display: "inline-flex", ...style }}
    >
      {children}
      {!isInvisible && (
        <span
          data-slot="badge"
          style={{
            position: "absolute",
            top: isDot ? "2px" : "-4px",
            right: isDot ? "2px" : "-4px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: isDot ? "8px" : "18px",
            height: isDot ? "8px" : "18px",
            padding: isDot ? 0 : "0 5px",
            borderRadius: "9999px",
            backgroundColor: bg,
            color: "white",
            fontSize: "10px",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {isDot ? null : content}
        </span>
      )}
    </span>
  );
}

export const Badge = forwardRef(BadgeInner);
Badge.displayName = "Badge";
