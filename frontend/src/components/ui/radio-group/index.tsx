/**
 * RadioGroup — Vita ERP radio group built on React Aria.
 *
 * Fully accessible with keyboard navigation (Arrow keys),
 * focus management, and screen reader support.
 *
 * Compound usage:
 *   <RadioGroup value={val} onChange={setVal}>
 *     <Radio value="a">
 *       <Radio.Control><Radio.Indicator /></Radio.Control>
 *       <Radio.Content><Label>Option A</Label></Radio.Content>
 *     </Radio>
 *   </RadioGroup>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components";

// ── RadioGroup ──────────────────────────────────────────────────────────────

export interface RadioGroupProps
  extends Omit<AriaRadioGroupProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function RadioGroupInner(
  { className, style, children, ...ariaProps }: RadioGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaRadioGroup
      {...ariaProps}
      ref={ref}
      data-slot="radio-group"
      className={["vita-radio-group", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...style,
      }}
    >
      {children}
    </AriaRadioGroup>
  );
}

export const RadioGroup = forwardRef(RadioGroupInner);
RadioGroup.displayName = "RadioGroup";

// ── Radio ───────────────────────────────────────────────────────────────────

export interface RadioRootProps
  extends Omit<AriaRadioProps, "className" | "style" | "children"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function RadioRootInner(
  { className, style, children, ...ariaProps }: RadioRootProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  return (
    <AriaRadio
      {...ariaProps}
      ref={ref}
      data-slot="radio"
      className={["vita-radio", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: "8px",
        cursor: ariaProps.isDisabled ? "not-allowed" : "pointer",
        opacity: ariaProps.isDisabled ? 0.5 : 1,
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </AriaRadio>
  );
}

// ── Radio Control (circle) ──────────────────────────────────────────────────

export interface RadioControlProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function RadioControl({
  className,
  style,
  children,
}: RadioControlProps) {
  return (
    <span
      data-slot="radio-control"
      className={["vita-radio-control", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: "20px",
        height: "20px",
        borderRadius: "9999px",
        borderWidth: "2px",
        borderStyle: "solid",
        transitionProperty: "background-color, border-color, box-shadow",
        transitionTimingFunction: "ease",
        transitionDuration: "150ms",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Radio Indicator (inner dot) ─────────────────────────────────────────────

export interface RadioIndicatorProps {
  className?: string;
  style?: CSSProperties;
}

export function RadioIndicator({ className, style }: RadioIndicatorProps) {
  return (
    <span
      data-slot="radio-indicator"
      className={["vita-radio-indicator", className].filter(Boolean).join(" ")}
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "9999px",
        ...style,
      }}
    />
  );
}

// ── Radio Content ───────────────────────────────────────────────────────────

export interface RadioContentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function RadioContent({
  className,
  style,
  children,
}: RadioContentProps) {
  return (
    <span
      data-slot="radio-content"
      className={["vita-radio-content", className].filter(Boolean).join(" ")}
      style={{
        fontSize: "14px",
        color: "var(--vita-text-primary)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Label ───────────────────────────────────────────────────────────────────

export interface LabelProps
  extends Omit<AriaLabelProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function LabelInner(
  { className, style, children, ...ariaProps }: LabelProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  return (
    <AriaLabel
      {...ariaProps}
      ref={ref}
      data-slot="label"
      className={["vita-label", className].filter(Boolean).join(" ")}
      style={{
        fontWeight: "var(--vita-input-label-weight, 500)",
        fontSize: "var(--vita-input-label-size, 12px)",
        color: "var(--vita-text-secondary)",
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </AriaLabel>
  );
}

export const Label = forwardRef(LabelInner);
Label.displayName = "Label";

// ── Compound Export ─────────────────────────────────────────────────────────

export const Radio = Object.assign(forwardRef(RadioRootInner), {
  Control: RadioControl,
  Indicator: RadioIndicator,
  Content: RadioContent,
});
Radio.displayName = "Radio";
