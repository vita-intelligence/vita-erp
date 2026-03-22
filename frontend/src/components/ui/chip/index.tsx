/**
 * Chip (Badge) — Vita ERP wrapper for HeroUI Chip.
 *
 * Applies theme tokens as inline styles on the Root and Label
 * sub-components so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize badge/chip appearance.
 *
 * NOTE: The design-token prefix is `--vita-badge-*` because the theme editor
 * module is called "Badge", but the HeroUI component is `Chip`.
 */

"use client";

import {
  type ChipRootProps,
  Chip as HeroChip,
  ChipLabel as HeroChipLabel,
} from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type ChipLabelProps,
  type ChipProps,
  ChipRoot,
  type ChipRootProps,
  type ChipVariants,
  chipVariants,
} from "@heroui/react";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build the idle 3D transform string from CSS custom properties. */
const IDLE_TRANSFORM = [
  "perspective(800px)",
  "rotateX(var(--vita-badge-rotate-x, 0deg))",
  "rotateY(var(--vita-badge-rotate-y, 0deg))",
  "rotateZ(var(--vita-badge-rotate-z, 0deg))",
].join(" ");

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedLabel({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroChipLabel>) {
  return (
    <HeroChipLabel
      {...props}
      style={{
        ...style,
      }}
    >
      {children}
    </HeroChipLabel>
  );
}

// ── Main Chip Component ──────────────────────────────────────────────────────

function ChipRoot({ children, style, ...props }: ChipRootProps) {
  return (
    <HeroChip
      {...props}
      style={{
        borderRadius: "var(--vita-badge-radius, 0px)",
        borderTopWidth: "var(--vita-badge-border-top, 1px)",
        borderRightWidth: "var(--vita-badge-border-right, 1px)",
        borderBottomWidth: "var(--vita-badge-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-badge-border-left, 1px)",
        borderStyle:
          "var(--vita-badge-border-style, solid)" as React.CSSProperties["borderStyle"],
        paddingLeft: "var(--vita-badge-padding-x, 0.55rem)",
        paddingRight: "var(--vita-badge-padding-x, 0.55rem)",
        paddingTop: "var(--vita-badge-padding-y, 0.2rem)",
        paddingBottom: "var(--vita-badge-padding-y, 0.2rem)",
        fontWeight: "var(--vita-badge-font-weight, 600)",
        fontSize: "var(--vita-badge-font-size, 0.6875rem)",
        letterSpacing: "var(--vita-badge-letter-spacing, 0em)",
        textTransform:
          "var(--vita-badge-text-transform, none)" as React.CSSProperties["textTransform"],
        transitionProperty: "transform, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-badge-transition-duration, 150ms)",
        transform: IDLE_TRANSFORM,
        ...style,
      }}
    >
      {children}
    </HeroChip>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const Chip = Object.assign(ChipRoot, {
  Label: ThemedLabel,
});
