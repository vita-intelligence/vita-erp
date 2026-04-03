/**
 * Avatar — Vita ERP avatar component.
 *
 * Displays user images with fallback initials.
 * All visual properties driven by --vita-avatar-* CSS custom properties.
 *
 * Compound usage:
 *   <Avatar>
 *     <Avatar.Image src="..." alt="..." />
 *     <Avatar.Fallback>JD</Avatar.Fallback>
 *   </Avatar>
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";

// ── Helpers ─────────────────────────────────────────────────────────────────

const IDLE_TRANSFORM = [
  "perspective(800px)",
  "rotateX(var(--vita-avatar-rotate-x, 0deg))",
  "rotateY(var(--vita-avatar-rotate-y, 0deg))",
  "rotateZ(var(--vita-avatar-rotate-z, 0deg))",
].join(" ");

// ── Avatar Root ─────────────────────────────────────────────────────────────

export interface AvatarRootProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const SIZE_MAP = {
  sm: "var(--vita-avatar-size-sm, 32px)",
  md: "var(--vita-avatar-size-md, 40px)",
  lg: "var(--vita-avatar-size-lg, 56px)",
};

function AvatarRootInner(
  { size = "md", className, style, children }: AvatarRootProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const sizeToken = SIZE_MAP[size];

  return (
    <span
      ref={ref}
      data-slot="avatar"
      data-size={size}
      className={["vita-avatar", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: sizeToken,
        height: sizeToken,
        borderRadius: "var(--vita-avatar-radius, 9999px)",
        borderTopWidth: "var(--vita-avatar-border-top, 0px)",
        borderRightWidth: "var(--vita-avatar-border-right, 0px)",
        borderBottomWidth: "var(--vita-avatar-border-bottom, 0px)",
        borderLeftWidth: "var(--vita-avatar-border-left, 0px)",
        borderStyle:
          "var(--vita-avatar-border-style, solid)" as CSSProperties["borderStyle"],
        borderColor: "var(--vita-neutral-200)",
        overflow: "hidden",
        transitionProperty: "transform, opacity",
        transitionTimingFunction: "ease",
        transitionDuration: "var(--vita-avatar-transition-duration, 150ms)",
        transform: IDLE_TRANSFORM,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Avatar Image ────────────────────────────────────────────────────────────

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  style?: CSSProperties;
};

export function AvatarImage({ style, ...props }: AvatarImageProps) {
  return (
    // biome-ignore lint/performance/noImgElement: component library primitive, not a page image
    // biome-ignore lint/a11y/useAltText: alt is passed via spread props
    <img
      data-slot="avatar-image"
      {...props}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "var(--vita-avatar-radius, 9999px)",
        ...style,
      }}
    />
  );
}

// ── Avatar Fallback ─────────────────────────────────────────────────────────

export interface AvatarFallbackProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function AvatarFallback({
  className,
  style,
  children,
}: AvatarFallbackProps) {
  return (
    <span
      data-slot="avatar-fallback"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "var(--vita-neutral-200)",
        color: "var(--vita-text-secondary)",
        fontWeight: "var(--vita-avatar-fallback-font-weight, 600)",
        fontSize: "var(--vita-avatar-fallback-font-size, 14px)",
        borderRadius: "var(--vita-avatar-radius, 9999px)",
        userSelect: "none",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const Avatar = Object.assign(forwardRef(AvatarRootInner), {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
Avatar.displayName = "Avatar";
