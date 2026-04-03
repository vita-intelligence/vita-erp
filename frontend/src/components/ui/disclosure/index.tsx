/**
 * Disclosure — Vita ERP disclosure built on React Aria.
 *
 * Show/hide content with accessible toggle.
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
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
} from "react-aria-components";

export interface DisclosureProps
  extends Omit<AriaDisclosureProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function DisclosureInner(
  { className, style, children, ...ariaProps }: DisclosureProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaDisclosure
      {...ariaProps}
      ref={ref}
      data-slot="disclosure"
      className={className}
      style={style}
    >
      {children}
    </AriaDisclosure>
  );
}

export const Disclosure = forwardRef(DisclosureInner);
Disclosure.displayName = "Disclosure";

export interface DisclosureTriggerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function DisclosureTrigger({
  className,
  style,
  children,
}: DisclosureTriggerProps) {
  return (
    <AriaButton slot="trigger" className={className} style={style}>
      {children}
    </AriaButton>
  );
}

export interface DisclosurePanelProps
  extends Omit<AriaDisclosurePanelProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function DisclosurePanelInner(
  { className, style, children, ...ariaProps }: DisclosurePanelProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaDisclosurePanel
      {...ariaProps}
      ref={ref}
      data-slot="disclosure-panel"
      className={className}
      style={style}
    >
      {children}
    </AriaDisclosurePanel>
  );
}

export const DisclosurePanel = forwardRef(DisclosurePanelInner);
DisclosurePanel.displayName = "DisclosurePanel";
