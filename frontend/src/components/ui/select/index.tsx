/**
 * Select — Vita ERP wrapper for HeroUI Select (compound component).
 *
 * Applies theme tokens as inline styles on the Trigger sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize select appearance.
 *
 * Compound usage:
 *   <Select>
 *     <Select.Trigger><Select.Value /></Select.Trigger>
 *     <Select.Popover>
 *       <ListBox>...</ListBox>
 *     </Select.Popover>
 *   </Select>
 */

"use client";

import {
  SelectRoot as HeroSelectRoot,
  SelectTrigger as HeroSelectTrigger,
  SelectIndicator,
  type SelectIndicatorProps,
  SelectPopover,
  type SelectPopoverProps,
  type SelectRootProps,
  type SelectTriggerProps,
  SelectValue,
  type SelectValueProps,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedSelectRoot<
  T extends object = object,
  M extends "single" | "multiple" = "single",
>({ children, style, ...props }: SelectRootProps<T, M>) {
  return (
    <HeroSelectRoot<T, M>
      {...props}
      style={{
        ...style,
      }}
    >
      {children}
    </HeroSelectRoot>
  );
}

function ThemedSelectTrigger({
  children,
  style,
  ...props
}: SelectTriggerProps) {
  return (
    <HeroSelectTrigger
      {...props}
      style={{
        borderRadius: "var(--vita-select-radius, 0px)",
        borderWidth: "var(--vita-select-border-width, 1px)",
        borderStyle: "var(--vita-select-border-style, solid)",
        ...style,
      }}
    >
      {children}
    </HeroSelectTrigger>
  );
}

// ── Named Exports ────────────────────────────────────────────────────────────

export { ThemedSelectRoot as SelectRoot };
export { ThemedSelectTrigger as SelectTrigger };
export { SelectValue, SelectIndicator, SelectPopover };
export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectIndicatorProps,
  SelectPopoverProps,
};

// ── Compound Export ──────────────────────────────────────────────────────────

export const Select = Object.assign(ThemedSelectRoot, {
  Root: ThemedSelectRoot,
  Trigger: ThemedSelectTrigger,
  Value: SelectValue,
  Indicator: SelectIndicator,
  Popover: SelectPopover,
});
