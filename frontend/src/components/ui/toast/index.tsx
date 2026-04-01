/**
 * Toast — Vita ERP wrapper for HeroUI Toast.
 *
 * Applies theme tokens via CSS targeting HeroUI's data-slot attributes.
 * This preserves HeroUI's internal rendering, animations, and variant
 * colors while allowing theme customization through CSS variables.
 */

"use client";

import { ToastProvider as HeroToastProvider } from "@heroui/react";

export type { ToastVariants } from "@heroui/react";
export { ToastQueue, toast, toastQueue, toastVariants } from "@heroui/react";

// ── Provider (pass-through) ─────────────────────────────────────────────────

export function ToastProvider(
  props: React.ComponentProps<typeof HeroToastProvider>,
) {
  return <HeroToastProvider {...props} />;
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const Toast = {
  Provider: ToastProvider,
};
