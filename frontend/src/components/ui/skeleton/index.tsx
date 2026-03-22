/**
 * Skeleton — Vita ERP wrapper for HeroUI Skeleton.
 *
 * Applies theme tokens as inline styles on the root Skeleton element
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize skeleton appearance.
 *
 * Pseudo-class tokens (animation-duration for pulse/shimmer) remain in CSS
 * because they target ::after and animation states not reachable via inline styles.
 */

"use client";

import {
  SkeletonRoot as HeroSkeletonRoot,
  type SkeletonRootProps,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedSkeletonRoot({ style, ...props }: SkeletonRootProps) {
  return (
    <HeroSkeletonRoot
      {...props}
      style={{
        borderRadius: "var(--vita-skeleton-radius, 8px)",
        backgroundColor:
          "var(--vita-skeleton-base-color, var(--vita-neutral-200))",
        ...style,
      }}
    />
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const SkeletonRoot = ThemedSkeletonRoot;

export const Skeleton = Object.assign(ThemedSkeletonRoot, {
  Root: ThemedSkeletonRoot,
});
