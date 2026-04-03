/**
 * Link — Vita ERP link built on React Aria.
 *
 * Accessible link with focus management and keyboard support.
 */

"use client";

import { type CSSProperties, type ForwardedRef, forwardRef } from "react";
import {
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";

export interface LinkProps extends Omit<AriaLinkProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function LinkInner(
  { className, style, children, ...ariaProps }: LinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <AriaLink
      {...ariaProps}
      ref={ref}
      data-slot="link"
      className={["vita-link", className].filter(Boolean).join(" ")}
      style={{
        color: "var(--vita-primary)",
        textDecoration: "none",
        cursor: "pointer",
        outline: "none",
        ...style,
      }}
    >
      {children}
    </AriaLink>
  );
}

export const Link = forwardRef(LinkInner);
Link.displayName = "Link";
