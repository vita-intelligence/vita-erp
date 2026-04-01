/**
 * Switch — Vita ERP toggle switch built on React Aria.
 *
 * Fully accessible (WCAG 2.1 AA) with keyboard toggle (Space),
 * focus management, and screen reader support via React Aria.
 *
 * All visual properties are driven by --vita-switch-* CSS custom properties,
 * giving the theme editor full control over appearance.
 *
 * Compound usage:
 *   <Switch isSelected={val} onChange={setVal}>
 *     <Switch.Control>
 *       <Switch.Thumb />
 *     </Switch.Control>
 *     <Switch.Content>Label text</Switch.Content>
 *   </Switch>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";

// ── Switch Root ─────────────────────────────────────────────────────────────

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchRootProps
  extends Omit<AriaSwitchProps, "className" | "style" | "children"> {
  /** Visual size — scales track and thumb via data-size attribute */
  size?: SwitchSize;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function SwitchRootInner(
  { size = "md", className, style, children, ...ariaProps }: SwitchRootProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  return (
    <AriaSwitch
      {...ariaProps}
      ref={ref}
      data-slot="switch"
      data-size={size}
      className={["vita-switch", className].filter(Boolean).join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--vita-switch-gap, 8px)",
        cursor: ariaProps.isDisabled ? "not-allowed" : "pointer",
        opacity: ariaProps.isDisabled ? 0.5 : 1,
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </AriaSwitch>
  );
}

// ── Control (Track) ─────────────────────────────────────────────────────────

export interface SwitchControlProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function SwitchControl({
  className,
  style,
  children,
}: SwitchControlProps) {
  return (
    <span
      data-slot="switch-control"
      className={["vita-switch-control", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
        width: "var(--vita-switch-track-width, 44px)",
        height: "var(--vita-switch-track-height, 24px)",
        borderRadius: "var(--vita-switch-track-radius, 9999px)",
        transitionProperty: "background-color",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-switch-transition-duration, 200ms)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Thumb ───────────────────────────────────────────────────────────────────

export interface SwitchThumbProps {
  className?: string;
  style?: CSSProperties;
}

export function SwitchThumb({ className, style }: SwitchThumbProps) {
  return (
    <span
      data-slot="switch-thumb"
      className={["vita-switch-thumb", className].filter(Boolean).join(" ")}
      style={{
        display: "block",
        width: "var(--vita-switch-thumb-size, 20px)",
        height: "var(--vita-switch-thumb-size, 20px)",
        borderRadius: "var(--vita-switch-thumb-radius, 9999px)",
        backgroundColor: "white",
        boxShadow: "0 1px 3px oklch(0 0 0 / 0.15)",
        transitionProperty: "transform",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-switch-transition-duration, 200ms)",
        ...style,
      }}
    />
  );
}

// ── Content (Label) ─────────────────────────────────────────────────────────

export interface SwitchContentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function SwitchContent({
  className,
  style,
  children,
}: SwitchContentProps) {
  return (
    <span
      data-slot="switch-content"
      className={["vita-switch-content", className].filter(Boolean).join(" ")}
      style={{
        fontSize: "14px",
        color: "var(--vita-text-primary)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const Switch = Object.assign(forwardRef(SwitchRootInner), {
  Control: SwitchControl,
  Thumb: SwitchThumb,
  Content: SwitchContent,
});
Switch.displayName = "Switch";

// ── Type exports ────────────────────────────────────────────────────────────

export type { SwitchRootProps as SwitchProps };
