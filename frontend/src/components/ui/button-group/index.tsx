/**
 * ButtonGroup — Vita ERP wrapper for HeroUI ButtonGroup.
 *
 * Applies theme tokens as inline styles on the root group element
 * so they override HeroUI's built-in Tailwind styles.
 * Individual button styling is handled by the button wrapper.
 * This is the single place to customize button-group appearance.
 */

"use client";

import {
  type ButtonGroupRootProps,
  ButtonGroupRoot as HeroButtonGroupRoot,
  ButtonGroupSeparator as HeroButtonGroupSeparator,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedButtonGroupRoot({
  children,
  style,
  ...props
}: ButtonGroupRootProps) {
  return (
    <HeroButtonGroupRoot
      {...props}
      style={{
        borderTopWidth: "var(--vita-button-group-border-top, 0px)",
        borderRightWidth: "var(--vita-button-group-border-right, 0px)",
        borderBottomWidth: "var(--vita-button-group-border-bottom, 0px)",
        borderLeftWidth: "var(--vita-button-group-border-left, 0px)",
        borderStyle: "var(--vita-button-group-border-style, solid)",
        boxShadow: "var(--vita-button-group-shadow, none)",
        gap: "var(--vita-button-group-gap, 0px)",
        ...style,
      }}
    >
      {children}
    </HeroButtonGroupRoot>
  );
}

// ── Pass-through sub-components ──────────────────────────────────────────────

const ThemedButtonGroupSeparator = HeroButtonGroupSeparator;

// ── Compound Export ──────────────────────────────────────────────────────────

export const ButtonGroupRoot = ThemedButtonGroupRoot;
export const ButtonGroupSeparator = ThemedButtonGroupSeparator;

export const ButtonGroup = Object.assign(ThemedButtonGroupRoot, {
  Root: ThemedButtonGroupRoot,
  Separator: ThemedButtonGroupSeparator,
});
