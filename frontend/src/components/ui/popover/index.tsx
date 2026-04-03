/**
 * Popover — Vita ERP popover built on React Aria.
 *
 * Accessible popover with focus trap, keyboard dismiss, and positioning.
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
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

export type PopoverTriggerProps = AriaDialogTriggerProps;
export function PopoverTrigger(props: PopoverTriggerProps) {
  return <AriaDialogTrigger {...props} />;
}

export interface PopoverProps
  extends Omit<AriaPopoverProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function PopoverInner(
  { className, style, children, ...ariaProps }: PopoverProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaPopover
      {...ariaProps}
      ref={ref}
      data-slot="popover"
      className={["vita-popover", className].filter(Boolean).join(" ")}
      style={{
        backgroundColor: "var(--vita-surface)",
        border: "1px solid var(--vita-neutral-200)",
        borderRadius: "8px",
        boxShadow: "0 4px 16px oklch(0 0 0 / 0.08)",
        padding: "8px",
        outline: "none",
        ...style,
      }}
    >
      {children}
    </AriaPopover>
  );
}

export const Popover = forwardRef(PopoverInner);
Popover.displayName = "Popover";

export interface PopoverDialogProps
  extends Omit<AriaDialogProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function PopoverDialogInner(
  { className, style, children, ...ariaProps }: PopoverDialogProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <AriaDialog
      {...ariaProps}
      ref={ref}
      className={className}
      style={{ outline: "none", ...style }}
    >
      {children}
    </AriaDialog>
  );
}

export const PopoverDialog = forwardRef(PopoverDialogInner);
PopoverDialog.displayName = "PopoverDialog";
