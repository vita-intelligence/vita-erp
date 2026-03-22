/**
 * Spinner — Vita ERP wrapper for HeroUI Spinner.
 *
 * Size is resolved from the `size` prop to the matching CSS variable.
 * 3D rotation is applied on a WRAPPER div (not the spinner itself)
 * to avoid conflicting with HeroUI's spin animation transform.
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
    <div
      style={{
        display: "inline-flex",
        transform: [
          "perspective(800px)",
          "rotateX(var(--vita-spinner-rotate-x, 0deg))",
          "rotateY(var(--vita-spinner-rotate-y, 0deg))",
          "rotateZ(var(--vita-spinner-rotate-z, 0deg))",
        ].join(" "),
      }}
    >
      <HeroSpinner
        {...props}
        size={size}
        style={{
          width: sizeToken,
          height: sizeToken,
          ...style,
        }}
      />
    </div>
  );
}

// ── Named Exports ────────────────────────────────────────────────────────────

export { ThemedRoot as SpinnerRoot };

export const Spinner = Object.assign(ThemedRoot, {
  Root: ThemedRoot,
});
