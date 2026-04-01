/**
 * Select — Vita ERP select built on React Aria.
 *
 * Fully accessible (WCAG 2.1 AA) with keyboard navigation, typeahead,
 * focus management, and screen reader support via React Aria primitives.
 *
 * All visual properties are driven by --vita-* CSS custom properties,
 * giving the theme editor full control over appearance.
 *
 * Compound usage:
 *   <Select selectedKey={val} onSelectionChange={setVal}>
 *     <Select.Trigger>
 *       <Select.Value />
 *       <Select.Indicator />
 *     </Select.Trigger>
 *     <Select.Popover>
 *       <ListBox>
 *         <ListBox.Item id="a" textValue="Alpha">
 *           Alpha
 *           <ListBox.ItemIndicator />
 *         </ListBox.Item>
 *       </ListBox>
 *     </Select.Popover>
 *   </Select>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type Key,
} from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue as AriaSelectValue,
  type SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";

// ── Select Root ─────────────────────────────────────────────────────────────

export interface SelectRootProps<T extends object = object>
  extends Omit<AriaSelectProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SelectRootInner<T extends object = object>(
  { className, style, children, ...ariaProps }: SelectRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaSelect<T>
      {...ariaProps}
      ref={ref}
      data-slot="select"
      className={["vita-select", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        ...style,
      }}
    >
      {children}
    </AriaSelect>
  );
}

const SelectRootWithRef = forwardRef(SelectRootInner) as <
  T extends object = object,
>(
  props: SelectRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof SelectRootInner>;

export { SelectRootWithRef as SelectRoot };

// ── Select Trigger ──────────────────────────────────────────────────────────

export interface SelectTriggerProps
  extends Omit<AriaButtonProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SelectTriggerInner(
  { className, style, children, ...ariaProps }: SelectTriggerProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <AriaButton
      {...ariaProps}
      ref={ref}
      data-slot="select-trigger"
      className={["vita-select-trigger", className].filter(Boolean).join(" ")}
      style={{
        // Reset
        appearance: "none",
        outline: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "inherit",
        background: "var(--vita-surface)",
        color: "var(--vita-text-primary)",

        // Theme tokens (inherits from input tokens for consistency)
        width: "100%",
        borderRadius:
          "var(--vita-select-radius, var(--vita-input-radius, 8px))",
        borderTopWidth: "var(--vita-input-border-top, 1px)",
        borderRightWidth: "var(--vita-input-border-right, 1px)",
        borderBottomWidth: "var(--vita-input-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-input-border-left, 1px)",
        borderStyle:
          "var(--vita-select-border-style, var(--vita-input-border-style, solid))" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-input-border-color)",
        boxShadow: "var(--vita-input-shadow, none)",
        paddingLeft: "var(--vita-input-padding-x, 12px)",
        paddingRight: "var(--vita-input-padding-x, 12px)",
        paddingTop: "var(--vita-input-padding-y, 8px)",
        paddingBottom: "var(--vita-input-padding-y, 8px)",
        fontSize: "var(--vita-input-font-size, 14px)",

        // Transitions
        transitionProperty:
          "border-color, box-shadow, outline, background-color",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-input-transition-duration, 150ms)",

        ...style,
      }}
    >
      {children}
    </AriaButton>
  );
}

export const SelectTrigger = forwardRef(SelectTriggerInner);
SelectTrigger.displayName = "SelectTrigger";

// ── Select Value ────────────────────────────────────────────────────────────

export interface SelectValueProps<T extends object = object>
  extends Omit<AriaSelectValueProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SelectValueInner<T extends object = object>(
  { className, style, ...ariaProps }: SelectValueProps<T>,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  return (
    <AriaSelectValue<T>
      {...ariaProps}
      ref={ref}
      data-slot="select-value"
      className={["vita-select-value", className].filter(Boolean).join(" ")}
      style={{
        flex: 1,
        textAlign: "start",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        ...style,
      }}
    />
  );
}

const SelectValueWithRef = forwardRef(SelectValueInner) as <
  T extends object = object,
>(
  props: SelectValueProps<T> & { ref?: ForwardedRef<HTMLSpanElement> },
) => ReturnType<typeof SelectValueInner>;

export { SelectValueWithRef as SelectValue };

// ── Select Indicator (chevron) ──────────────────────────────────────────────

export interface SelectIndicatorProps {
  className?: string;
  style?: CSSProperties;
}

export function SelectIndicator({ className, style }: SelectIndicatorProps) {
  return (
    <svg
      aria-hidden="true"
      data-slot="select-indicator"
      className={className}
      style={{
        width: "16px",
        height: "16px",
        flexShrink: 0,
        marginInlineStart: "auto",
        color: "var(--vita-text-muted)",
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ── Select Popover ──────────────────────────────────────────────────────────

export interface SelectPopoverProps
  extends Omit<AriaPopoverProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function SelectPopoverInner(
  { className, style, children, ...ariaProps }: SelectPopoverProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaPopover
      {...ariaProps}
      ref={ref}
      data-slot="select-popover"
      className={["vita-select-popover", className].filter(Boolean).join(" ")}
      style={{
        background: "var(--vita-surface)",
        border: "1px solid var(--vita-neutral-200)",
        borderRadius:
          "var(--vita-select-radius, var(--vita-input-radius, 8px))",
        boxShadow:
          "0 4px 16px oklch(0 0 0 / 0.08), 0 1px 4px oklch(0 0 0 / 0.04)",
        padding: "4px",
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

export const SelectPopover = forwardRef(SelectPopoverInner);
SelectPopover.displayName = "SelectPopover";

// ── ListBox ─────────────────────────────────────────────────────────────────

export interface ListBoxRootProps<T extends object = object>
  extends Omit<AriaListBoxProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function ListBoxInner<T extends object = object>(
  { className, style, children, ...ariaProps }: ListBoxRootProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaListBox<T>
      {...ariaProps}
      ref={ref}
      data-slot="listbox"
      className={["vita-listbox", className].filter(Boolean).join(" ")}
      style={{
        outline: "none",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        ...style,
      }}
    >
      {children}
    </AriaListBox>
  );
}

// ── ListBox Item ────────────────────────────────────────────────────────────

export interface ListBoxItemProps<T extends object = object>
  extends Omit<AriaListBoxItemProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function ListBoxItemInner<T extends object = object>(
  { className, style, children, ...ariaProps }: ListBoxItemProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaListBoxItem<T>
      {...ariaProps}
      ref={ref}
      data-slot="listbox-item"
      className={["vita-listbox-item", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 8px",
        borderRadius: "4px",
        fontSize: "var(--vita-input-font-size, 14px)",
        cursor: "pointer",
        outline: "none",
        color: "var(--vita-text-primary)",
        ...style,
      }}
    >
      {children}
    </AriaListBoxItem>
  );
}

// ── Item Indicator (checkmark) ──────────────────────────────────────────────

export function ItemIndicator({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      data-slot="item-indicator"
      className={["vita-item-indicator", className].filter(Boolean).join(" ")}
      style={{
        width: "14px",
        height: "14px",
        flexShrink: 0,
        marginInlineStart: "auto",
        color: "var(--vita-primary)",
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// ── Compound Exports ────────────────────────────────────────────────────────

const ListBoxWithRef = forwardRef(ListBoxInner) as <T extends object = object>(
  props: ListBoxRootProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof ListBoxInner>;

const ListBoxItemWithRef = forwardRef(ListBoxItemInner) as <
  T extends object = object,
>(
  props: ListBoxItemProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof ListBoxItemInner>;

export const ListBox = Object.assign(ListBoxWithRef, {
  Item: ListBoxItemWithRef,
  ItemIndicator,
});

export const Select = Object.assign(SelectRootWithRef, {
  Root: SelectRootWithRef,
  Trigger: SelectTrigger,
  Value: SelectValueWithRef,
  Indicator: SelectIndicator,
  Popover: SelectPopover,
});

// ── Re-export types ─────────────────────────────────────────────────────────

export type { Key };
