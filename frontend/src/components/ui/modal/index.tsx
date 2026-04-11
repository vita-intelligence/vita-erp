/**
 * Modal — Vita ERP modal dialog built on React Aria.
 *
 * Accessible modal overlay with focus trap, keyboard dismiss (Escape),
 * and screen reader support.
 *
 * Compound usage:
 *   <Modal>
 *     <Modal.Trigger>Open</Modal.Trigger>
 *     <Modal.Backdrop />
 *     <Modal.Container>
 *       <Modal.Dialog>
 *         <Modal.Header><Modal.Heading>Title</Modal.Heading></Modal.Header>
 *         <Modal.Body>...</Modal.Body>
 *         <Modal.Footer>...</Modal.Footer>
 *       </Modal.Dialog>
 *     </Modal.Container>
 *   </Modal>
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

// ── Modal Root (DialogTrigger) ──────────────────────────────────────────────

export type ModalRootProps = AriaDialogTriggerProps;
export function ModalRoot(props: ModalRootProps) {
  return <AriaDialogTrigger {...props} />;
}

// ── Modal Trigger ───────────────────────────────────────────────────────────

export interface ModalTriggerProps
  extends Omit<AriaButtonProps, "className" | "style" | "children"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ModalTriggerInner(
  { children, ...props }: ModalTriggerProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <AriaButton {...props} ref={ref}>
      {children}
    </AriaButton>
  );
}

export const ModalTrigger = forwardRef(ModalTriggerInner);
ModalTrigger.displayName = "ModalTrigger";

// ── Modal Backdrop ──────────────────────────────────────────────────────────

export interface ModalBackdropProps
  extends Omit<AriaModalOverlayProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function ModalBackdropInner(
  {
    className,
    style,
    children,
    shouldCloseOnInteractOutside,
    ...ariaProps
  }: ModalBackdropProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  // While the theme editor is floating on top of a dismissable modal, clicks
  // inside the editor (and any popovers it opens, which portal to body and
  // would otherwise not match the editor DOM subtree) must not dismiss the
  // modal behind it. A body-level flag is the simplest signal that covers
  // arbitrarily-nested overlays. Callers can still override this predicate.
  const defaultShouldClose = (element: Element) => {
    if (typeof document !== "undefined") {
      if (document.body.dataset.vitaThemeEditorOpen === "true") return false;
    }
    return !element.closest("[data-vita-theme-editor]");
  };

  return (
    <AriaModalOverlay
      {...ariaProps}
      shouldCloseOnInteractOutside={
        shouldCloseOnInteractOutside ?? defaultShouldClose
      }
      ref={ref}
      data-slot="modal-backdrop"
      className={["vita-modal-backdrop", className].filter(Boolean).join(" ")}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "var(--vita-alert-dialog-backdrop-color, oklch(0 0 0 / 0.4))",
        backdropFilter: "blur(var(--vita-alert-dialog-backdrop-blur, 0px))",
        ...style,
      }}
    >
      {children}
    </AriaModalOverlay>
  );
}

export const ModalBackdrop = forwardRef(ModalBackdropInner);
ModalBackdrop.displayName = "ModalBackdrop";

// ── Modal Container ─────────────────────────────────────────────────────────

export interface ModalContainerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function ModalContainer({
  className,
  style,
  children,
}: ModalContainerProps) {
  return (
    <AriaModal data-slot="modal-container" className={className} style={style}>
      {children}
    </AriaModal>
  );
}

// ── Modal Dialog ────────────────────────────────────────────────────────────

export interface ModalDialogProps
  extends Omit<AriaDialogProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ModalDialogInner(
  { className, style, children, ...ariaProps }: ModalDialogProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <AriaDialog
      {...ariaProps}
      ref={ref}
      data-slot="modal-dialog"
      className={["vita-modal-dialog", className].filter(Boolean).join(" ")}
      style={{
        outline: "none",
        backgroundColor: "var(--vita-surface)",
        borderRadius: "var(--vita-modal-radius, 12px)",
        boxShadow: "0 8px 32px oklch(0 0 0 / 0.12)",
        border: "1px solid var(--vita-neutral-200)",
        width: "min(520px, 92vw)",
        maxHeight: "85vh",
        overflow: "auto",
        ...style,
      }}
    >
      {children}
    </AriaDialog>
  );
}

export const ModalDialog = forwardRef(ModalDialogInner);
ModalDialog.displayName = "ModalDialog";

// ── Sub-components ──────────────────────────────────────────────────────────

type SlotProps = {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

function ModalHeaderInner(
  { className, style, children }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-slot="modal-header"
      className={className}
      style={{ padding: "20px 24px 0", ...style }}
    >
      {children}
    </div>
  );
}
export const ModalHeader = forwardRef(ModalHeaderInner);
ModalHeader.displayName = "ModalHeader";

export interface ModalHeadingProps
  extends Omit<AriaHeadingProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
function ModalHeadingInner(
  { className, style, children, ...ariaProps }: ModalHeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <AriaHeading
      {...ariaProps}
      ref={ref}
      data-slot="modal-heading"
      className={className}
      style={{ fontSize: "18px", fontWeight: 600, margin: 0, ...style }}
    >
      {children}
    </AriaHeading>
  );
}
export const ModalHeading = forwardRef(ModalHeadingInner);
ModalHeading.displayName = "ModalHeading";

function ModalBodyInner(
  { className, style, children }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-slot="modal-body"
      className={className}
      style={{ padding: "16px 24px", ...style }}
    >
      {children}
    </div>
  );
}
export const ModalBody = forwardRef(ModalBodyInner);
ModalBody.displayName = "ModalBody";

function ModalFooterInner(
  { className, style, children }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      data-slot="modal-footer"
      className={className}
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px",
        padding: "0 24px 20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
export const ModalFooter = forwardRef(ModalFooterInner);
ModalFooter.displayName = "ModalFooter";

export function ModalIcon({ children, style }: SlotProps) {
  return (
    <span data-slot="modal-icon" style={style}>
      {children}
    </span>
  );
}

export function ModalCloseTrigger({ children, style, className }: SlotProps) {
  return (
    <AriaButton
      slot="close"
      data-slot="modal-close"
      className={className}
      style={style}
    >
      {children}
    </AriaButton>
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const Modal = Object.assign(ModalRoot, {
  Root: ModalRoot,
  Trigger: ModalTrigger,
  Backdrop: ModalBackdrop,
  Container: ModalContainer,
  Dialog: ModalDialog,
  Header: ModalHeader,
  Icon: ModalIcon,
  Heading: ModalHeading,
  Body: ModalBody,
  Footer: ModalFooter,
  CloseTrigger: ModalCloseTrigger,
});
