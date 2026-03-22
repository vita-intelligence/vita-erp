/**
 * ComboBox — Vita ERP wrapper for HeroUI ComboBox compound component.
 *
 * Applies theme tokens as inline styles on each sub-component
 * (InputGroup, Trigger, Popover) so they override HeroUI's built-in
 * Tailwind styles.
 * This is the single place to customize combo-box appearance.
 *
 * Note: List-box items inside the portalled popover cannot be styled via
 * inline styles on the wrapper. Those rules remain in the CSS file.
 */

"use client";

import {
  type ComboBoxInputGroupProps,
  type ComboBoxPopoverProps,
  type ComboBoxRootProps,
  type ComboBoxTriggerProps,
  ComboBoxInputGroup as HeroComboBoxInputGroup,
  ComboBoxPopover as HeroComboBoxPopover,
  ComboBoxRoot as HeroComboBoxRoot,
  ComboBoxTrigger as HeroComboBoxTrigger,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed InputGroup ────────────────────────────────────────────────────────

function ThemedComboBoxInputGroup({
  children,
  style,
  ...props
}: ComboBoxInputGroupProps) {
  return (
    <HeroComboBoxInputGroup
      {...props}
      style={{
        borderRadius: "var(--vita-combo-box-trigger-radius, 0px)",
        ...style,
      }}
    >
      {children}
    </HeroComboBoxInputGroup>
  );
}

// ── Themed Trigger ───────────────────────────────────────────────────────────

function ThemedComboBoxTrigger({ children, ...props }: ComboBoxTriggerProps) {
  return (
    <HeroComboBoxTrigger
      {...props}
      style={{
        borderRadius: "var(--vita-combo-box-trigger-radius, 0px)",
        borderWidth: "var(--vita-combo-box-trigger-border-width, 1px)",
      }}
    >
      {children}
    </HeroComboBoxTrigger>
  );
}

// ── Themed Popover ───────────────────────────────────────────────────────────

function ThemedComboBoxPopover({ children, ...props }: ComboBoxPopoverProps) {
  return (
    <HeroComboBoxPopover
      {...props}
      style={{
        borderRadius: "var(--vita-combo-box-popover-radius, 0px)",
        boxShadow: "var(--vita-combo-box-popover-shadow, none)",
        padding: "var(--vita-combo-box-popover-padding, 4px)",
        borderWidth: "var(--vita-combo-box-popover-border-width, 1px)",
        borderStyle:
          "var(--vita-combo-box-popover-border-style, solid)" as React.CSSProperties["borderStyle"],
      }}
    >
      {children}
    </HeroComboBoxPopover>
  );
}

// ── Compound Exports ─────────────────────────────────────────────────────────

export const ComboBoxRoot = HeroComboBoxRoot;
export const ComboBoxInputGroup = ThemedComboBoxInputGroup;
export const ComboBoxTrigger = ThemedComboBoxTrigger;
export const ComboBoxPopover = ThemedComboBoxPopover;

export const ComboBox = Object.assign(HeroComboBoxRoot, {
  Root: HeroComboBoxRoot,
  InputGroup: ThemedComboBoxInputGroup,
  Trigger: ThemedComboBoxTrigger,
  Popover: ThemedComboBoxPopover,
});
