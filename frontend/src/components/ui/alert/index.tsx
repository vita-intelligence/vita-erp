/**
 * Alert — Vita ERP inline alert/banner component.
 *
 * Presentational component for informational, success, warning, and error messages.
 * All visual properties driven by --vita-alert-* CSS custom properties.
 *
 * Compound usage:
 *   <Alert color="success">
 *     <Alert.Indicator />
 *     <Alert.Content>
 *       <Alert.Title>Title</Alert.Title>
 *       <Alert.Description>Details</Alert.Description>
 *     </Alert.Content>
 *   </Alert>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";

// ── Color variants ──────────────────────────────────────────────────────────

export type AlertColor = "default" | "success" | "warning" | "danger" | "info";

const COLOR_MAP: Record<
  AlertColor,
  { bg: string; border: string; accent: string }
> = {
  default: {
    bg: "var(--vita-neutral-50)",
    border: "var(--vita-neutral-200)",
    accent: "var(--vita-text-primary)",
  },
  success: {
    bg: "var(--vita-success-light)",
    border: "var(--vita-success)",
    accent: "var(--vita-success-dark)",
  },
  warning: {
    bg: "var(--vita-warning-light)",
    border: "var(--vita-warning)",
    accent: "var(--vita-warning-dark)",
  },
  danger: {
    bg: "var(--vita-error-light)",
    border: "var(--vita-error)",
    accent: "var(--vita-error-dark)",
  },
  info: {
    bg: "var(--vita-info-light)",
    border: "var(--vita-info)",
    accent: "var(--vita-info-dark)",
  },
};

// ── Alert Root ──────────────────────────────────────────────────────────────

export interface AlertRootProps {
  /** @deprecated Use `color` instead */
  status?: string;
  color?: AlertColor;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function AlertRootInner(
  { color, status, className, style, children }: AlertRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const resolvedColor = color ?? (status as AlertColor) ?? "default";
  const colors = COLOR_MAP[resolvedColor] ?? COLOR_MAP.default;

  return (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      data-color={resolvedColor}
      className={["vita-alert", className].filter(Boolean).join(" ")}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.accent,
        borderRadius: "var(--vita-alert-radius, 8px)",
        borderWidth: "var(--vita-alert-border-width, 1px)",
        borderStyle:
          "var(--vita-alert-border-style, solid)" as CSSProperties["borderStyle"],
        paddingInline: "var(--vita-alert-padding-x, 16px)",
        paddingBlock: "var(--vita-alert-padding-y, 12px)",
        boxShadow: "var(--vita-alert-shadow, none)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const AlertRoot = forwardRef(AlertRootInner);
AlertRoot.displayName = "AlertRoot";

// ── Sub-components ──────────────────────────────────────────────────────────

export interface AlertIndicatorProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AlertIndicator({
  className,
  style,
  children,
}: AlertIndicatorProps) {
  return (
    <span
      data-slot="alert-indicator"
      className={className}
      style={{
        display: "inline-flex",
        flexShrink: 0,
        width: "var(--vita-alert-icon-size, 20px)",
        height: "var(--vita-alert-icon-size, 20px)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export interface AlertContentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AlertContent({
  className,
  style,
  children,
}: AlertContentProps) {
  return (
    <div
      data-slot="alert-content"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        flex: 1,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface AlertTitleProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AlertTitle({ className, style, children }: AlertTitleProps) {
  return (
    <div
      data-slot="alert-title"
      className={className}
      style={{
        fontWeight: "var(--vita-alert-title-font-weight, 600)",
        fontSize: "var(--vita-alert-title-font-size, 14px)",
        lineHeight: "1.4",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface AlertDescriptionProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AlertDescription({
  className,
  style,
  children,
}: AlertDescriptionProps) {
  return (
    <div
      data-slot="alert-description"
      className={className}
      style={{
        fontSize: "var(--vita-alert-description-font-size, 13px)",
        lineHeight: "1.5",
        opacity: 0.85,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const Alert = Object.assign(forwardRef(AlertRootInner), {
  Root: AlertRoot,
  Indicator: AlertIndicator,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
});
Alert.displayName = "Alert";
