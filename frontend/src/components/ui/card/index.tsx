/**
 * Card — Vita ERP card layout component.
 *
 * A presentational container with theme-controlled radius, border,
 * shadow, and 3D transform tokens. All visual properties are driven
 * by --vita-card-* CSS custom properties.
 *
 * Compound usage:
 *   <Card>
 *     <Card.Header><Card.Title>Title</Card.Title></Card.Header>
 *     <Card.Content>...</Card.Content>
 *     <Card.Footer>...</Card.Footer>
 *   </Card>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { useCursorTrack } from "@/hooks/useCursorTrack";
import { useThemeStore } from "@/stores/theme";

// ── Shared sub-component type ───────────────────────────────────────────────

type SlotProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

// ── Card Root ───────────────────────────────────────────────────────────────

export interface CardRootProps extends SlotProps {
  style?: CSSProperties;
}

function CardRootInner(
  { className, style, children, ...htmlProps }: CardRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const trackIntensity = useThemeStore((s) =>
    parseFloat(s.tokens.cardCursorTrack ?? "0"),
  );
  const trackRestore = useThemeStore((s) =>
    parseFloat(s.tokens.cardCursorTrackRestore ?? "300"),
  );
  const { onMouseMove, onMouseLeave } = useCursorTrack(
    "card",
    trackIntensity,
    trackRestore,
  );
  const trackProps = trackIntensity > 0 ? { onMouseMove, onMouseLeave } : {};

  return (
    <div
      {...htmlProps}
      {...trackProps}
      ref={ref}
      data-slot="card"
      className={["vita-card", className].filter(Boolean).join(" ")}
      style={{
        backgroundColor: "var(--vita-surface)",
        borderColor: "var(--vita-card-border-color)",
        color: "var(--vita-text-primary)",
        overflow: "hidden",

        // Theme tokens
        borderRadius: "var(--vita-card-radius, 12px)",
        borderTopWidth: "var(--vita-card-border-top, 1px)",
        borderRightWidth: "var(--vita-card-border-right, 1px)",
        borderBottomWidth: "var(--vita-card-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-card-border-left, 1px)",
        borderStyle:
          "var(--vita-card-border-style, solid)" as CSSProperties["borderStyle"],
        boxShadow: "var(--vita-card-shadow, none)",

        // Transitions
        transitionProperty: "transform, box-shadow, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-card-transition-duration, 150ms)",

        // 3D perspective rotation
        transform:
          "perspective(800px) rotateX(var(--vita-card-rotate-x, 0deg)) rotateY(var(--vita-card-rotate-y, 0deg)) rotateZ(var(--vita-card-rotate-z, 0deg))",

        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const CardRoot = forwardRef(CardRootInner);
CardRoot.displayName = "CardRoot";

// ── Sub-components ──────────────────────────────────────────────────────────

function CardHeaderInner(
  { className, style, children, ...htmlProps }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...htmlProps}
      ref={ref}
      data-slot="card-header"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "20px 24px 0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const CardHeader = forwardRef(CardHeaderInner);
CardHeader.displayName = "CardHeader";

function CardTitleInner(
  { className, style, children, ...htmlProps }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...htmlProps}
      ref={ref}
      data-slot="card-title"
      className={className}
      style={{
        fontWeight: 600,
        fontSize: "16px",
        lineHeight: "1.4",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const CardTitle = forwardRef(CardTitleInner);
CardTitle.displayName = "CardTitle";

function CardDescriptionInner(
  { className, style, children, ...htmlProps }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...htmlProps}
      ref={ref}
      data-slot="card-description"
      className={className}
      style={{
        fontSize: "14px",
        color: "var(--vita-text-muted)",
        lineHeight: "1.5",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const CardDescription = forwardRef(CardDescriptionInner);
CardDescription.displayName = "CardDescription";

function CardContentInner(
  { className, style, children, ...htmlProps }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...htmlProps}
      ref={ref}
      data-slot="card-content"
      className={className}
      style={{
        padding: "20px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const CardContent = forwardRef(CardContentInner);
CardContent.displayName = "CardContent";

function CardFooterInner(
  { className, style, children, ...htmlProps }: SlotProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      {...htmlProps}
      ref={ref}
      data-slot="card-footer"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 24px 20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const CardFooter = forwardRef(CardFooterInner);
CardFooter.displayName = "CardFooter";

// ── Compound Export ─────────────────────────────────────────────────────────

export const Card = Object.assign(forwardRef(CardRootInner), {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
Card.displayName = "Card";
