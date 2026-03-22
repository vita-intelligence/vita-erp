/**
 * Switch — Vita ERP wrapper for HeroUI Switch.
 *
 * Applies theme tokens as inline styles on the Control and Thumb
 * sub-components so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize switch appearance.
 */

"use client";

import {
  Switch as HeroSwitch,
  SwitchContent as HeroSwitchContent,
  SwitchControl as HeroSwitchControl,
  SwitchThumb as HeroSwitchThumb,
  type SwitchRootProps,
} from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type SwitchContentProps,
  type SwitchControlProps,
  SwitchIcon,
  type SwitchIconProps,
  type SwitchProps,
  type SwitchRootProps,
  type SwitchThumbProps,
  type SwitchVariants,
  switchVariants,
} from "@heroui/react";

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedControl({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroSwitchControl>) {
  return (
    <HeroSwitchControl
      {...props}
      style={{
        width: "var(--vita-switch-track-width, 44px)",
        height: "var(--vita-switch-track-height, 24px)",
        borderRadius: "var(--vita-switch-track-radius, 9999px)",
        transitionDuration: "var(--vita-switch-transition-duration, 200ms)",
        ...style,
      }}
    >
      {children}
    </HeroSwitchControl>
  );
}

function ThemedThumb({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroSwitchThumb>) {
  return (
    <HeroSwitchThumb
      {...props}
      style={{
        width: "var(--vita-switch-thumb-size, 20px)",
        height: "var(--vita-switch-thumb-size, 20px)",
        borderRadius: "var(--vita-switch-thumb-radius, 9999px)",
        transitionDuration: "var(--vita-switch-transition-duration, 200ms)",
        ...style,
      }}
    >
      {children}
    </HeroSwitchThumb>
  );
}

// ── Main Switch Component ────────────────────────────────────────────────────

function SwitchRoot({ children, style, ...props }: SwitchRootProps) {
  return (
    <HeroSwitch
      {...props}
      style={{
        gap: "var(--vita-switch-gap, 8px)",
        ...style,
      }}
    >
      {children}
    </HeroSwitch>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const Switch = Object.assign(SwitchRoot, {
  Control: ThemedControl,
  Thumb: ThemedThumb,
  Content: HeroSwitchContent,
});
