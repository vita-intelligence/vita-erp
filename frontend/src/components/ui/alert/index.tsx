/**
 * Alert — Vita ERP wrapper for HeroUI Alert.
 *
 * Applies theme tokens as inline styles on each sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize alert appearance.
 */

"use client";

import {
  type AlertDescriptionProps,
  type AlertIndicatorProps,
  type AlertRootProps,
  type AlertTitleProps,
  AlertContent as HeroAlertContent,
  AlertDescription as HeroAlertDescription,
  AlertIndicator as HeroAlertIndicator,
  AlertRoot as HeroAlertRoot,
  AlertTitle as HeroAlertTitle,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedAlertRoot({ children, style, ...props }: AlertRootProps) {
  return (
    <HeroAlertRoot
      {...props}
      style={{
        borderRadius: "var(--vita-alert-radius, 0px)",
        borderWidth: "var(--vita-alert-border-width, 1px)",
        borderStyle: "var(--vita-alert-border-style, solid)",
        paddingLeft: "var(--vita-alert-padding-x, 16px)",
        paddingRight: "var(--vita-alert-padding-x, 16px)",
        paddingTop: "var(--vita-alert-padding-y, 12px)",
        paddingBottom: "var(--vita-alert-padding-y, 12px)",
        boxShadow: "var(--vita-alert-shadow, none)",
        ...style,
      }}
    >
      {children}
    </HeroAlertRoot>
  );
}

// ── Themed Indicator ─────────────────────────────────────────────────────────

function ThemedAlertIndicator({
  children,
  style,
  ...props
}: AlertIndicatorProps) {
  return (
    <HeroAlertIndicator
      {...props}
      style={{
        width: "var(--vita-alert-icon-size, 20px)",
        height: "var(--vita-alert-icon-size, 20px)",
        ...style,
      }}
    >
      {children}
    </HeroAlertIndicator>
  );
}

// ── Themed Title ─────────────────────────────────────────────────────────────

function ThemedAlertTitle({ children, style, ...props }: AlertTitleProps) {
  return (
    <HeroAlertTitle
      {...props}
      style={{
        fontWeight: "var(--vita-alert-title-font-weight, 600)",
        fontSize: "var(--vita-alert-title-font-size, 14px)",
        ...style,
      }}
    >
      {children}
    </HeroAlertTitle>
  );
}

// ── Themed Description ───────────────────────────────────────────────────────

function ThemedAlertDescription({
  children,
  style,
  ...props
}: AlertDescriptionProps) {
  return (
    <HeroAlertDescription
      {...props}
      style={{
        fontSize: "var(--vita-alert-description-font-size, 13px)",
        ...style,
      }}
    >
      {children}
    </HeroAlertDescription>
  );
}

// ── Pass-through Content ─────────────────────────────────────────────────────

const ThemedAlertContent = HeroAlertContent;

// ── Compound Export ──────────────────────────────────────────────────────────

export const AlertRoot = ThemedAlertRoot;
export const AlertIndicator = ThemedAlertIndicator;
export const AlertContent = ThemedAlertContent;
export const AlertTitle = ThemedAlertTitle;
export const AlertDescription = ThemedAlertDescription;

export const Alert = Object.assign(ThemedAlertRoot, {
  Root: ThemedAlertRoot,
  Indicator: ThemedAlertIndicator,
  Content: ThemedAlertContent,
  Title: ThemedAlertTitle,
  Description: ThemedAlertDescription,
});
