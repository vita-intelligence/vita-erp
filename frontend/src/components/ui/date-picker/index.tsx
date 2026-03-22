/**
 * DatePicker — Vita ERP wrapper for HeroUI DatePicker compound component.
 *
 * Applies theme tokens as inline styles on each sub-component
 * (Trigger, TriggerIndicator, Popover) so they override HeroUI's built-in
 * Tailwind styles.
 * This is the single place to customize date-picker appearance.
 */

"use client";

import {
  type DatePickerPopoverProps,
  type DatePickerRootProps,
  type DatePickerTriggerIndicatorProps,
  type DatePickerTriggerProps,
  DatePickerPopover as HeroDatePickerPopover,
  DatePickerRoot as HeroDatePickerRoot,
  DatePickerTrigger as HeroDatePickerTrigger,
  DatePickerTriggerIndicator as HeroDatePickerTriggerIndicator,
} from "@heroui/react";
import React from "react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Trigger ───────────────────────────────────────────────────────────

const ThemedDatePickerTrigger = React.forwardRef<
  HTMLButtonElement,
  DatePickerTriggerProps
>(function ThemedDatePickerTrigger({ children, ...props }, ref) {
  return (
    <HeroDatePickerTrigger
      ref={ref}
      {...props}
      style={{
        borderRadius: "var(--vita-date-picker-trigger-radius, 0px)",
        borderWidth: "var(--vita-date-picker-trigger-border-width, 1px)",
        borderStyle:
          "var(--vita-date-picker-trigger-border-style, solid)" as React.CSSProperties["borderStyle"],
        paddingLeft: "var(--vita-date-picker-trigger-padding-x, 12px)",
        paddingRight: "var(--vita-date-picker-trigger-padding-x, 12px)",
        paddingTop: "var(--vita-date-picker-trigger-padding-y, 8px)",
        paddingBottom: "var(--vita-date-picker-trigger-padding-y, 8px)",
        boxShadow: "var(--vita-date-picker-trigger-shadow, none)",
        transitionDuration:
          "var(--vita-date-picker-transition-duration, 150ms)",
      }}
    >
      {children}
    </HeroDatePickerTrigger>
  );
});

// ── Themed TriggerIndicator ──────────────────────────────────────────────────

function ThemedDatePickerTriggerIndicator({
  children,
  style,
  ...props
}: DatePickerTriggerIndicatorProps) {
  return (
    <HeroDatePickerTriggerIndicator
      {...props}
      style={{
        width: "var(--vita-date-picker-indicator-size, 18px)",
        height: "var(--vita-date-picker-indicator-size, 18px)",
        ...style,
      }}
    >
      {children}
    </HeroDatePickerTriggerIndicator>
  );
}

// ── Themed Popover ───────────────────────────────────────────────────────────

function ThemedDatePickerPopover({
  children,
  ...props
}: DatePickerPopoverProps) {
  return (
    <HeroDatePickerPopover
      {...props}
      style={{
        borderRadius: "var(--vita-date-picker-popover-radius, 0px)",
        boxShadow: "var(--vita-date-picker-popover-shadow, none)",
        padding: "var(--vita-date-picker-popover-padding, 12px)",
      }}
    >
      {children}
    </HeroDatePickerPopover>
  );
}

// ── Compound Exports ─────────────────────────────────────────────────────────

export const DatePickerRoot = HeroDatePickerRoot;
export const DatePickerTrigger = ThemedDatePickerTrigger;
export const DatePickerTriggerIndicator = ThemedDatePickerTriggerIndicator;
export const DatePickerPopover = ThemedDatePickerPopover;

export const DatePicker = Object.assign(HeroDatePickerRoot, {
  Root: HeroDatePickerRoot,
  Trigger: ThemedDatePickerTrigger,
  TriggerIndicator: ThemedDatePickerTriggerIndicator,
  Popover: ThemedDatePickerPopover,
});
