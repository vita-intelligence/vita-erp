/**
 * Spinner — Vita ERP loading indicator.
 *
 * Accessible via role="status" and aria-label.
 * Size is resolved from the `size` prop to matching CSS variables.
 * 3D rotation is applied on a wrapper to avoid conflicting with spin animation.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";

// ── Types ───────────────────────────────────────────────────────────────────

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerRootProps {
  size?: SpinnerSize;
  className?: string;
  style?: CSSProperties;
  /** Accessible label for screen readers */
  "aria-label"?: string;
}

// ── Size token map ──────────────────────────────────────────────────────────

const SIZE_TOKEN_MAP: Record<SpinnerSize, string> = {
  sm: "var(--vita-spinner-size-sm, 20px)",
  md: "var(--vita-spinner-size-md, 32px)",
  lg: "var(--vita-spinner-size-lg, 48px)",
};

// ── Component ───────────────────────────────────────────────────────────────

function SpinnerRootInner(
  {
    size = "md",
    className,
    style,
    "aria-label": ariaLabel = "Loading",
  }: SpinnerRootProps,
  ref: ForwardedRef<HTMLOutputElement>,
) {
  const sizeToken = SIZE_TOKEN_MAP[size];

  return (
    <output
      ref={ref}
      aria-label={ariaLabel}
      data-slot="spinner"
      data-size={size}
      className={["vita-spinner", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        transform: [
          "perspective(800px)",
          "rotateX(var(--vita-spinner-rotate-x, 0deg))",
          "rotateY(var(--vita-spinner-rotate-y, 0deg))",
          "rotateZ(var(--vita-spinner-rotate-z, 0deg))",
        ].join(" "),
        ...style,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          width: sizeToken,
          height: sizeToken,
          animation: "vita-spin 0.8s linear infinite",
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            opacity: 0.2,
          }}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            color: "var(--vita-primary)",
          }}
        />
      </svg>
    </output>
  );
}

// ── Exports ─────────────────────────────────────────────────────────────────

export const SpinnerRoot = forwardRef(SpinnerRootInner);
SpinnerRoot.displayName = "SpinnerRoot";

export const Spinner = Object.assign(forwardRef(SpinnerRootInner), {
  Root: SpinnerRoot,
});
Spinner.displayName = "Spinner";
