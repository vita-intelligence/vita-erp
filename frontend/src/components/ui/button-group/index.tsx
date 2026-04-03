/**
 * ButtonGroup — Vita ERP button group container.
 *
 * Groups related buttons with configurable gap, border, and shadow.
 * All visual properties driven by --vita-button-group-* CSS custom properties.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
} from "react-aria-components";

// ── ButtonGroup Root ────────────────────────────────────────────────────────

export interface ButtonGroupRootProps
  extends Omit<AriaGroupProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ButtonGroupRootInner(
  { className, style, children, ...ariaProps }: ButtonGroupRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaGroup
      {...ariaProps}
      ref={ref}
      data-slot="button-group"
      className={["vita-button-group", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderTopWidth: "var(--vita-button-group-border-top, 0px)",
        borderRightWidth: "var(--vita-button-group-border-right, 0px)",
        borderBottomWidth: "var(--vita-button-group-border-bottom, 0px)",
        borderLeftWidth: "var(--vita-button-group-border-left, 0px)",
        borderStyle:
          "var(--vita-button-group-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-neutral-200)",
        boxShadow: "var(--vita-button-group-shadow, none)",
        gap: "var(--vita-button-group-gap, 0px)",
        ...style,
      }}
    >
      {children}
    </AriaGroup>
  );
}

// ── Separator ───────────────────────────────────────────────────────────────

export interface ButtonGroupSeparatorProps {
  className?: string;
  style?: CSSProperties;
}

export function ButtonGroupSeparator({
  className,
  style,
}: ButtonGroupSeparatorProps) {
  return (
    <span
      data-slot="button-group-separator"
      className={className}
      style={{
        width: "1px",
        alignSelf: "stretch",
        backgroundColor: "var(--vita-neutral-200)",
        ...style,
      }}
    />
  );
}

// ── Exports ─────────────────────────────────────────────────────────────────

export const ButtonGroupRoot = forwardRef(ButtonGroupRootInner);
ButtonGroupRoot.displayName = "ButtonGroupRoot";

export const ButtonGroup = Object.assign(forwardRef(ButtonGroupRootInner), {
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator,
});
ButtonGroup.displayName = "ButtonGroup";
