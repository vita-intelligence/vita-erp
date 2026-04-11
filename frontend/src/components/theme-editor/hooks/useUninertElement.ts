"use client";

import { type RefObject, useEffect } from "react";

/**
 * Keeps an element (and its ancestors up to <body>) free of the `inert` and
 * `aria-hidden` attributes that React Aria's `ariaHideOutside` applies when a
 * Modal opens.
 *
 * React Aria exposes `data-react-aria-top-layer` as the documented opt-out,
 * but that attribute also makes every descendant fail the
 * `useInteractOutside.isValidEvent` check — which breaks dismiss-on-outside
 * for any popover living inside the tagged subtree. The theme editor opens
 * its own popovers (module picker, color pickers, etc.) that need normal
 * dismissal, so we take a different approach: let react-aria tag this
 * element as inert if it wants, and then reactively strip the attribute via
 * a MutationObserver. The end result is the same visually (the element is
 * interactive) without poisoning `useInteractOutside`.
 */
export function useUninertElement(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const strip = (node: HTMLElement) => {
      if (node.inert) node.inert = false;
      if (node.hasAttribute("aria-hidden")) {
        node.removeAttribute("aria-hidden");
      }
    };

    const walkUp = (cb: (node: HTMLElement) => void) => {
      for (
        let node: HTMLElement | null = el;
        node && node !== document.body;
        node = node.parentElement
      ) {
        cb(node);
      }
    };

    // Clear anything already stamped by a modal that was open before we
    // mounted.
    walkUp(strip);

    const observer = new MutationObserver((changes) => {
      for (const change of changes) {
        strip(change.target as HTMLElement);
      }
    });

    walkUp((node) => {
      observer.observe(node, {
        attributes: true,
        attributeFilter: ["inert", "aria-hidden"],
      });
    });

    return () => observer.disconnect();
  }, [ref]);
}
