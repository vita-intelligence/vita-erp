/**
 * Breadcrumbs — Vita ERP wrapper for HeroUI Breadcrumbs.
 *
 * Applies theme tokens as inline styles on each sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize breadcrumbs appearance.
 *
 * Note: underline modes (none / underline / hover) remain in CSS
 * because they require pseudo-class selectors (:hover) that can't be inlined.
 */

"use client";

import {
  type BreadcrumbsRootProps,
  BreadcrumbsItem as HeroBreadcrumbsItem,
  BreadcrumbsRoot as HeroBreadcrumbsRoot,
} from "@heroui/react";
import type { ComponentProps } from "react";

import { useThemeStore } from "@/stores/theme";

type BreadcrumbsItemAllProps = ComponentProps<typeof HeroBreadcrumbsItem>;

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedBreadcrumbsRoot({
  children,
  style,
  ...props
}: BreadcrumbsRootProps) {
  const underlineMode = useThemeStore(
    (s) => s.tokens.breadcrumbsUnderline ?? "none",
  );

  return (
    <HeroBreadcrumbsRoot
      {...props}
      data-underline={underlineMode}
      style={{
        gap: "var(--vita-breadcrumbs-gap, 8px)",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {children}
    </HeroBreadcrumbsRoot>
  );
}

// ── Themed Item ──────────────────────────────────────────────────────────────

function ThemedBreadcrumbsItem({
  children,
  style,
  ...props
}: BreadcrumbsItemAllProps) {
  return (
    <HeroBreadcrumbsItem
      {...props}
      style={{
        fontSize: "var(--vita-breadcrumbs-font-size, 14px)",
        fontWeight: "var(--vita-breadcrumbs-font-weight, 400)",
        letterSpacing: "var(--vita-breadcrumbs-letter-spacing, 0em)",
        textTransform:
          "var(--vita-breadcrumbs-text-transform, none)" as React.CSSProperties["textTransform"],
        paddingLeft: "var(--vita-breadcrumbs-item-padding-x, 0px)",
        paddingRight: "var(--vita-breadcrumbs-item-padding-x, 0px)",
        paddingTop: "var(--vita-breadcrumbs-item-padding-y, 0px)",
        paddingBottom: "var(--vita-breadcrumbs-item-padding-y, 0px)",
        borderRadius: "var(--vita-breadcrumbs-item-radius, 0px)",
        borderWidth: "var(--vita-breadcrumbs-item-border-width, 0px)",
        borderStyle: "var(--vita-breadcrumbs-item-border-style, solid)",
        ...style,
      }}
    >
      {children}
    </HeroBreadcrumbsItem>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const BreadcrumbsRoot = ThemedBreadcrumbsRoot;
export const BreadcrumbsItem = ThemedBreadcrumbsItem;

export const Breadcrumbs = Object.assign(ThemedBreadcrumbsRoot, {
  Root: ThemedBreadcrumbsRoot,
  Item: ThemedBreadcrumbsItem,
});
