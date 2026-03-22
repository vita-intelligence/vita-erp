/**
 * Checkbox — Vita ERP wrapper for HeroUI Checkbox.
 *
 * Applies theme tokens as inline styles on the Root, Control, Indicator,
 * and Content sub-components so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize checkbox appearance.
 */

"use client";

import {
  type CheckboxRootProps,
  Checkbox as HeroCheckbox,
  CheckboxContent as HeroCheckboxContent,
  CheckboxControl as HeroCheckboxControl,
  CheckboxIndicator as HeroCheckboxIndicator,
} from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type CheckboxContentProps,
  type CheckboxControlProps,
  type CheckboxIndicatorProps,
  type CheckboxProps,
  type CheckboxRootProps,
  type CheckboxVariants,
  checkboxVariants,
} from "@heroui/react";

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedControl({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroCheckboxControl>) {
  return (
    <HeroCheckboxControl
      {...props}
      style={{
        width: "var(--vita-checkbox-size, 20px)",
        height: "var(--vita-checkbox-size, 20px)",
        minWidth: "var(--vita-checkbox-size, 20px)",
        minHeight: "var(--vita-checkbox-size, 20px)",
        borderRadius: "var(--vita-checkbox-radius, 4px)",
        borderWidth: "var(--vita-checkbox-border-width, 2px)",
        borderStyle:
          "var(--vita-checkbox-border-style, solid)" as React.CSSProperties["borderStyle"],
        boxShadow: "var(--vita-checkbox-shadow, none)",
        transitionProperty:
          "background-color, border-color, box-shadow, transform",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-checkbox-transition-duration, 150ms)",
        ...style,
      }}
    >
      {children}
    </HeroCheckboxControl>
  );
}

function ThemedIndicator({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroCheckboxIndicator>) {
  return (
    <HeroCheckboxIndicator
      {...props}
      style={{
        transitionDuration: "var(--vita-checkbox-transition-duration, 150ms)",
        ...style,
      }}
    >
      {children}
    </HeroCheckboxIndicator>
  );
}

function ThemedContent({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroCheckboxContent>) {
  return (
    <HeroCheckboxContent
      {...props}
      style={{
        fontSize: "var(--vita-checkbox-label-font-size, 14px)",
        fontWeight: "var(--vita-checkbox-label-font-weight, 400)",
        ...style,
      }}
    >
      {children}
    </HeroCheckboxContent>
  );
}

// ── Main Checkbox Component ──────────────────────────────────────────────────

function CheckboxRoot({ children, style, ...props }: CheckboxRootProps) {
  return (
    <HeroCheckbox
      {...props}
      style={{
        gap: "var(--vita-checkbox-gap, 8px)",
        ...style,
      }}
    >
      {children}
    </HeroCheckbox>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const Checkbox = Object.assign(CheckboxRoot, {
  Control: ThemedControl,
  Indicator: ThemedIndicator,
  Content: ThemedContent,
});
