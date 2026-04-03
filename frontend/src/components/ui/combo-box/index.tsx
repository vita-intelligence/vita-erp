/**
 * ComboBox — Vita ERP combo box built on React Aria.
 *
 * Combines text input with filterable dropdown list.
 * All visual properties driven by --vita-combo-box-* CSS custom properties.
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
  ComboBox as AriaComboBox,
  type ComboBoxProps as AriaComboBoxProps,
  Group as AriaGroup,
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  type ListBoxProps as AriaListBoxProps,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

// ── Root ────────────────────────────────────────────────────────────────────

export interface ComboBoxRootProps<T extends object = object>
  extends Omit<AriaComboBoxProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function ComboBoxRootInner<T extends object = object>(
  { className, style, children, ...ariaProps }: ComboBoxRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaComboBox<T>
      {...ariaProps}
      ref={ref}
      data-slot="combo-box"
      className={["vita-combo-box", className].filter(Boolean).join(" ")}
      style={{ position: "relative", ...style }}
    >
      {children}
    </AriaComboBox>
  );
}

const ComboBoxRootWithRef = forwardRef(ComboBoxRootInner) as <
  T extends object = object,
>(
  props: ComboBoxRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof ComboBoxRootInner>;

export { ComboBoxRootWithRef as ComboBoxRoot };

// ── InputGroup ──────────────────────────────────────────────────────────────

export interface ComboBoxInputGroupProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ComboBoxInputGroup({
  className,
  style,
  children,
}: ComboBoxInputGroupProps) {
  return (
    <AriaGroup
      data-slot="combo-box-input-group"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius:
          "var(--vita-combo-box-trigger-radius, var(--vita-input-radius, 8px))",
        border: "1px solid var(--vita-input-border-color)",
        backgroundColor: "var(--vita-surface)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </AriaGroup>
  );
}

// ── Trigger (button inside input group) ─────────────────────────────────────

export function ComboBoxTrigger({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <AriaButton
      data-slot="combo-box-trigger"
      style={{
        appearance: "none",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: "0 8px",
        color: "var(--vita-text-muted)",
        ...style,
      }}
    >
      {children ?? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </AriaButton>
  );
}

// ── Popover ─────────────────────────────────────────────────────────────────

export interface ComboBoxPopoverProps
  extends Omit<AriaPopoverProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ComboBoxPopoverInner(
  { className, style, children, ...ariaProps }: ComboBoxPopoverProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaPopover
      {...ariaProps}
      ref={ref}
      data-slot="combo-box-popover"
      className={["vita-combo-box-popover", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: "var(--vita-surface)",
        borderRadius: "var(--vita-combo-box-popover-radius, 8px)",
        border: "1px solid var(--vita-neutral-200)",
        boxShadow:
          "var(--vita-combo-box-popover-shadow, 0 4px 16px oklch(0 0 0 / 0.08))",
        padding: "var(--vita-combo-box-popover-padding, 4px)",
        overflow: "auto",
        maxHeight: "240px",
        width: "var(--trigger-width)",
        ...style,
      }}
    >
      {children}
    </AriaPopover>
  );
}

export const ComboBoxPopover = forwardRef(ComboBoxPopoverInner);
ComboBoxPopover.displayName = "ComboBoxPopover";

// ── Compound Export ─────────────────────────────────────────────────────────

export const ComboBox = Object.assign(ComboBoxRootWithRef, {
  Root: ComboBoxRootWithRef,
  InputGroup: ComboBoxInputGroup,
  Trigger: ComboBoxTrigger,
  Popover: ComboBoxPopover,
});

// Re-export building blocks
export { AriaInput as ComboBoxInput, AriaListBox as ComboBoxListBox };
export type {
  AriaInputProps as ComboBoxInputProps,
  AriaListBoxProps as ComboBoxListBoxProps,
};
