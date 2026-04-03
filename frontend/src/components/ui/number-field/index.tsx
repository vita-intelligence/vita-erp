/**
 * NumberField — Vita ERP number input built on React Aria.
 *
 * Accessible number input with increment/decrement buttons,
 * keyboard support (Arrow Up/Down), and locale-aware formatting.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  Button as AriaButton,
  Group as AriaGroup,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Label as AriaLabel,
  NumberField as AriaNumberField,
  type NumberFieldProps as AriaNumberFieldProps,
} from "react-aria-components";

export interface NumberFieldProps
  extends Omit<AriaNumberFieldProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function NumberFieldInner(
  { className, style, children, ...ariaProps }: NumberFieldProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaNumberField
      {...ariaProps}
      ref={ref}
      data-slot="number-field"
      className={["vita-number-field", className].filter(Boolean).join(" ")}
      style={{ display: "flex", flexDirection: "column", gap: "4px", ...style }}
    >
      {children}
    </AriaNumberField>
  );
}

export const NumberField = forwardRef(NumberFieldInner);
NumberField.displayName = "NumberField";

// Re-export building blocks for composition
export {
  AriaButton as NumberFieldButton,
  AriaGroup as NumberFieldGroup,
  AriaInput as NumberFieldInput,
  AriaLabel as NumberFieldLabel,
};
export type { AriaInputProps as NumberFieldInputProps, AriaNumberFieldProps };
