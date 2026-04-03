/**
 * CheckboxGroup — Vita ERP checkbox group built on React Aria.
 *
 * Manages selection state for multiple Checkbox children.
 * All visual properties driven by --vita-checkbox-group-* CSS custom properties.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
} from "react-aria-components";

// ── Types ───────────────────────────────────────────────────────────────────

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

// ── Component ───────────────────────────────────────────────────────────────

function CheckboxGroupInner(
  { className, style, children, ...ariaProps }: CheckboxGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaCheckboxGroup
      {...ariaProps}
      ref={ref}
      data-slot="checkbox-group"
      className={["vita-checkbox-group", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--vita-checkbox-group-radius, 0px)",
        paddingLeft: "var(--vita-checkbox-group-padding-x, 0px)",
        paddingRight: "var(--vita-checkbox-group-padding-x, 0px)",
        paddingTop: "var(--vita-checkbox-group-padding-y, 0px)",
        paddingBottom: "var(--vita-checkbox-group-padding-y, 0px)",
        borderWidth: "var(--vita-checkbox-group-border-width, 0px)",
        borderStyle:
          "var(--vita-checkbox-group-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-checkbox-group-border-color, transparent)",
        boxShadow: "var(--vita-checkbox-group-shadow, none)",
        gap: "var(--vita-checkbox-group-label-gap, 8px)",
        ...style,
      }}
    >
      {children}
    </AriaCheckboxGroup>
  );
}

// ── Export ───────────────────────────────────────────────────────────────────

export const CheckboxGroup = forwardRef(CheckboxGroupInner);
CheckboxGroup.displayName = "CheckboxGroup";
