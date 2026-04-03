/**
 * Skeleton — Vita ERP loading placeholder.
 *
 * Presentational component with pulse animation.
 * All visual properties driven by --vita-skeleton-* CSS custom properties.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";

export interface SkeletonRootProps {
  className?: string;
  style?: CSSProperties;
}

function SkeletonRootInner(
  { className, style }: SkeletonRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-slot="skeleton"
      className={["vita-skeleton", className].filter(Boolean).join(" ")}
      style={{
        borderRadius: "var(--vita-skeleton-radius, 8px)",
        backgroundColor:
          "var(--vita-skeleton-base-color, var(--vita-neutral-200))",
        ...style,
      }}
    />
  );
}

export const SkeletonRoot = forwardRef(SkeletonRootInner);
SkeletonRoot.displayName = "SkeletonRoot";

export const Skeleton = Object.assign(forwardRef(SkeletonRootInner), {
  Root: SkeletonRoot,
});
Skeleton.displayName = "Skeleton";
