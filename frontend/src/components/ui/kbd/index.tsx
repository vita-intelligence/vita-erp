/**
 * Kbd — Vita ERP keyboard shortcut indicator.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import { Keyboard as AriaKeyboard } from "react-aria-components";

export interface KbdProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function KbdInner(
  { className, style, children }: KbdProps,
  ref: ForwardedRef<HTMLElement>,
) {
  return (
    <AriaKeyboard
      ref={ref}
      data-slot="kbd"
      className={["vita-kbd", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        padding: "2px 6px",
        borderRadius: "4px",
        border: "1px solid var(--vita-neutral-200)",
        backgroundColor: "var(--vita-neutral-50)",
        color: "var(--vita-text-secondary)",
        fontSize: "11px",
        fontFamily: "var(--vita-font-mono, monospace)",
        fontWeight: 500,
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </AriaKeyboard>
  );
}

export const Kbd = forwardRef(KbdInner);
Kbd.displayName = "Kbd";
