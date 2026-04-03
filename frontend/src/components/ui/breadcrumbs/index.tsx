/**
 * Breadcrumbs — Vita ERP breadcrumbs built on React Aria.
 *
 * Accessible breadcrumb navigation with proper ARIA landmarks.
 * All visual properties driven by --vita-breadcrumbs-* CSS custom properties.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Breadcrumb as AriaBreadcrumb,
  type BreadcrumbProps as AriaBreadcrumbProps,
  Breadcrumbs as AriaBreadcrumbs,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
  Link as AriaLink,
} from "react-aria-components";

import { useThemeStore } from "@/stores/theme";

// ── Breadcrumbs Root ────────────────────────────────────────────────────────

export interface BreadcrumbsRootProps<T extends object = object>
  extends Omit<AriaBreadcrumbsProps<T>, "className" | "style"> {
  /** Custom separator element rendered between items via CSS */
  separator?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function BreadcrumbsRootInner<T extends object = object>(
  {
    separator: _separator,
    className,
    style,
    children,
    ...ariaProps
  }: BreadcrumbsRootProps<T>,
  ref: ForwardedRef<HTMLOListElement>,
) {
  const underlineMode = useThemeStore(
    (s) => s.tokens.breadcrumbsUnderline ?? "none",
  );

  return (
    <AriaBreadcrumbs<T>
      {...ariaProps}
      ref={ref}
      data-slot="breadcrumbs"
      data-underline={underlineMode}
      className={["vita-breadcrumbs", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--vita-breadcrumbs-gap, 8px)",
        flexWrap: "wrap",
        listStyle: "none",
        padding: 0,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </AriaBreadcrumbs>
  );
}

const BreadcrumbsRootWithRef = forwardRef(BreadcrumbsRootInner) as <
  T extends object = object,
>(
  props: BreadcrumbsRootProps<T> & { ref?: ForwardedRef<HTMLOListElement> },
) => ReturnType<typeof BreadcrumbsRootInner>;

export { BreadcrumbsRootWithRef as BreadcrumbsRoot };

// ── Breadcrumbs Item ────────────────────────────────────────────────────────

export interface BreadcrumbsItemProps
  extends Omit<AriaBreadcrumbProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  href?: string;
}

function BreadcrumbsItemInner(
  { className, style, children, href, ...ariaProps }: BreadcrumbsItemProps,
  ref: ForwardedRef<HTMLLIElement>,
) {
  return (
    <AriaBreadcrumb
      {...ariaProps}
      ref={ref}
      data-slot="breadcrumbs-item"
      className={["vita-breadcrumbs-item", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "var(--vita-breadcrumbs-font-size, 14px)",
        fontWeight: "var(--vita-breadcrumbs-font-weight, 400)",
        letterSpacing: "var(--vita-breadcrumbs-letter-spacing, 0em)",
        textTransform:
          "var(--vita-breadcrumbs-text-transform, none)" as CSSProperties["textTransform"],
        paddingInline: "var(--vita-breadcrumbs-item-padding-x, 0px)",
        paddingBlock: "var(--vita-breadcrumbs-item-padding-y, 0px)",
        borderRadius: "var(--vita-breadcrumbs-item-radius, 0px)",
        borderWidth: "var(--vita-breadcrumbs-item-border-width, 0px)",
        borderStyle:
          "var(--vita-breadcrumbs-item-border-style, solid)" as CSSProperties["borderStyle"],
        color: "var(--vita-text-secondary)",
        ...style,
      }}
    >
      {href ? (
        <AriaLink
          href={href}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {children}
        </AriaLink>
      ) : (
        children
      )}
    </AriaBreadcrumb>
  );
}

export const BreadcrumbsItem = forwardRef(BreadcrumbsItemInner);
BreadcrumbsItem.displayName = "BreadcrumbsItem";

// ── Compound Export ─────────────────────────────────────────────────────────

export const Breadcrumbs = Object.assign(BreadcrumbsRootWithRef, {
  Root: BreadcrumbsRootWithRef,
  Item: BreadcrumbsItem,
});
