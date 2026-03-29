/**
 * Modal — Vita ERP wrapper for HeroUI Modal compound component.
 *
 * Applies theme tokens as inline styles on the ModalDialog sub-component
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize modal appearance.
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
  ModalBackdrop as HeroModalBackdrop,
  ModalBody as HeroModalBody,
  ModalCloseTrigger as HeroModalCloseTrigger,
  ModalContainer as HeroModalContainer,
  ModalDialog as HeroModalDialog,
  ModalFooter as HeroModalFooter,
  ModalHeader as HeroModalHeader,
  ModalHeading as HeroModalHeading,
  ModalIcon as HeroModalIcon,
  ModalRoot as HeroModalRoot,
  ModalTrigger as HeroModalTrigger,
  type ModalDialogProps,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Dialog ────────────────────────────────────────────────────────────

function ThemedModalDialog({ children, style, ...props }: ModalDialogProps) {
  return (
    <HeroModalDialog
      {...props}
      style={{
        borderRadius: "var(--vita-modal-radius, 0px)",
        ...(style as React.CSSProperties),
      }}
    >
      {children}
    </HeroModalDialog>
  );
}

// ── Compound Exports ─────────────────────────────────────────────────────────

export const ModalRoot = HeroModalRoot;
export const ModalTrigger = HeroModalTrigger;
export const ModalBackdrop = HeroModalBackdrop;
export const ModalContainer = HeroModalContainer;
export const ModalDialog = ThemedModalDialog;
export const ModalHeader = HeroModalHeader;
export const ModalIcon = HeroModalIcon;
export const ModalHeading = HeroModalHeading;
export const ModalBody = HeroModalBody;
export const ModalFooter = HeroModalFooter;
export const ModalCloseTrigger = HeroModalCloseTrigger;

export const Modal = Object.assign(HeroModalRoot, {
  Root: HeroModalRoot,
  Trigger: HeroModalTrigger,
  Backdrop: HeroModalBackdrop,
  Container: HeroModalContainer,
  Dialog: ThemedModalDialog,
  Header: HeroModalHeader,
  Icon: HeroModalIcon,
  Heading: HeroModalHeading,
  Body: HeroModalBody,
  Footer: HeroModalFooter,
  CloseTrigger: HeroModalCloseTrigger,
});

// Re-export types explicitly for consumers
export type {
  ModalBackdropProps,
  ModalBodyProps,
  ModalCloseTriggerProps,
  ModalContainerProps,
  ModalDialogProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalHeadingProps,
  ModalIconProps,
  ModalProps,
  ModalRootProps,
  ModalTriggerProps,
} from "@heroui/react";
