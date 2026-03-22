/**
 * Button — Vita ERP wrapper for HeroUI Button.
 *
 * Applies theme tokens as inline styles on the root Button element
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize button appearance.
 *
 * Available variants: primary | secondary | tertiary | ghost | outline | danger | danger-soft
 * Available sizes:    sm | md | lg
 */

"use client";

import {
  type ButtonRootProps,
  ButtonRoot as HeroButtonRoot,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedButtonRoot({ children, style, ...props }: ButtonRootProps) {
  return (
    <HeroButtonRoot
      {...props}
      style={{
        borderRadius: "var(--vita-btn-radius, 0px)",
        borderTopWidth: "var(--vita-btn-border-top, 1px)",
        borderRightWidth: "var(--vita-btn-border-right, 1px)",
        borderBottomWidth: "var(--vita-btn-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-btn-border-left, 1px)",
        borderStyle: "var(--vita-btn-border-style, solid)",
        fontWeight: "var(--vita-btn-font-weight, 500)",
        letterSpacing: "var(--vita-btn-letter-spacing, 0.02em)",
        textTransform:
          "var(--vita-btn-text-transform, none)" as React.CSSProperties["textTransform"],
        boxShadow: "var(--vita-btn-shadow, none)",
        transitionProperty:
          "color, background-color, border-color, box-shadow, transform, filter, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-btn-transition-duration, 150ms)",
        transform:
          "perspective(800px) rotateX(var(--vita-btn-rotate-x, 0deg)) rotateY(var(--vita-btn-rotate-y, 0deg)) rotateZ(var(--vita-btn-rotate-z, 0deg))",
        ...style,
      }}
    >
      {children}
    </HeroButtonRoot>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const ButtonRoot = ThemedButtonRoot;

export const Button = Object.assign(ThemedButtonRoot, {
  Root: ThemedButtonRoot,
});
