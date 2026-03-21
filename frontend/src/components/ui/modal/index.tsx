/**
 * Modal — Vita ERP canonical import for HeroUI Modal (compound component).
 *
 * Styling tokens (radius) are applied globally via globals.css targeting
 * the `.modal__dialog` CSS class.
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

export * from "@heroui/react";
export {
  Modal,
  ModalBackdrop,
  type ModalBackdropProps,
  ModalBody,
  type ModalBodyProps,
  ModalCloseTrigger,
  type ModalCloseTriggerProps,
  ModalContainer,
  type ModalContainerProps,
  ModalDialog,
  type ModalDialogProps,
  ModalFooter,
  type ModalFooterProps,
  ModalHeader,
  type ModalHeaderProps,
  ModalHeading,
  type ModalHeadingProps,
  ModalIcon,
  type ModalIconProps,
  type ModalProps,
  ModalRoot,
  type ModalRootProps,
  ModalTrigger,
  type ModalTriggerProps,
} from "@heroui/react";
