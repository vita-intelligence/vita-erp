/**
 * Form — Vita ERP form built on React Aria.
 *
 * Provides form validation integration with React Aria components.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  Form as AriaForm,
  type FormProps as AriaFormProps,
} from "react-aria-components";

export interface FormProps extends Omit<AriaFormProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function FormInner(
  { className, style, children, ...ariaProps }: FormProps,
  ref: ForwardedRef<HTMLFormElement>,
) {
  return (
    <AriaForm
      {...ariaProps}
      ref={ref}
      data-slot="form"
      className={className}
      style={style}
    >
      {children}
    </AriaForm>
  );
}

export const Form = forwardRef(FormInner);
Form.displayName = "Form";
