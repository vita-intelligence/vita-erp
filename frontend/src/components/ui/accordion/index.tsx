/**
 * Accordion — Vita ERP accordion built on React Aria Disclosure.
 *
 * Accessible with keyboard navigation (Enter/Space to toggle),
 * ARIA expanded state, and screen reader support.
 *
 * All visual properties driven by --vita-accordion-* CSS custom properties.
 *
 * Compound usage:
 *   <Accordion>
 *     <Accordion.Item>
 *       <Accordion.Heading>
 *         <Accordion.Trigger>Title<Accordion.Indicator /></Accordion.Trigger>
 *       </Accordion.Heading>
 *       <Accordion.Panel>
 *         <Accordion.Body>Content</Accordion.Body>
 *       </Accordion.Panel>
 *     </Accordion.Item>
 *   </Accordion>
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
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  type DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  type DisclosurePanelProps as AriaDisclosurePanelProps,
  type DisclosureProps as AriaDisclosureProps,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
} from "react-aria-components";

// ── Accordion Root (DisclosureGroup) ────────────────────────────────────────

export interface AccordionRootProps
  extends Omit<AriaDisclosureGroupProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function AccordionRootInner(
  { className, style, children, ...ariaProps }: AccordionRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaDisclosureGroup
      {...ariaProps}
      ref={ref}
      data-slot="accordion"
      className={["vita-accordion", className].filter(Boolean).join(" ")}
      style={{
        borderRadius: "var(--vita-accordion-radius, 8px)",
        borderWidth: "var(--vita-accordion-border-width, 1px)",
        borderStyle:
          "var(--vita-accordion-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-accordion-border-color)",
        boxShadow: "var(--vita-accordion-shadow, none)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </AriaDisclosureGroup>
  );
}

export const AccordionRoot = forwardRef(AccordionRootInner);
AccordionRoot.displayName = "AccordionRoot";

// ── Accordion Item (Disclosure) ─────────────────────────────────────────────

export interface AccordionItemProps
  extends Omit<AriaDisclosureProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function AccordionItemInner(
  { className, style, children, ...ariaProps }: AccordionItemProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaDisclosure
      {...ariaProps}
      ref={ref}
      data-slot="accordion-item"
      className={["vita-accordion-item", className].filter(Boolean).join(" ")}
      style={{
        borderBottomWidth: "var(--vita-accordion-separator-height, 1px)",
        borderBottomStyle: "solid",
        borderBottomColor: "var(--vita-accordion-border-color)",
        ...style,
      }}
    >
      {children}
    </AriaDisclosure>
  );
}

export const AccordionItem = forwardRef(AccordionItemInner);
AccordionItem.displayName = "AccordionItem";

// ── Accordion Heading ───────────────────────────────────────────────────────

export interface AccordionHeadingProps
  extends Omit<AriaHeadingProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function AccordionHeadingInner(
  { className, style, children, ...ariaProps }: AccordionHeadingProps,
  ref: ForwardedRef<HTMLHeadingElement>,
) {
  return (
    <AriaHeading
      {...ariaProps}
      ref={ref}
      data-slot="accordion-heading"
      className={className}
      style={{ margin: 0, ...style }}
    >
      {children}
    </AriaHeading>
  );
}

export const AccordionHeading = forwardRef(AccordionHeadingInner);
AccordionHeading.displayName = "AccordionHeading";

// ── Accordion Trigger ───────────────────────────────────────────────────────

export interface AccordionTriggerProps
  extends Omit<AriaButtonProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function AccordionTriggerInner(
  { className, style, children, ...ariaProps }: AccordionTriggerProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <AriaButton
      {...ariaProps}
      ref={ref}
      slot="trigger"
      data-slot="accordion-trigger"
      className={["vita-accordion-trigger", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        appearance: "none",
        background: "none",
        border: "none",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        outline: "none",
        fontFamily: "inherit",
        color: "var(--vita-text-primary)",
        paddingLeft: "var(--vita-accordion-trigger-padding-x, 16px)",
        paddingRight: "var(--vita-accordion-trigger-padding-x, 16px)",
        paddingTop: "var(--vita-accordion-trigger-padding-y, 12px)",
        paddingBottom: "var(--vita-accordion-trigger-padding-y, 12px)",
        fontWeight: "var(--vita-accordion-trigger-font-weight, 500)",
        fontSize: "var(--vita-accordion-trigger-font-size, 14px)",
        ...style,
      }}
    >
      {children}
    </AriaButton>
  );
}

export const AccordionTrigger = forwardRef(AccordionTriggerInner);
AccordionTrigger.displayName = "AccordionTrigger";

// ── Accordion Indicator (chevron) ───────────────────────────────────────────

export interface AccordionIndicatorProps {
  className?: string;
  style?: CSSProperties;
}

export function AccordionIndicator({
  className,
  style,
}: AccordionIndicatorProps) {
  return (
    <svg
      aria-hidden="true"
      data-slot="accordion-indicator"
      className={["vita-accordion-indicator", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: "16px",
        height: "16px",
        flexShrink: 0,
        color: "var(--vita-text-muted)",
        transitionProperty: "transform",
        transitionDuration: "200ms",
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ── Accordion Panel (DisclosurePanel) ───────────────────────────────────────

export interface AccordionPanelProps
  extends Omit<AriaDisclosurePanelProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
}

function AccordionPanelInner(
  { className, style, children, ...ariaProps }: AccordionPanelProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaDisclosurePanel
      {...ariaProps}
      ref={ref}
      data-slot="accordion-panel"
      className={className}
      style={style}
    >
      {children}
    </AriaDisclosurePanel>
  );
}

export const AccordionPanel = forwardRef(AccordionPanelInner);
AccordionPanel.displayName = "AccordionPanel";

// ── Accordion Body ──────────────────────────────────────────────────────────

export interface AccordionBodyProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AccordionBody({
  className,
  style,
  children,
}: AccordionBodyProps) {
  return (
    <div
      data-slot="accordion-body"
      className={className}
      style={{
        paddingLeft: "var(--vita-accordion-content-padding-x, 16px)",
        paddingRight: "var(--vita-accordion-content-padding-x, 16px)",
        paddingTop: "var(--vita-accordion-content-padding-y, 8px)",
        paddingBottom: "var(--vita-accordion-content-padding-y, 8px)",
        color: "var(--vita-text-secondary)",
        fontSize: "14px",
        lineHeight: "1.6",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const Accordion = Object.assign(forwardRef(AccordionRootInner), {
  Root: AccordionRoot,
  Item: AccordionItem,
  Heading: AccordionHeading,
  Trigger: AccordionTrigger,
  Indicator: AccordionIndicator,
  Panel: AccordionPanel,
  Body: AccordionBody,
});
Accordion.displayName = "Accordion";
