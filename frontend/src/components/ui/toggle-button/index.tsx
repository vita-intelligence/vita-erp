/**
 * ToggleButton — Vita ERP toggle button built on React Aria.
 *
 * Accessible toggle with keyboard support (Space/Enter).
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";

export interface ToggleButtonProps
  extends Omit<AriaToggleButtonProps, "className" | "style" | "children"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ToggleButtonInner(
  { className, style, children, ...ariaProps }: ToggleButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <AriaToggleButton
      {...ariaProps}
      ref={ref}
      data-slot="toggle-button"
      className={["vita-toggle-button", className].filter(Boolean).join(" ")}
      style={{
        appearance: "none",
        outline: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "var(--vita-btn-radius, 8px)",
        border: "1px solid var(--vita-neutral-200)",
        backgroundColor: "transparent",
        color: "var(--vita-text-primary)",
        fontSize: "14px",
        fontWeight: 500,
        fontFamily: "inherit",
        userSelect: "none",
        transitionProperty: "background-color, border-color, color",
        transitionDuration: "150ms",
        ...style,
      }}
    >
      {children}
    </AriaToggleButton>
  );
}

export const ToggleButton = forwardRef(ToggleButtonInner);
ToggleButton.displayName = "ToggleButton";
