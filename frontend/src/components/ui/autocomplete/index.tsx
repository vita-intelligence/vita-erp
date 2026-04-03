/**
 * Autocomplete — Vita ERP autocomplete built on React Aria ComboBox.
 *
 * Filterable dropdown with text input, keyboard navigation, and typeahead.
 * All visual properties driven by --vita-autocomplete-* CSS custom properties.
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
  Input as AriaInput,
  type InputProps as AriaInputProps,
  ListBox as AriaListBox,
  type ListBoxProps as AriaListBoxProps,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

// ── Root ────────────────────────────────────────────────────────────────────

export interface AutocompleteRootProps<T extends object = object>
  extends Omit<AriaComboBoxProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function AutocompleteRootInner<T extends object = object>(
  { className, style, children, ...ariaProps }: AutocompleteRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaComboBox<T>
      {...ariaProps}
      ref={ref}
      data-slot="autocomplete"
      className={["vita-autocomplete", className].filter(Boolean).join(" ")}
      style={{ position: "relative", ...style }}
    >
      {children}
    </AriaComboBox>
  );
}

const AutocompleteRootWithRef = forwardRef(AutocompleteRootInner) as <
  T extends object = object,
>(
  props: AutocompleteRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof AutocompleteRootInner>;

export { AutocompleteRootWithRef as AutocompleteRoot };

// ── Trigger (input wrapper) ─────────────────────────────────────────────────

export interface AutocompleteTriggerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AutocompleteTrigger({
  className,
  style,
  children,
}: AutocompleteTriggerProps) {
  return (
    <div
      data-slot="autocomplete-trigger"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Input / Value ───────────────────────────────────────────────────────────

export interface AutocompleteValueProps
  extends Omit<AriaInputProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function AutocompleteValueInner(
  { className, style, ...ariaProps }: AutocompleteValueProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <AriaInput
      {...ariaProps}
      ref={ref}
      data-slot="autocomplete-value"
      className={["vita-autocomplete-input", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        appearance: "none",
        outline: "none",
        width: "100%",
        borderRadius:
          "var(--vita-autocomplete-popover-radius, var(--vita-input-radius, 8px))",
        border: "1px solid var(--vita-input-border-color)",
        padding:
          "var(--vita-input-padding-y, 8px) var(--vita-input-padding-x, 12px)",
        fontSize: "var(--vita-input-font-size, 14px)",
        backgroundColor: "var(--vita-surface)",
        color: "var(--vita-text-primary)",
        fontFamily: "inherit",
        ...style,
      }}
    />
  );
}

export const AutocompleteValue = forwardRef(AutocompleteValueInner);
AutocompleteValue.displayName = "AutocompleteValue";

// ── Indicator / ClearButton ─────────────────────────────────────────────────

export function AutocompleteIndicator({ style }: { style?: CSSProperties }) {
  return (
    <AriaButton
      data-slot="autocomplete-indicator"
      style={{
        appearance: "none",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: "4px",
        position: "absolute",
        right: "8px",
        color: "var(--vita-text-muted)",
        ...style,
      }}
    >
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
    </AriaButton>
  );
}

export function AutocompleteClearButton({ style }: { style?: CSSProperties }) {
  return (
    <AriaButton
      data-slot="autocomplete-clear"
      style={{
        appearance: "none",
        border: "none",
        background: "none",
        cursor: "pointer",
        padding: "4px",
        color: "var(--vita-text-muted)",
        ...style,
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </AriaButton>
  );
}

// ── Filter (pass-through for compatibility) ─────────────────────────────────

export function AutocompleteFilter({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

// ── Popover ─────────────────────────────────────────────────────────────────

export interface AutocompletePopoverProps
  extends Omit<AriaPopoverProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function AutocompletePopoverInner(
  { className, style, children, ...ariaProps }: AutocompletePopoverProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaPopover
      {...ariaProps}
      ref={ref}
      data-slot="autocomplete-popover"
      className={["vita-autocomplete-popover", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: "var(--vita-surface)",
        borderRadius: "var(--vita-autocomplete-popover-radius, 8px)",
        border: "1px solid var(--vita-neutral-200)",
        boxShadow:
          "var(--vita-autocomplete-popover-shadow, 0 4px 16px oklch(0 0 0 / 0.08))",
        padding: "var(--vita-autocomplete-popover-padding, 4px)",
        maxHeight: "var(--vita-autocomplete-max-height, 256px)",
        overflow: "auto",
        width: "var(--trigger-width)",
        ...style,
      }}
    >
      {children}
    </AriaPopover>
  );
}

export const AutocompletePopover = forwardRef(AutocompletePopoverInner);
AutocompletePopover.displayName = "AutocompletePopover";

// ── Compound Export ─────────────────────────────────────────────────────────

export const Autocomplete = Object.assign(AutocompleteRootWithRef, {
  Root: AutocompleteRootWithRef,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
  Indicator: AutocompleteIndicator,
  Popover: AutocompletePopover,
  Filter: AutocompleteFilter,
  ClearButton: AutocompleteClearButton,
});

// Re-export ListBox for use inside Autocomplete popover
export { AriaListBox as ListBox };
export type { AriaListBoxProps as ListBoxProps };
