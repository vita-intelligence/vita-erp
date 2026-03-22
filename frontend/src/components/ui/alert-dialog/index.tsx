/**
 * AlertDialog — Vita ERP wrapper for HeroUI AlertDialog.
 *
 * Applies theme tokens as inline styles on each sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize alert-dialog appearance.
 */

"use client";

import {
  type AlertDialogBackdropProps,
  type AlertDialogBodyProps,
  type AlertDialogDialogProps,
  type AlertDialogFooterProps,
  type AlertDialogHeaderProps,
  type AlertDialogRootProps,
  AlertDialogBackdrop as HeroAlertDialogBackdrop,
  AlertDialogBody as HeroAlertDialogBody,
  AlertDialogCloseTrigger as HeroAlertDialogCloseTrigger,
  AlertDialogContainer as HeroAlertDialogContainer,
  AlertDialogDialog as HeroAlertDialogDialog,
  AlertDialogFooter as HeroAlertDialogFooter,
  AlertDialogHeader as HeroAlertDialogHeader,
  AlertDialogHeading as HeroAlertDialogHeading,
  AlertDialogIcon as HeroAlertDialogIcon,
  AlertDialogRoot as HeroAlertDialogRoot,
  AlertDialogTrigger as HeroAlertDialogTrigger,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Dialog (the visible panel) ────────────────────────────────────────

function ThemedAlertDialogDialog({
  children,
  style,
  ...props
}: AlertDialogDialogProps) {
  return (
    <HeroAlertDialogDialog
      {...props}
      style={{
        borderRadius: "var(--vita-alert-dialog-radius, 0px)",
        boxShadow: "var(--vita-alert-dialog-shadow, none)",
        ...style,
      }}
    >
      {children}
    </HeroAlertDialogDialog>
  );
}

// ── Themed Header ────────────────────────────────────────────────────────────

function ThemedAlertDialogHeader({
  children,
  style,
  ...props
}: AlertDialogHeaderProps) {
  return (
    <HeroAlertDialogHeader
      {...props}
      style={{
        paddingLeft: "var(--vita-alert-dialog-padding-x, 24px)",
        paddingRight: "var(--vita-alert-dialog-padding-x, 24px)",
        paddingTop: "var(--vita-alert-dialog-padding-y, 20px)",
        ...style,
      }}
    >
      {children}
    </HeroAlertDialogHeader>
  );
}

// ── Themed Body ──────────────────────────────────────────────────────────────

function ThemedAlertDialogBody({
  children,
  style,
  ...props
}: AlertDialogBodyProps) {
  return (
    <HeroAlertDialogBody
      {...props}
      style={{
        paddingLeft: "var(--vita-alert-dialog-padding-x, 24px)",
        paddingRight: "var(--vita-alert-dialog-padding-x, 24px)",
        ...style,
      }}
    >
      {children}
    </HeroAlertDialogBody>
  );
}

// ── Themed Footer ────────────────────────────────────────────────────────────

function ThemedAlertDialogFooter({
  children,
  style,
  ...props
}: AlertDialogFooterProps) {
  return (
    <HeroAlertDialogFooter
      {...props}
      style={{
        paddingLeft: "var(--vita-alert-dialog-padding-x, 24px)",
        paddingRight: "var(--vita-alert-dialog-padding-x, 24px)",
        paddingBottom: "var(--vita-alert-dialog-padding-y, 20px)",
        ...style,
      }}
    >
      {children}
    </HeroAlertDialogFooter>
  );
}

// ── Themed Backdrop ──────────────────────────────────────────────────────────

function ThemedAlertDialogBackdrop({
  children,
  style,
  ...props
}: AlertDialogBackdropProps) {
  return (
    <HeroAlertDialogBackdrop
      {...props}
      style={{
        background:
          "var(--vita-alert-dialog-backdrop-color, oklch(0 0 0 / 0.4))",
        opacity: "var(--vita-alert-dialog-backdrop-opacity, 1)",
        backdropFilter: "blur(var(--vita-alert-dialog-backdrop-blur, 0px))",
        ...style,
      }}
    >
      {children}
    </HeroAlertDialogBackdrop>
  );
}

// ── Pass-through sub-components ──────────────────────────────────────────────

const ThemedAlertDialogRoot = HeroAlertDialogRoot;
const ThemedAlertDialogTrigger = HeroAlertDialogTrigger;
const ThemedAlertDialogContainer = HeroAlertDialogContainer;
const ThemedAlertDialogHeading = HeroAlertDialogHeading;
const ThemedAlertDialogIcon = HeroAlertDialogIcon;
const ThemedAlertDialogCloseTrigger = HeroAlertDialogCloseTrigger;

// ── Compound Export ──────────────────────────────────────────────────────────

export const AlertDialogRoot = ThemedAlertDialogRoot;
export const AlertDialogTrigger = ThemedAlertDialogTrigger;
export const AlertDialogBackdrop = ThemedAlertDialogBackdrop;
export const AlertDialogContainer = ThemedAlertDialogContainer;
export const AlertDialogDialog = ThemedAlertDialogDialog;
export const AlertDialogHeader = ThemedAlertDialogHeader;
export const AlertDialogHeading = ThemedAlertDialogHeading;
export const AlertDialogBody = ThemedAlertDialogBody;
export const AlertDialogFooter = ThemedAlertDialogFooter;
export const AlertDialogIcon = ThemedAlertDialogIcon;
export const AlertDialogCloseTrigger = ThemedAlertDialogCloseTrigger;

export const AlertDialog = Object.assign(ThemedAlertDialogRoot, {
  Root: ThemedAlertDialogRoot,
  Trigger: ThemedAlertDialogTrigger,
  Backdrop: ThemedAlertDialogBackdrop,
  Container: ThemedAlertDialogContainer,
  Dialog: ThemedAlertDialogDialog,
  Header: ThemedAlertDialogHeader,
  Heading: ThemedAlertDialogHeading,
  Body: ThemedAlertDialogBody,
  Footer: ThemedAlertDialogFooter,
  Icon: ThemedAlertDialogIcon,
  CloseTrigger: ThemedAlertDialogCloseTrigger,
});
