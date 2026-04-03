/**
 * TextArea — Vita ERP textarea built on React Aria.
 *
 * Shares theme tokens with Input (--vita-input-*) for visual consistency.
 * Exports TextField, Label, FieldError for form composition.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  FieldError as AriaFieldError,
  type FieldErrorProps as AriaFieldErrorProps,
  Label as AriaLabel,
  type LabelProps as AriaLabelProps,
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
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
      style={{ display: "flex", flexDirection: "column", gap: "4px", ...style }}
    >
      {children}
    </AriaTextField>
  );
}

export const TextField = forwardRef(TextFieldInner);
TextField.displayName = "TextField";

// ── TextArea ────────────────────────────────────────────────────────────────

export interface TextAreaRootProps
  extends Omit<AriaTextAreaProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function TextAreaInner(
  { className, style, ...ariaProps }: TextAreaRootProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <AriaTextArea
      {...ariaProps}
      ref={ref}
      data-slot="textarea"
      className={["vita-textarea", className].filter(Boolean).join(" ")}
      style={{
        appearance: "none",
        outline: "none",
        margin: 0,
        resize: "vertical",
        minHeight: "80px",
        background: "var(--vita-surface)",
        color: "var(--vita-text-primary)",
        fontFamily: "inherit",
        width: "100%",
        borderRadius: "var(--vita-input-radius, 8px)",
        borderWidth: "1px",
        borderStyle:
          "var(--vita-input-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-input-border-color)",
        boxShadow: "var(--vita-input-shadow, none)",
        paddingLeft: "var(--vita-input-padding-x, 12px)",
        paddingRight: "var(--vita-input-padding-x, 12px)",
        paddingTop: "var(--vita-input-padding-y, 8px)",
        paddingBottom: "var(--vita-input-padding-y, 8px)",
        fontSize: "var(--vita-input-font-size, 14px)",
        transitionProperty:
          "border-color, box-shadow, outline, background-color",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-input-transition-duration, 150ms)",
        ...style,
      }}
    />
  );
}

export const TextArea = forwardRef(TextAreaInner);
TextArea.displayName = "TextArea";

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
