/**
 * Toast — Vita ERP notification system built on React Aria.
 *
 * Uses React Aria's ToastQueue for state management and ToastRegion
 * for accessible rendering. Toasts auto-dismiss after a configurable
 * timeout and support keyboard dismissal (Escape).
 *
 * All visual properties are driven by --vita-toast-* CSS custom properties,
 * giving the theme editor full control over appearance.
 *
 * Usage:
 *   // Mount once in providers:
 *   <ToastProvider placement="bottom end" />
 *
 *   // Show a toast from anywhere:
 *   import { toast } from "@/components/ui/toast";
 *   toast("Saved successfully");
 *   toast({ title: "Error", description: "Something went wrong", variant: "danger" });
 */

"use client";

import { type CSSProperties, useCallback } from "react";
import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  type ToastProps as AriaToastProps,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  Text,
} from "react-aria-components";
import { createPortal, flushSync } from "react-dom";

// ── Types ───────────────────────────────────────────────────────────────────

export type ToastVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface ToastContent {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export interface ToastVariants {
  placement?:
    | "top"
    | "top start"
    | "top end"
    | "bottom"
    | "bottom start"
    | "bottom end";
}

// ── Queue (module-level singleton) ──────────────────────────────────────────

export const toastQueue = new AriaToastQueue<ToastContent>({
  maxVisibleToasts: 5,
  wrapUpdate(fn) {
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (
        document as unknown as { startViewTransition: (cb: () => void) => void }
      ).startViewTransition(() => flushSync(fn));
    } else {
      fn();
    }
  },
});

// ── Imperative toast() function ─────────────────────────────────────────────

/**
 * Show a toast notification.
 *
 * @param content - A string (shown as title) or a ToastContent object
 * @param timeout - Auto-dismiss duration in ms (default: 5000, 0 = no auto-dismiss)
 */
function showToast(content: string | ToastContent, timeout = 5000): string {
  const resolved: ToastContent =
    typeof content === "string" ? { title: content } : content;
  return toastQueue.add(resolved, { timeout });
}

function variantToast(variant: ToastVariant) {
  return (content: string | Omit<ToastContent, "variant">, timeout = 5000) => {
    const resolved: ToastContent =
      typeof content === "string"
        ? { title: content, variant }
        : { ...content, variant };
    return toastQueue.add(resolved, { timeout });
  };
}

export const toast = Object.assign(showToast, {
  success: variantToast("success"),
  warning: variantToast("warning"),
  danger: variantToast("danger"),
  info: variantToast("info"),
});

// ── Variant color map ───────────────────────────────────────────────────────

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; accent: string }
> = {
  default: {
    bg: "var(--vita-surface)",
    border: "var(--vita-neutral-200)",
    accent: "var(--vita-text-primary)",
  },
  success: {
    bg: "var(--vita-surface)",
    border: "var(--vita-success)",
    accent: "var(--vita-success)",
  },
  warning: {
    bg: "var(--vita-surface)",
    border: "var(--vita-warning)",
    accent: "var(--vita-warning)",
  },
  danger: {
    bg: "var(--vita-surface)",
    border: "var(--vita-error)",
    accent: "var(--vita-error)",
  },
  info: {
    bg: "var(--vita-surface)",
    border: "var(--vita-info)",
    accent: "var(--vita-info)",
  },
};

// ── Individual Toast ────────────────────────────────────────────────────────

