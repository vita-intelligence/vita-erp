/**
 * Separator — Vita ERP divider built on React Aria.
 *
 * Accessible separator with proper ARIA role. Supports horizontal
 * and vertical orientations with theme-controlled thickness and radius.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";

// ── Types ───────────────────────────────────────────────────────────────────

export interface SeparatorRootProps
  extends Omit<AriaSeparatorProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

// ── Component ───────────────────────────────────────────────────────────────

function SeparatorRootInner(
  { className, style, orientation, ...ariaProps }: SeparatorRootProps,
  ref: ForwardedRef<HTMLHRElement>,
) {
  const resolvedOrientation = orientation ?? "horizontal";
  const isHorizontal = resolvedOrientation === "horizontal";

  return (
    <AriaSeparator
      {...ariaProps}
      ref={ref}
      orientation={resolvedOrientation}
      data-slot="separator"
      className={["vita-separator", className].filter(Boolean).join(" ")}
      style={{
        border: "none",
        margin: 0,
        flexShrink: 0,
        backgroundColor: "var(--vita-neutral-200)",
        borderRadius: "var(--vita-separator-radius, 0px)",
        ...(isHorizontal
          ? {
              width: "100%",
              height: "var(--vita-separator-thickness, 1px)",
            }
          : {
              alignSelf: "stretch",
              width: "var(--vita-separator-thickness, 1px)",
            }),
        ...style,
      }}
    />
  );
}

// ── Exports ─────────────────────────────────────────────────────────────────

export const SeparatorRoot = forwardRef(SeparatorRootInner);
SeparatorRoot.displayName = "SeparatorRoot";

export const Separator = Object.assign(forwardRef(SeparatorRootInner), {
  Root: SeparatorRoot,
});
Separator.displayName = "Separator";
