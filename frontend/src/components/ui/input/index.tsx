/**
 * Input — Vita ERP text input built on React Aria.
 *
 * Fully accessible (WCAG 2.1 AA) with keyboard navigation, focus management,
 * label association, validation, and screen reader support via React Aria.
 *
 * All visual properties are driven by --vita-input-* CSS custom properties,
 * giving the theme editor full control over appearance.
 *
 * Exports:
 *   - Input      — themed <input> element
 *   - TextField  — accessible wrapper (auto-connects Label, Input, FieldError)
 *   - Label      — themed label element (auto-associated via TextField context)
 *   - FieldError — validation error display
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";

// ── TextField ───────────────────────────────────────────────────────────────

export interface TextFieldProps
  extends Omit<AriaTextFieldProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TextFieldInner(
  { className, style, children, ...ariaProps }: TextFieldProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTextField
      {...ariaProps}
      ref={ref}
      data-slot="textfield"
      className={["vita-textfield", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        ...style,
      }}
    >
      {children}
    </AriaTextField>
  );
}

export const TextField = forwardRef(TextFieldInner);
TextField.displayName = "TextField";

// ── Input ───────────────────────────────────────────────────────────────────

export interface InputRootProps
  extends Omit<AriaInputProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function InputRootInner(
  { className, style, ...ariaProps }: InputRootProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <AriaInput
      {...ariaProps}
      ref={ref}
      data-slot="input"
      className={["vita-input", className].filter(Boolean).join(" ")}
      style={{
        // Reset
        appearance: "none",
        outline: "none",
        margin: 0,
        background: "var(--vita-surface)",
        color: "var(--vita-text-primary)",
        fontFamily: "inherit",

        // Theme tokens
        width: "100%",
        borderRadius: "var(--vita-input-radius, 8px)",
        borderTopWidth: "var(--vita-input-border-top, 1px)",
        borderRightWidth: "var(--vita-input-border-right, 1px)",
        borderBottomWidth: "var(--vita-input-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-input-border-left, 1px)",
        borderStyle:
          "var(--vita-input-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-input-border-color)",
        boxShadow: "var(--vita-input-shadow, none)",
        paddingLeft: "var(--vita-input-padding-x, 12px)",
        paddingRight: "var(--vita-input-padding-x, 12px)",
        paddingTop: "var(--vita-input-padding-y, 8px)",
        paddingBottom: "var(--vita-input-padding-y, 8px)",
        fontSize: "var(--vita-input-font-size, 14px)",
        textAlign:
          "var(--vita-input-text-align, left)" as CSSProperties["textAlign"],

        // Transitions
        transitionProperty:
          "border-color, box-shadow, outline, background-color",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-input-transition-duration, 150ms)",

        // Consumer overrides last
        ...style,
      }}
    />
  );
}

export const InputRoot = forwardRef(InputRootInner);
InputRoot.displayName = "InputRoot";

export const Input = Object.assign(forwardRef(InputRootInner), {
  Root: InputRoot,
});
Input.displayName = "Input";

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

// ── FieldError ──────────────────────────────────────────────────────────────

export interface FieldErrorProps
  extends Omit<AriaFieldErrorProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function FieldErrorInner(
  { className, style, children, ...ariaProps }: FieldErrorProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <AriaFieldError
      {...ariaProps}
      ref={ref}
      data-slot="field-error"
      className={["vita-field-error", className].filter(Boolean).join(" ")}
      style={{
        color: "var(--vita-error)",
        fontSize: "12px",
        lineHeight: "1.4",
        ...style,
      }}
    >
      {children}
    </AriaFieldError>
  );
}

export const FieldError = forwardRef(FieldErrorInner);
FieldError.displayName = "FieldError";

// ── Re-export types for consumers ───────────────────────────────────────────

export type { ValidationResult };