function VitaToast({
  toast: toastItem,
  ...props
}: AriaToastProps<ToastContent>) {
  const variant = toastItem.content.variant ?? "default";
  const colors = VARIANT_STYLES[variant];

  return (
    <AriaToast
      toast={toastItem}
      {...props}
      data-slot="toast"
      data-variant={variant}
      style={
        {
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          backgroundColor: colors.bg,
          borderColor: colors.border,
          color: "var(--vita-text-primary)",
          borderRadius: "var(--vita-toast-radius, 12px)",
          borderWidth: "var(--vita-toast-border-width, 1px)",
          borderStyle:
            "var(--vita-toast-border-style, solid)" as CSSProperties["borderStyle"],
          paddingInline: "var(--vita-toast-padding-x, 16px)",
          paddingBlock: "var(--vita-toast-padding-y, 12px)",
          boxShadow: "var(--vita-toast-shadow)",
          minWidth: "var(--vita-toast-min-width, 320px)",
          maxWidth: "var(--vita-toast-max-width, 420px)",
          viewTransitionName: `vita-toast-${toastItem.key}`,
        } as CSSProperties
      }
    >
      {/* Accent bar */}
      {variant !== "default" && (
        <span
          data-slot="toast-indicator"
          style={{
            width: "4px",
            alignSelf: "stretch",
            flexShrink: 0,
            borderRadius: "2px",
            backgroundColor: colors.accent,
          }}
        />
      )}

      {/* Content */}
      <AriaToastContent
        data-slot="toast-content"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--vita-toast-content-gap, 4px)",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Text
          slot="title"
          data-slot="toast-title"
          style={{
            fontWeight: "var(--vita-toast-title-font-weight, 600)",
            fontSize: "var(--vita-toast-title-font-size, 14px)",
            lineHeight: "1.4",
          }}
        >
          {toastItem.content.title}
        </Text>
        {toastItem.content.description && (
          <Text
            slot="description"
            data-slot="toast-description"
            style={{
              fontSize: "var(--vita-toast-description-font-size, 13px)",
              opacity:
                "var(--vita-toast-description-opacity, 0.7)" as unknown as number,
              lineHeight: "1.4",
            }}
          >
            {toastItem.content.description}
          </Text>
        )}
      </AriaToastContent>

      {/* Close button */}
      <button
        slot="close"
        type="button"
        aria-label="Close"
        data-slot="toast-close"
        onClick={() => toastQueue.close(toastItem.key)}
        style={{
          appearance: "none",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: "var(--vita-toast-close-size, 28px)",
          height: "var(--vita-toast-close-size, 28px)",
          borderRadius: "var(--vita-toast-close-radius, 6px)",
          opacity: "var(--vita-toast-close-opacity, 0.5)" as unknown as number,
          color: "currentColor",
          padding: 0,
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </AriaToast>
  );
}

// ── Placement CSS map ───────────────────────────────────────────────────────

const PLACEMENT_STYLES: Record<string, CSSProperties> = {
  top: { top: 16, left: "50%", transform: "translateX(-50%)" },
  "top start": { top: 16, left: 16 },
  "top end": { top: 16, right: 16 },
  bottom: { bottom: 16, left: "50%", transform: "translateX(-50%)" },
  "bottom start": { bottom: 16, left: 16 },
  "bottom end": { bottom: 16, right: 16 },
};

// ── Provider ────────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  placement?: ToastVariants["placement"];
}

export function ToastProvider({
  placement = "bottom end",
}: ToastProviderProps) {
  const positionStyle =
    PLACEMENT_STYLES[placement] ?? PLACEMENT_STYLES["bottom end"];

  const renderToast = useCallback(
    ({
      toast: toastItem,
    }: {
      toast: AriaToastProps<ToastContent>["toast"];
    }) => <VitaToast key={toastItem.key} toast={toastItem} />,
    [],
  );

  if (typeof window === "undefined") return null;

  return createPortal(
    <AriaToastRegion
      queue={toastQueue}
      aria-label="Notifications"
      data-slot="toast-region"
      style={{
        position: "fixed",
        zIndex: 9999,
        display: "flex",
        flexDirection: placement.startsWith("top")
          ? "column"
          : "column-reverse",
        gap: "var(--vita-toast-gap, 8px)",
        outline: "none",
        ...positionStyle,
      }}
    >
      {renderToast}
    </AriaToastRegion>,
    document.body,
  );
}

// ── Compound Export ─────────────────────────────────────────────────────────

export const Toast = {
  Provider: ToastProvider,
};

export { AriaToastQueue as ToastQueue };
