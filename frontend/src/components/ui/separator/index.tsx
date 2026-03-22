/**
 * Separator — Vita ERP wrapper for HeroUI Separator.
 *
 * Applies theme tokens as inline styles on the root Separator element
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize separator appearance.
 *
 * Orientation-specific thickness (height for horizontal, width for vertical)
 * is handled via inline styles based on the resolved orientation.
 */

"use client";

import {
  SeparatorRoot as HeroSeparatorRoot,
  type SeparatorRootProps,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedSeparatorRoot({
  style,
  orientation,
  ...props
}: SeparatorRootProps) {
  const resolvedOrientation = orientation ?? "horizontal";
  const isHorizontal = resolvedOrientation === "horizontal";

  return (
    <HeroSeparatorRoot
      orientation={resolvedOrientation}
      {...props}
      style={{
        borderRadius: "var(--vita-separator-radius, 0px)",
        ...(isHorizontal
          ? { height: "var(--vita-separator-thickness, 1px)" }
          : { width: "var(--vita-separator-thickness, 1px)" }),
        ...style,
      }}
    />
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const SeparatorRoot = ThemedSeparatorRoot;

export const Separator = Object.assign(ThemedSeparatorRoot, {
  Root: ThemedSeparatorRoot,
});
