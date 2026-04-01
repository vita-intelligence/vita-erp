/**
 * Toast — Vita ERP wrapper for HeroUI Toast.
 *
 * Applies theme tokens as inline styles on each sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize toast appearance.
 *
 * Sub-components: Toast.Provider, Toast (root), Toast.Indicator,
 * Toast.Content, Toast.Title, Toast.Description, Toast.ActionButton,
 * Toast.CloseButton.
 */

"use client";

import {
  Toast as HeroToast,
  ToastActionButton as HeroToastActionButton,
  ToastCloseButton as HeroToastCloseButton,
  ToastContent as HeroToastContent,
  ToastDescription as HeroToastDescription,
  ToastIndicator as HeroToastIndicator,
  ToastProvider as HeroToastProvider,
  ToastTitle as HeroToastTitle,
} from "@heroui/react";

export type { ToastVariants } from "@heroui/react";
// Re-export toast function and types
export { ToastQueue, toast, toastQueue, toastVariants } from "@heroui/react";

// ── Themed Provider ─────────────────────────────────────────────────────────

function ThemedProvider({
  style,
  ...props
}: React.ComponentProps<typeof HeroToastProvider>) {
  return (
    <HeroToastProvider
      {...props}
      style={{
        gap: "var(--vita-toast-gap, 8px)",
        minWidth: "var(--vita-toast-min-width, 320px)",
        maxWidth: "var(--vita-toast-max-width, 420px)",
        ...style,
      }}
    />
  );
}

// ── Themed Root ─────────────────────────────────────────────────────────────

function ThemedRoot({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroToast>) {
  return (
    <HeroToast
      {...props}
      style={{
        borderRadius: "var(--vita-toast-radius, 12px)",
        borderWidth: "var(--vita-toast-border-width, 1px)",
        borderStyle: "var(--vita-toast-border-style, solid)",
        paddingLeft: "var(--vita-toast-padding-x, 16px)",
        paddingRight: "var(--vita-toast-padding-x, 16px)",
        paddingTop: "var(--vita-toast-padding-y, 12px)",
        paddingBottom: "var(--vita-toast-padding-y, 12px)",
        boxShadow: "var(--vita-toast-shadow, none)",
        ...style,
      }}
    >
      {children}
    </HeroToast>
  );
}

// ── Themed Indicator ────────────────────────────────────────────────────────

function ThemedIndicator({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroToastIndicator>) {
  return (
    <HeroToastIndicator
      {...props}
      style={{
        width: "var(--vita-toast-icon-size, 20px)",
        height: "var(--vita-toast-icon-size, 20px)",
        ...style,
      }}
    >
      {children}
    </HeroToastIndicator>
  );
}

// ── Themed Content ──────────────────────────────────────────────────────────

function ThemedContent({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroToastContent>) {
  return (
    <HeroToastContent
      {...props}
      style={{
        gap: "var(--vita-toast-content-gap, 4px)",
        ...style,
      }}
    >
      {children}
    </HeroToastContent>
  );
}

// ── Themed Title ────────────────────────────────────────────────────────────

function ThemedTitle({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroToastTitle>) {
  return (
    <HeroToastTitle
      {...props}
      style={{
        fontWeight: "var(--vita-toast-title-font-weight, 600)",
        fontSize: "var(--vita-toast-title-font-size, 14px)",
        ...style,
      }}
    >
      {children}
    </HeroToastTitle>
  );
}

// ── Themed Description ──────────────────────────────────────────────────────

function ThemedDescription({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroToastDescription>) {
  return (
    <HeroToastDescription
      {...props}
      style={{
        fontSize: "var(--vita-toast-description-font-size, 13px)",
        opacity: "var(--vita-toast-description-opacity, 0.7)",
        ...style,
      }}
    >
      {children}
    </HeroToastDescription>
  );
}

// ── Themed ActionButton ─────────────────────────────────────────────────────

function ThemedActionButton({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroToastActionButton>) {
  return (
    <HeroToastActionButton
      {...props}
      style={{
        borderRadius: "var(--vita-toast-action-radius, 6px)",
        fontSize: "var(--vita-toast-action-font-size, 13px)",
        fontWeight: "var(--vita-toast-action-font-weight, 500)",
        paddingLeft: "var(--vita-toast-action-padding-x, 10px)",
        paddingRight: "var(--vita-toast-action-padding-x, 10px)",
        paddingTop: "var(--vita-toast-action-padding-y, 4px)",
        paddingBottom: "var(--vita-toast-action-padding-y, 4px)",
        ...style,
      }}
    >
      {children}
    </HeroToastActionButton>
  );
}

// ── Themed CloseButton ──────────────────────────────────────────────────────

function ThemedCloseButton({
  style,
  ...props
}: React.ComponentProps<typeof HeroToastCloseButton>) {
  return (
    <HeroToastCloseButton
      {...props}
      style={{
        width: "var(--vita-toast-close-size, 28px)",
        height: "var(--vita-toast-close-size, 28px)",
        borderRadius: "var(--vita-toast-close-radius, 6px)",
        opacity: "var(--vita-toast-close-opacity, 0.5)",
        ...style,
      }}
    />
  );
}

// ── Named Exports ───────────────────────────────────────────────────────────

export { ThemedProvider as ToastProvider };
export { ThemedRoot as ToastRoot };
export { ThemedIndicator as ToastIndicator };
export { ThemedContent as ToastContent };
export { ThemedTitle as ToastTitle };
export { ThemedDescription as ToastDescription };
export { ThemedActionButton as ToastActionButton };
export { ThemedCloseButton as ToastCloseButton };

// ── Compound Export ─────────────────────────────────────────────────────────

export const Toast = Object.assign(ThemedRoot, {
  Provider: ThemedProvider,
  Root: ThemedRoot,
  Indicator: ThemedIndicator,
  Content: ThemedContent,
  Title: ThemedTitle,
  Description: ThemedDescription,
  ActionButton: ThemedActionButton,
  CloseButton: ThemedCloseButton,
});
