/**
 * Avatar — Vita ERP wrapper for HeroUI Avatar.
 *
 * Applies theme tokens as inline styles on the Root, Image, and Fallback
 * sub-components so they override HeroUI's built-in Tailwind styles.
 * This is the single place to customize avatar appearance.
 */

"use client";

import {
  type AvatarRootProps,
  Avatar as HeroAvatar,
  AvatarFallback as HeroAvatarFallback,
  AvatarImage as HeroAvatarImage,
} from "@heroui/react";

// Re-export everything else from HeroUI
export {
  type AvatarFallbackProps,
  type AvatarImageProps,
  type AvatarProps,
  AvatarRoot,
  type AvatarRootProps,
  type AvatarVariants,
  avatarVariants,
} from "@heroui/react";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build the idle 3D transform string from CSS custom properties. */
const IDLE_TRANSFORM = [
  "perspective(800px)",
  "rotateX(var(--vita-avatar-rotate-x, 0deg))",
  "rotateY(var(--vita-avatar-rotate-y, 0deg))",
  "rotateZ(var(--vita-avatar-rotate-z, 0deg))",
].join(" ");

// ── Themed Sub-Components ────────────────────────────────────────────────────

function ThemedImage({
  style,
  ...props
}: React.ComponentProps<typeof HeroAvatarImage>) {
  return (
    <HeroAvatarImage
      {...props}
      style={{
        borderRadius: "var(--vita-avatar-radius, 9999px)",
        ...style,
      }}
    />
  );
}

function ThemedFallback({
  children,
  style,
  ...props
}: React.ComponentProps<typeof HeroAvatarFallback>) {
  return (
    <HeroAvatarFallback
      {...props}
      style={{
        fontWeight: "var(--vita-avatar-fallback-font-weight, 600)",
        fontSize: "var(--vita-avatar-fallback-font-size, 14px)",
        borderRadius: "var(--vita-avatar-radius, 9999px)",
        ...style,
      }}
    >
      {children}
    </HeroAvatarFallback>
  );
}

// ── Main Avatar Component ────────────────────────────────────────────────────

function AvatarRootThemed({ children, style, ...props }: AvatarRootProps) {
  return (
    <HeroAvatar
      {...props}
      style={{
        borderRadius: "var(--vita-avatar-radius, 9999px)",
        borderTopWidth: "var(--vita-avatar-border-top, 0px)",
        borderRightWidth: "var(--vita-avatar-border-right, 0px)",
        borderBottomWidth: "var(--vita-avatar-border-bottom, 0px)",
        borderLeftWidth: "var(--vita-avatar-border-left, 0px)",
        borderStyle:
          "var(--vita-avatar-border-style, solid)" as React.CSSProperties["borderStyle"],
        transitionProperty: "transform, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-avatar-transition-duration, 150ms)",
        transform: IDLE_TRANSFORM,
        overflow: "visible",
        ...style,
      }}
    >
      {children}
    </HeroAvatar>
  );
}

// ── Compound Export ──────────────────────────────────────────────────────────

export const Avatar = Object.assign(AvatarRootThemed, {
  Image: ThemedImage,
  Fallback: ThemedFallback,
});
