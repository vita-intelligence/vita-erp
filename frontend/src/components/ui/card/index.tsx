/**
 * Card — Vita ERP wrapper for HeroUI Card (compound component).
 *
 * Applies theme tokens as inline styles on the root Card element
 * so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize card appearance.
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardRootProps,
  CardTitle,
  CardRoot as HeroCardRoot,
} from "@heroui/react";

// Re-export everything from HeroUI (types, variants, etc.)
// The local named exports below take precedence over the wildcard.
export * from "@heroui/react";

// ── Themed Root ──────────────────────────────────────────────────────────────

function ThemedCardRoot({ children, style, ...props }: CardRootProps) {
  return (
    <HeroCardRoot
      {...props}
      style={{
        borderRadius: "var(--vita-card-radius, 0px)",
        borderTopWidth: "var(--vita-card-border-top, 1px)",
        borderRightWidth: "var(--vita-card-border-right, 1px)",
        borderBottomWidth: "var(--vita-card-border-bottom, 1px)",
        borderLeftWidth: "var(--vita-card-border-left, 1px)",
        borderStyle: "var(--vita-card-border-style, solid)",
        boxShadow: "var(--vita-card-shadow, none)",
        transitionProperty: "transform, box-shadow, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-card-transition-duration, 150ms)",
        transform:
          "perspective(800px) rotateX(var(--vita-card-rotate-x, 0deg)) rotateY(var(--vita-card-rotate-y, 0deg)) rotateZ(var(--vita-card-rotate-z, 0deg))",
        ...style,
      }}
    >
      {children}
    </HeroCardRoot>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const CardRoot = ThemedCardRoot;

export const Card = Object.assign(ThemedCardRoot, {
  Root: ThemedCardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
