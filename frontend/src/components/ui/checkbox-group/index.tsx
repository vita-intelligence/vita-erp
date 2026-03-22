/**
 * CheckboxGroup — Vita ERP wrapper for HeroUI CheckboxGroup.
 *
 * Applies theme tokens as inline styles on the root CheckboxGroup element
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize checkbox-group appearance.
 */

"use client";

import {
  type CheckboxGroupProps,
  CheckboxGroup as HeroCheckboxGroup,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedCheckboxGroup({
  children,
  style,
  ...props
}: CheckboxGroupProps) {
  return (
    <HeroCheckboxGroup
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--vita-checkbox-group-radius, 0px)",
        paddingLeft: "var(--vita-checkbox-group-padding-x, 0px)",
        paddingRight: "var(--vita-checkbox-group-padding-x, 0px)",
        paddingTop: "var(--vita-checkbox-group-padding-y, 0px)",
        paddingBottom: "var(--vita-checkbox-group-padding-y, 0px)",
        borderWidth: "var(--vita-checkbox-group-border-width, 0px)",
        borderStyle:
          "var(--vita-checkbox-group-border-style, solid)" as React.CSSProperties["borderStyle"],
        boxShadow: "var(--vita-checkbox-group-shadow, none)",
        gap: "var(--vita-checkbox-group-label-gap, 8px)",
        ...style,
      }}
    >
      {children}
    </HeroCheckboxGroup>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const CheckboxGroup = ThemedCheckboxGroup;
