/**
 * Autocomplete — Vita ERP wrapper for HeroUI Autocomplete.
 *
 * Applies theme tokens as inline styles on the popover sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * Trigger styling inherits from input tokens.
 * This is the single place to customize autocomplete appearance.
 */

"use client";

import {
  type AutocompletePopoverProps,
  AutocompleteClearButton as HeroAutocompleteClearButton,
  AutocompleteFilter as HeroAutocompleteFilter,
  AutocompleteIndicator as HeroAutocompleteIndicator,
  AutocompletePopover as HeroAutocompletePopover,
  AutocompleteRoot as HeroAutocompleteRoot,
  AutocompleteTrigger as HeroAutocompleteTrigger,
  AutocompleteValue as HeroAutocompleteValue,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Popover ───────────────────────────────────────────────────────────

function ThemedAutocompletePopover({
  children,
  style,
  ...props
}: AutocompletePopoverProps) {
  return (
    <HeroAutocompletePopover
      {...props}
      style={{
        borderRadius: "var(--vita-autocomplete-popover-radius, 0px)",
        borderTopWidth: "var(--vita-autocomplete-popover-border-top, 1px)",
        borderRightWidth: "var(--vita-autocomplete-popover-border-right, 1px)",
        borderBottomWidth:
          "var(--vita-autocomplete-popover-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-autocomplete-popover-border-left, 1px)",
        borderStyle: "var(--vita-autocomplete-popover-border-style, solid)",
        boxShadow: "var(--vita-autocomplete-popover-shadow, none)",
        padding: "var(--vita-autocomplete-popover-padding, 4px)",
        maxHeight: "var(--vita-autocomplete-max-height, 256px)",
        ...style,
      }}
    >
      {children}
    </HeroAutocompletePopover>
  );
}

// ── Pass-through sub-components ──────────────────────────────────────────────

const ThemedAutocompleteRoot = HeroAutocompleteRoot;
const ThemedAutocompleteTrigger = HeroAutocompleteTrigger;
const ThemedAutocompleteValue = HeroAutocompleteValue;
const ThemedAutocompleteIndicator = HeroAutocompleteIndicator;
const ThemedAutocompleteFilter = HeroAutocompleteFilter;
const ThemedAutocompleteClearButton = HeroAutocompleteClearButton;

// ── Compound Export ──────────────────────────────────────────────────────────

export const AutocompleteRoot = ThemedAutocompleteRoot;
export const AutocompleteTrigger = ThemedAutocompleteTrigger;
export const AutocompleteValue = ThemedAutocompleteValue;
export const AutocompleteIndicator = ThemedAutocompleteIndicator;
export const AutocompletePopover = ThemedAutocompletePopover;
export const AutocompleteFilter = ThemedAutocompleteFilter;
export const AutocompleteClearButton = ThemedAutocompleteClearButton;

export const Autocomplete = Object.assign(ThemedAutocompleteRoot, {
  Root: ThemedAutocompleteRoot,
  Trigger: ThemedAutocompleteTrigger,
  Value: ThemedAutocompleteValue,
  Indicator: ThemedAutocompleteIndicator,
  Popover: ThemedAutocompletePopover,
  Filter: ThemedAutocompleteFilter,
  ClearButton: ThemedAutocompleteClearButton,
});
