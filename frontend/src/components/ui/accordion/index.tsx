/**
 * Accordion — Vita ERP wrapper for HeroUI Accordion.
 *
 * Applies theme tokens as inline styles on the Root, Trigger, and Body
 * sub-components so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize accordion appearance.
 */

"use client";

import {
  type AccordionRootProps,
  Accordion as HeroAccordion,
  AccordionBody as HeroAccordionBody,
  AccordionHeading as HeroAccordionHeading,
  AccordionIndicator as HeroAccordionIndicator,
  AccordionItem as HeroAccordionItem,
  AccordionPanel as HeroAccordionPanel,
  AccordionTrigger as HeroAccordionTrigger,
} from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type AccordionBodyProps,
  type AccordionHeadingProps,
  type AccordionIndicatorProps,
  type AccordionItemProps,
  type AccordionPanelProps,
  type AccordionProps,
  type AccordionRootProps,
  type AccordionTriggerProps,
  type AccordionVariants,
  accordionVariants,
} from "@heroui/react";

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedRoot({ children, style, ...props }: AccordionRootProps) {
  return (
    <HeroAccordion
      {...props}
      style={{
        borderRadius: "var(--vita-accordion-radius, 0px)",
        borderWidth: "var(--vita-accordion-border-width, 1px)",
        borderStyle: "var(--vita-accordion-border-style, solid)",
        boxShadow: "var(--vita-accordion-shadow, none)",
        ...style,
      }}
    >
      {children}
    </HeroAccordion>
  );
}

function ThemedTrigger({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroAccordionTrigger>) {
  return (
    <HeroAccordionTrigger
      {...props}
      style={{
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
    </HeroAccordionTrigger>
  );
}

function ThemedBody({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroAccordionBody>) {
  return (
    <HeroAccordionBody
      {...props}
      style={{
        paddingLeft: "var(--vita-accordion-content-padding-x, 16px)",
        paddingRight: "var(--vita-accordion-content-padding-x, 16px)",
        paddingTop: "var(--vita-accordion-content-padding-y, 8px)",
        paddingBottom: "var(--vita-accordion-content-padding-y, 8px)",
        ...style,
      }}
    >
      {children}
    </HeroAccordionBody>
  );
}

// ── Named Exports (for direct imports) ───────────────────────────────────────

export {
  HeroAccordionItem as AccordionItem,
  HeroAccordionHeading as AccordionHeading,
  HeroAccordionPanel as AccordionPanel,
  HeroAccordionIndicator as AccordionIndicator,
};
export { ThemedRoot as AccordionRoot };
export { ThemedTrigger as AccordionTrigger };
export { ThemedBody as AccordionBody };

// ── Compound Export ──────────────────────────────────────────────────────────

export const Accordion = Object.assign(ThemedRoot, {
  Root: ThemedRoot,
  Item: HeroAccordionItem,
  Heading: HeroAccordionHeading,
  Trigger: ThemedTrigger,
  Panel: HeroAccordionPanel,
  Indicator: HeroAccordionIndicator,
  Body: ThemedBody,
});
