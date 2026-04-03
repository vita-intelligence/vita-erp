/**
 * ScrollShadow — Vita ERP scrollable container with edge fade.
 *
 * Adds gradient shadows at scroll boundaries to indicate more content.
 * Pure CSS implementation — no HeroUI dependency.
 */

"use client";

import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactNode,
} from "react";

export interface ScrollShadowProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function ScrollShadowInner(
  { orientation = "vertical", className, style, children }: ScrollShadowProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const isVertical = orientation === "vertical";

  return (
    <div
      ref={ref}
      data-slot="scroll-shadow"
      data-orientation={orientation}
      className={["vita-scroll-shadow", className].filter(Boolean).join(" ")}
      style={{
        overflow: "auto",
        ...(isVertical
          ? {
              maskImage:
                "linear-gradient(to bottom, transparent, black 16px, black calc(100% - 16px), transparent)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 16px, black calc(100% - 16px), transparent)",
            }
          : {
              maskImage:
                "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)",
            }),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const ScrollShadow = forwardRef(ScrollShadowInner);
ScrollShadow.displayName = "ScrollShadow";
