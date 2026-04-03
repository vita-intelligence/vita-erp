/**
 * AlertDialog — Vita ERP confirmation dialog built on React Aria.
 *
 * Extends Modal with role="alertdialog" for destructive/confirmation actions.
 * All visual properties driven by --vita-alert-dialog-* CSS custom properties.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";

type SlotProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

// ── Root ────────────────────────────────────────────────────────────────────

export type AlertDialogRootProps = AriaDialogTriggerProps;
export function AlertDialogRoot(props: AlertDialogRootProps) {
  return <AriaDialogTrigger {...props} />;
}

// ── Trigger ─────────────────────────────────────────────────────────────────

export interface AlertDialogTriggerProps
  extends Omit<AriaButtonProps, "className" | "style" | "children"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
function AlertDialogTriggerInner(
  { children, ...props }: AlertDialogTriggerProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <AriaButton {...props} ref={ref}>
      {children}
    </AriaButton>
  );
}
export const AlertDialogTrigger = forwardRef(AlertDialogTriggerInner);
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// ── Backdrop ────────────────────────────────────────────────────────────────

export interface AlertDialogBackdropProps
  extends Omit<AriaModalOverlayProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}
function AlertDialogBackdropInner(
  { className, style, children, ...ariaProps }: AlertDialogBackdropProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaModalOverlay
      {...ariaProps}
      ref={ref}
      data-slot="alert-dialog-backdrop"
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "var(--vita-alert-dialog-backdrop-color, oklch(0 0 0 / 0.4))",
        opacity:
          "var(--vita-alert-dialog-backdrop-opacity, 1)" as unknown as number,
        backdropFilter: "blur(var(--vita-alert-dialog-backdrop-blur, 0px))",
        ...style,
      }}
    >
      {children}
    </AriaModalOverlay>
  );
}
export const AlertDialogBackdrop = forwardRef(AlertDialogBackdropInner);
AlertDialogBackdrop.displayName = "AlertDialogBackdrop";

// ── Container ───────────────────────────────────────────────────────────────

export function AlertDialogContainer({
  children,
  className,
  style,
}: SlotProps) {
  return (
    <AriaModal
      data-slot="alert-dialog-container"
      className={className}
      style={style}
    >
      {children}
    </AriaModal>
  );
}

// ── Dialog ──────────────────────────────────────────────────────────────────

export interface AlertDialogDialogProps
  extends Omit<AriaDialogProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
function AlertDialogDialogInner(
  { className, style, children, ...ariaProps }: AlertDialogDialogProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <AriaDialog
      {...ariaProps}
      ref={ref}
      role="alertdialog"
      data-slot="alert-dialog-dialog"
      className={["vita-alert-dialog", className].filter(Boolean).join(" ")}
      style={{
        outline: "none",
        backgroundColor: "var(--vita-surface)",
        borderRadius: "var(--vita-alert-dialog-radius, 12px)",
        boxShadow:
          "var(--vita-alert-dialog-shadow, 0 8px 32px oklch(0 0 0 / 0.12))",
        border: "1px solid var(--vita-neutral-200)",
        width: "min(440px, 92vw)",
        ...style,
      }}
    >
      {children}
    </AriaDialog>
  );
}
export const AlertDialogDialog = forwardRef(AlertDialogDialogInner);
AlertDialogDialog.displayName = "AlertDialogDialog";

// ── Sub-components ──────────────────────────────────────────────────────────

function AlertDialogHeaderInner(
  { className, style, children }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-header"
      className={className}
      style={{
        padding:
          "var(--vita-alert-dialog-padding-y, 20px) var(--vita-alert-dialog-padding-x, 24px) 0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export const AlertDialogHeader = forwardRef(AlertDialogHeaderInner);
AlertDialogHeader.displayName = "AlertDialogHeader";

export interface AlertDialogHeadingProps
  extends Omit<AriaHeadingProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
function AlertDialogHeadingInner(
  { className, style, children, ...ariaProps }: AlertDialogHeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <AriaHeading
      {...ariaProps}
      ref={ref}
      data-slot="alert-dialog-heading"
      className={className}
      style={{ fontSize: "16px", fontWeight: 600, margin: 0, ...style }}
    >
      {children}
    </AriaHeading>
  );
}
export const AlertDialogHeading = forwardRef(AlertDialogHeadingInner);
AlertDialogHeading.displayName = "AlertDialogHeading";

function AlertDialogBodyInner(
  { className, style, children }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-body"
      className={className}
      style={{
        padding: "12px var(--vita-alert-dialog-padding-x, 24px)",
        color: "var(--vita-text-secondary)",
        fontSize: "14px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export const AlertDialogBody = forwardRef(AlertDialogBodyInner);
AlertDialogBody.displayName = "AlertDialogBody";

function AlertDialogFooterInner(
  { className, style, children }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-slot="alert-dialog-footer"
      className={className}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        padding:
          "0 var(--vita-alert-dialog-padding-x, 24px) var(--vita-alert-dialog-padding-y, 20px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export const AlertDialogFooter = forwardRef(AlertDialogFooterInner);
AlertDialogFooter.displayName = "AlertDialogFooter";

export function AlertDialogIcon({ children, style }: SlotProps) {
  return (
    <span data-slot="alert-dialog-icon" style={style}>
      {children}
    </span>
  );
}
export function AlertDialogCloseTrigger({
  children,
  style,
  className,
}: SlotProps) {
  return (
    <AriaButton
      slot="close"
      data-slot="alert-dialog-close"
      className={className}
      style={style}
    >
      {children}
    </AriaButton>
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Backdrop: AlertDialogBackdrop,
  Container: AlertDialogContainer,
  Dialog: AlertDialogDialog,
  Header: AlertDialogHeader,
  Heading: AlertDialogHeading,
  Body: AlertDialogBody,
  Footer: AlertDialogFooter,
  Icon: AlertDialogIcon,
  CloseTrigger: AlertDialogCloseTrigger,
});
