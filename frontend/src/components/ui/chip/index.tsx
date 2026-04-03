/**
 * Chip (Badge) — Vita ERP chip/badge component.
 *
 * Presentational component for labels, tags, and status indicators.
 * Design tokens use --vita-badge-* prefix (theme editor module name).
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";

// ── Helpers ─────────────────────────────────────────────────────────────────

const IDLE_TRANSFORM = [
  "perspective(800px)",
  "rotateX(var(--vita-badge-rotate-x, 0deg))",
  "rotateY(var(--vita-badge-rotate-y, 0deg))",
  "rotateZ(var(--vita-badge-rotate-z, 0deg))",
].join(" ");

// ── Color × Variant map ─────────────────────────────────────────────────────

export type ChipColor =
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";
export type ChipVariant = "primary" | "soft" | "outline";

const COLOR_MAP: Record<
  ChipColor,
  { bg: string; softBg: string; fg: string; border: string }
> = {
  accent: {
    bg: "var(--vita-primary)",
    softBg: "var(--vita-primary-light, var(--vita-neutral-100))",
    fg: "var(--vita-text-on-primary)",
    border: "var(--vita-primary)",
  },
  success: {
    bg: "var(--vita-success)",
    softBg: "var(--vita-success-light)",
    fg: "var(--vita-text-on-primary)",
    border: "var(--vita-success)",
  },
  warning: {
    bg: "var(--vita-warning)",
    softBg: "var(--vita-warning-light)",
    fg: "var(--vita-text-on-warning)",
    border: "var(--vita-warning)",
  },
  danger: {
    bg: "var(--vita-error)",
    softBg: "var(--vita-error-light)",
    fg: "var(--vita-text-on-danger)",
    border: "var(--vita-error)",
  },
  info: {
    bg: "var(--vita-info)",
    softBg: "var(--vita-info-light)",
    fg: "var(--vita-text-on-primary)",
    border: "var(--vita-info)",
  },
  default: {
    bg: "var(--vita-neutral-200)",
    softBg: "var(--vita-neutral-100)",
    fg: "var(--vita-text-primary)",
    border: "var(--vita-neutral-200)",
  },
};

function resolveColors(color: ChipColor, variant: ChipVariant) {
  const c = COLOR_MAP[color];
  switch (variant) {
    case "primary":
      return { backgroundColor: c.bg, color: c.fg, borderColor: c.bg };
    case "soft":
      return {
        backgroundColor: c.softBg,
        color: c.border,
        borderColor: c.softBg,
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        color: c.border,
        borderColor: c.border,
      };
  }
}

// ── Chip Root ───────────────────────────────────────────────────────────────

export interface ChipRootProps {
  color?: ChipColor;
  variant?: ChipVariant;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ChipRootInner(
  {
    color = "default",
    variant = "soft",
    className,
    style,
    children,
  }: ChipRootProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const colorStyle = resolveColors(color, variant);

  return (
    <span
      ref={ref}
      data-slot="chip"
      data-color={color}
      data-variant={variant}
      className={["vita-chip", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        ...colorStyle,
        borderRadius: "var(--vita-badge-radius, 9999px)",
        borderTopWidth: "var(--vita-badge-border-top, 1px)",
        borderRightWidth: "var(--vita-badge-border-right, 1px)",
        borderBottomWidth: "var(--vita-badge-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-badge-border-left, 1px)",
        borderStyle:
          "var(--vita-badge-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-neutral-200)",
        paddingLeft: "var(--vita-badge-padding-x, 0.55rem)",
        paddingRight: "var(--vita-badge-padding-x, 0.55rem)",
        paddingTop: "var(--vita-badge-padding-y, 0.2rem)",
        paddingBottom: "var(--vita-badge-padding-y, 0.2rem)",
        fontWeight: "var(--vita-badge-font-weight, 600)",
        fontSize: "var(--vita-badge-font-size, 0.6875rem)",
        letterSpacing: "var(--vita-badge-letter-spacing, 0em)",
        textTransform:
          "var(--vita-badge-text-transform, none)" as CSSProperties["textTransform"],
        transitionProperty: "transform, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-badge-transition-duration, 150ms)",
        transform: IDLE_TRANSFORM,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export const ChipRoot = forwardRef(ChipRootInner);
ChipRoot.displayName = "ChipRoot";

// ── Chip Label ──────────────────────────────────────────────────────────────

export interface ChipLabelProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ChipLabel({ className, style, children }: ChipLabelProps) {
  return (
    <span data-slot="chip-label" className={className} style={style}>
      {children}
    </span>
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const Chip = Object.assign(forwardRef(ChipRootInner), {
  Label: ChipLabel,
});
Chip.displayName = "Chip";
