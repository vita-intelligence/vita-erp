/**
 * Drawer — Vita ERP slide-in panel built on React Aria Modal.
 *
 * Side-anchored overlay panel with backdrop, focus trap, and keyboard dismiss.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  type DialogTriggerProps as AriaDialogTriggerProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";

export type DrawerRootProps = AriaDialogTriggerProps;
export function DrawerRoot(props: DrawerRootProps) {
  return <AriaDialogTrigger {...props} />;
}

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerContentProps
  extends Omit<AriaDialogProps, "className" | "style"> {
  placement?: DrawerPlacement;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const PLACEMENT_STYLES: Record<DrawerPlacement, CSSProperties> = {
  right: {
    right: 0,
    top: 0,
    bottom: 0,
    width: "min(400px, 90vw)",
    height: "100%",
  },
  left: {
    left: 0,
    top: 0,
    bottom: 0,
    width: "min(400px, 90vw)",
    height: "100%",
  },
  top: { top: 0, left: 0, right: 0, height: "min(400px, 60vh)", width: "100%" },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: "min(400px, 60vh)",
    width: "100%",
  },
};

function DrawerContentInner(
  {
    placement = "right",
    className,
    style,
    children,
    ...ariaProps
  }: DrawerContentProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <AriaModalOverlay
      data-slot="drawer-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "oklch(0 0 0 / 0.4)",
      }}
    >
      <AriaModal
        data-slot="drawer-container"
        style={{ position: "fixed", ...PLACEMENT_STYLES[placement] }}
      >
        <AriaDialog
          {...ariaProps}
          ref={ref}
          data-slot="drawer"
          data-placement={placement}
          className={["vita-drawer", className].filter(Boolean).join(" ")}
          style={{
            outline: "none",
            height: "100%",
            backgroundColor: "var(--vita-surface)",
            borderColor: "var(--vita-neutral-200)",
            boxShadow: "0 8px 32px oklch(0 0 0 / 0.15)",
            overflow: "auto",
            ...style,
          }}
        >
          {children}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

export const DrawerContent = forwardRef(DrawerContentInner);
DrawerContent.displayName = "DrawerContent";

export const Drawer = Object.assign(DrawerRoot, {
  Root: DrawerRoot,
  Content: DrawerContent,
});
