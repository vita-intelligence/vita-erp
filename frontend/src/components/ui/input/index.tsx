/**
 * Input — Vita ERP wrapper for HeroUI Input.
 *
 * Applies theme tokens as inline styles on the root Input element
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize input appearance.
 *
 * Tokens for the <input> element: radius, border, shadow, padding,
 * font-size, text-align, transition. Pseudo-class/element tokens
 * (placeholder opacity, focus ring, label) remain in CSS.
 */

"use client";

import { InputRoot as HeroInputRoot, type InputRootProps } from "@heroui/react";

// Re-export everything from HeroUI (Label, TextField, FieldError, types, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedInputRoot({ style, ...props }: InputRootProps) {
  return (
    <HeroInputRoot
      {...props}
      style={{
        width: "100%",
        borderRadius: "var(--vita-input-radius, 0px)",
        borderTopWidth: "var(--vita-input-border-top, 1px)",
        borderRightWidth: "var(--vita-input-border-right, 1px)",
        borderBottomWidth: "var(--vita-input-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-input-border-left, 1px)",
        borderStyle: "var(--vita-input-border-style, solid)",
        borderColor: "var(--vita-input-border-color)",
        boxShadow: "var(--vita-input-shadow, none)",
        paddingLeft: "var(--vita-input-padding-x, 12px)",
        paddingRight: "var(--vita-input-padding-x, 12px)",
        paddingTop: "var(--vita-input-padding-y, 8px)",
        paddingBottom: "var(--vita-input-padding-y, 8px)",
        fontSize: "var(--vita-input-font-size, 14px)",
        textAlign:
          "var(--vita-input-text-align, left)" as React.CSSProperties["textAlign"],
        transitionProperty:
          "border-color, box-shadow, outline, background-color",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-input-transition-duration, 150ms)",
        ...style,
      }}
    />
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const InputRoot = ThemedInputRoot;

export const Input = Object.assign(ThemedInputRoot, {
  Root: ThemedInputRoot,
});
