/**
 * Tooltip — Vita ERP tooltip built on React Aria.
 *
 * Accessible tooltip with keyboard support, focus management,
 * and screen reader announcements via React Aria.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";
import {
  OverlayArrow as AriaOverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps as AriaTooltipTriggerProps,
} from "react-aria-components";

// ── Tooltip Trigger ─────────────────────────────────────────────────────────

export interface TooltipTriggerProps extends AriaTooltipTriggerProps {
  children: ReactNode;
}

export function TooltipTrigger({ children, ...props }: TooltipTriggerProps) {
  return <AriaTooltipTrigger {...props}>{children}</AriaTooltipTrigger>;
}

// ── Tooltip Content ─────────────────────────────────────────────────────────

export interface TooltipProps
  extends Omit<AriaTooltipProps, "className" | "style"> {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function TooltipInner(
  { className, style, children, ...ariaProps }: TooltipProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <AriaTooltip
      {...ariaProps}
      ref={ref}
      data-slot="tooltip"
      className={["vita-tooltip", className].filter(Boolean).join(" ")}
      style={{
        backgroundColor: "var(--vita-neutral-900)",
        color: "var(--vita-neutral-50)",
        fontSize: "12px",
        lineHeight: "1.4",
        padding: "4px 8px",
        borderRadius: "6px",
        maxWidth: "240px",
        boxShadow: "0 2px 8px oklch(0 0 0 / 0.15)",
        ...style,
      }}
    >
      <AriaOverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8" aria-hidden="true">
          <path d="M0 0 L4 4 L8 0" fill="var(--vita-neutral-900)" />
        </svg>
      </AriaOverlayArrow>
      {children}
    </AriaTooltip>
  );
}

export const TooltipContent = forwardRef(TooltipInner);
TooltipContent.displayName = "TooltipContent";

// ── Compound Export ─────────────────────────────────────────────────────────

export const Tooltip = Object.assign(TooltipTrigger, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
});
