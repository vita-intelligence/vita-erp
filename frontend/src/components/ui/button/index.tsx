/**
 * Button — Vita ERP button built on React Aria.
 *
 * Fully accessible (WCAG 2.1 AA) with keyboard, focus management,
 * and screen reader support via React Aria primitives.
 *
 * All visual properties are driven by --vita-* CSS custom properties,
 * giving the theme editor full control over appearance.
 *
 * Available variants: primary | secondary | tertiary | ghost | outline | danger | danger-soft
 * Available sizes:    sm | md | lg
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
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";

import { useCursorTrack } from "@/hooks/useCursorTrack";
import { useThemeStore } from "@/stores/theme";

// ── Types ───────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "outline"
  | "danger"
  | "danger-soft";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonRootProps
  extends Omit<AriaButtonProps, "className" | "style" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// ── Variant styles ──────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: "var(--vita-primary)",
    color: "var(--vita-text-on-primary)",
    borderColor: "var(--vita-btn-border-color)",
  },
  secondary: {
    backgroundColor: "var(--vita-neutral-200)",
    color: "var(--vita-neutral-900)",
    borderColor: "var(--vita-btn-border-color)",
  },
  tertiary: {
    backgroundColor: "transparent",
    color: "var(--vita-text-secondary)",
    borderColor: "var(--vita-btn-border-color)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--vita-text-secondary)",
    borderColor: "var(--vita-btn-border-color)",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--vita-neutral-900)",
    borderColor: "var(--vita-btn-border-color)",
  },
  danger: {
    backgroundColor: "var(--vita-error)",
    color: "var(--vita-text-on-danger)",
    borderColor: "var(--vita-btn-border-color)",
  },
  "danger-soft": {
    backgroundColor: "var(--vita-error-light)",
    color: "var(--vita-error-dark)",
    borderColor: "var(--vita-btn-border-color)",
  },
};

// ── Size styles ─────────────────────────────────────────────────────────────

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { height: "32px", paddingInline: "12px", fontSize: "13px" },
  md: { height: "36px", paddingInline: "16px", fontSize: "14px" },
  lg: { height: "40px", paddingInline: "20px", fontSize: "15px" },
};

// ── Component ───────────────────────────────────────────────────────────────

function ButtonRootInner(
  {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    style,
    children,
    ...ariaProps
  }: ButtonRootProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const trackIntensity = useThemeStore((s) =>
    parseFloat(s.tokens.btnCursorTrack ?? "0"),
  );
  const trackRestore = useThemeStore((s) =>
    parseFloat(s.tokens.btnCursorTrackRestore ?? "300"),
  );
  const { onMouseMove, onMouseLeave } = useCursorTrack(
    "btn",
    trackIntensity,
    trackRestore,
  );
  const trackProps =
    trackIntensity > 0 && !ariaProps.isDisabled
      ? { onMouseMove, onMouseLeave }
      : {};

  return (
    <AriaButton
      {...ariaProps}
      {...trackProps}
      ref={ref}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={["vita-button", className].filter(Boolean).join(" ")}
      style={{
        // Reset
        appearance: "none",
        outline: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        whiteSpace: "nowrap",
        userSelect: "none",
        width: fullWidth ? "100%" : undefined,

        // Variant colors
        ...variantStyle,

        // Size
        ...sizeStyle,

        // Theme tokens — shape & effects
        borderRadius: "var(--vita-btn-radius, 8px)",
        borderTopWidth: "var(--vita-btn-border-top, 1px)",
        borderRightWidth: "var(--vita-btn-border-right, 1px)",
        borderBottomWidth: "var(--vita-btn-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-btn-border-left, 1px)",
        borderStyle:
          "var(--vita-btn-border-style, solid)" as CSSProperties["borderStyle"],
        fontWeight: "var(--vita-btn-font-weight, 500)",
        letterSpacing: "var(--vita-btn-letter-spacing, 0.02em)",
        textTransform:
          "var(--vita-btn-text-transform, none)" as CSSProperties["textTransform"],
        boxShadow: "var(--vita-btn-shadow, none)",
        fontFamily: "inherit",
        lineHeight: "1",

        // Transitions
        transitionProperty:
          "color, background-color, border-color, box-shadow, transform, filter, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-btn-transition-duration, 150ms)",

        // 3D perspective rotation
        transform:
          "perspective(800px) rotateX(var(--vita-btn-rotate-x, 0deg)) rotateY(var(--vita-btn-rotate-y, 0deg)) rotateZ(var(--vita-btn-rotate-z, 0deg))",

        // Disabled state
        ...(ariaProps.isDisabled
          ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" }
          : {}),

        // Consumer overrides last
        ...style,
      }}
    >
      {children}
    </AriaButton>
  );
}

// ── Exports ─────────────────────────────────────────────────────────────────

export const ButtonRoot = forwardRef(ButtonRootInner);
ButtonRoot.displayName = "ButtonRoot";

export const Button = Object.assign(forwardRef(ButtonRootInner), {
  Root: ButtonRoot,
});
Button.displayName = "Button";

export type { AriaButtonProps };
