/**
 * Spinner — Vita ERP wrapper for HeroUI Spinner.
 *
 * Applies theme tokens as inline styles on the Root component.
 * Size is resolved from the `size` prop to the matching CSS variable.
 * 3D rotation is applied as a static perspective transform.
 */

"use client";

import { Spinner as HeroSpinner, type SpinnerRootProps } from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type SpinnerProps,
  type SpinnerRootProps,
  type SpinnerVariants,
  spinnerVariants,
} from "@heroui/react";

// ── Size token map ───────────────────────────────────────────────────────────

const sizeTokenMap: Record<string, string> = {
  sm: "var(--vita-spinner-size-sm, 20px)",
  md: "var(--vita-spinner-size-md, 32px)",
  lg: "var(--vita-spinner-size-lg, 48px)",
};

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedRoot({
  style,
  size = "md",
  ...props
}: SpinnerRootProps & { style?: React.CSSProperties }) {
  const sizeToken = sizeTokenMap[size ?? "md"] ?? sizeTokenMap.md;

  return (
    <HeroSpinner
      {...props}
      size={size}
      style={{
        width: sizeToken,
        height: sizeToken,
        ...style,
      }}
    />
  );
}

// ── Named Exports (for direct imports) ───────────────────────────────────────

export { ThemedRoot as SpinnerRoot };

// ── Compound Export ──────────────────────────────────────────────────────────

export const Spinner = Object.assign(ThemedRoot, {
  Root: ThemedRoot,
});
