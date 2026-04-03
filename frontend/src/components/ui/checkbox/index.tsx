/**
 * Checkbox — Vita ERP checkbox built on React Aria.
 *
 * Fully accessible with keyboard toggle (Space), focus management,
 * and screen reader support. Compound pattern with Control, Indicator, Content.
 *
 * All visual properties driven by --vita-checkbox-* CSS custom properties.
 *
 * Compound usage:
 *   <Checkbox value="option-a">
 *     <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
 *     <Checkbox.Content><Label>Option A</Label></Checkbox.Content>
 *   </Checkbox>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";

// ── Checkbox Root ───────────────────────────────────────────────────────────

export interface CheckboxRootProps
  extends Omit<AriaCheckboxProps, "className" | "style" | "children"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function CheckboxRootInner(
  { className, style, children, ...ariaProps }: CheckboxRootProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  return (
    <AriaCheckbox
      {...ariaProps}
      ref={ref}
      data-slot="checkbox"
      className={["vita-checkbox", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "var(--vita-checkbox-gap, 8px)",
        cursor: ariaProps.isDisabled ? "not-allowed" : "pointer",
        opacity: ariaProps.isDisabled ? 0.5 : 1,
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </AriaCheckbox>
  );
}

// ── Control (box) ───────────────────────────────────────────────────────────

export interface CheckboxControlProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function CheckboxControl({
  className,
  style,
  children,
}: CheckboxControlProps) {
  return (
    <span
      data-slot="checkbox-control"
      className={["vita-checkbox-control", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: "var(--vita-checkbox-size, 20px)",
        height: "var(--vita-checkbox-size, 20px)",
        minWidth: "var(--vita-checkbox-size, 20px)",
        minHeight: "var(--vita-checkbox-size, 20px)",
        borderRadius: "var(--vita-checkbox-radius, 4px)",
        borderWidth: "var(--vita-checkbox-border-width, 2px)",
        borderStyle:
          "var(--vita-checkbox-border-style, solid)" as CSSProperties["borderStyle"],
        boxShadow: "var(--vita-checkbox-shadow, none)",
        transitionProperty:
          "background-color, border-color, box-shadow, transform",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-checkbox-transition-duration, 150ms)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Indicator (checkmark) ───────────────────────────────────────────────────

export interface CheckboxIndicatorProps {
  className?: string;
  style?: CSSProperties;
}

export function CheckboxIndicator({
  className,
  style,
}: CheckboxIndicatorProps) {
  return (
    <svg
      aria-hidden="true"
      data-slot="checkbox-indicator"
      className={["vita-checkbox-indicator", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: "var(--vita-checkbox-indicator-size, 14px)",
        height: "var(--vita-checkbox-indicator-size, 14px)",
        strokeWidth: "var(--vita-checkbox-indicator-stroke, 2.5)",
        color: "var(--vita-text-on-primary)",
        ...style,
      }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ── Content (label area) ────────────────────────────────────────────────────

export interface CheckboxContentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function CheckboxContent({
  className,
  style,
  children,
}: CheckboxContentProps) {
  return (
    <span
      data-slot="checkbox-content"
      className={["vita-checkbox-content", className].filter(Boolean).join(" ")}
      style={{
        fontSize: "var(--vita-checkbox-label-font-size, 14px)",
        fontWeight: "var(--vita-checkbox-label-font-weight, 400)",
        color: "var(--vita-text-primary)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const Checkbox = Object.assign(forwardRef(CheckboxRootInner), {
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
  Content: CheckboxContent,
});
Checkbox.displayName = "Checkbox";
