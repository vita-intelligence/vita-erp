/**
 * Menu — Vita ERP menu built on React Aria.
 *
 * Accessible dropdown menu with keyboard navigation,
 * typeahead, and screen reader support.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  Separator as AriaSeparator,
} from "react-aria-components";

export type MenuTriggerProps = AriaMenuTriggerProps;
export function MenuTrigger(props: MenuTriggerProps) {
  return <AriaMenuTrigger {...props} />;
}

export interface MenuProps<T extends object = object>
  extends Omit<AriaMenuProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function MenuInner<T extends object = object>(
  { className, style, children, ...ariaProps }: MenuProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaMenu<T>
      {...ariaProps}
      ref={ref}
      data-slot="menu"
      className={["vita-menu", className].filter(Boolean).join(" ")}
      style={{
        outline: "none",
        display: "flex",
        flexDirection: "column",
        gap: "1px",
        ...style,
      }}
    >
      {children}
    </AriaMenu>
  );
}

const MenuWithRef = forwardRef(MenuInner) as <T extends object = object>(
  props: MenuProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof MenuInner>;

export { MenuWithRef as Menu };

export interface MenuItemProps<T extends object = object>
  extends Omit<AriaMenuItemProps<T>, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function MenuItemInner<T extends object = object>(
  { className, style, children, ...ariaProps }: MenuItemProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaMenuItem<T>
      {...ariaProps}
      ref={ref}
      data-slot="menu-item"
      className={["vita-menu-item", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 8px",
        borderRadius: "4px",
        fontSize: "14px",
        cursor: "pointer",
        outline: "none",
        color: "var(--vita-text-primary)",
        ...style,
      }}
    >
      {children}
    </AriaMenuItem>
  );
}

export const MenuItem = forwardRef(MenuItemInner) as <
  T extends object = object,
>(
  props: MenuItemProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof MenuItemInner>;

export interface MenuPopoverProps
  extends Omit<AriaPopoverProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function MenuPopoverInner(
  { className, style, children, ...ariaProps }: MenuPopoverProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaPopover
      {...ariaProps}
      ref={ref}
      data-slot="menu-popover"
      className={["vita-menu-popover", className].filter(Boolean).join(" ")}
      style={{
        backgroundColor: "var(--vita-surface)",
        border: "1px solid var(--vita-neutral-200)",
        borderRadius: "8px",
        boxShadow: "0 4px 16px oklch(0 0 0 / 0.08)",
        padding: "4px",
        outline: "none",
        ...style,
      }}
    >
      {children}
    </AriaPopover>
  );
}

export const MenuPopover = forwardRef(MenuPopoverInner);
MenuPopover.displayName = "MenuPopover";

export function MenuSeparator({ style }: { style?: CSSProperties }) {
  return (
    <AriaSeparator
      data-slot="menu-separator"
      style={{
        height: "1px",
        backgroundColor: "var(--vita-neutral-200)",
        margin: "4px 0",
        ...style,
      }}
    />
  );
}

// ── Dropdown (alias for Menu) ───────────────────────────────────────────────

export const Dropdown = Object.assign(MenuTrigger, {
  Trigger: MenuTrigger,
  Menu: MenuWithRef,
  Item: MenuItem,
  Popover: MenuPopover,
  Separator: MenuSeparator,
});
