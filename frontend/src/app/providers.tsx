"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ToastVariants } from "@/components/ui/toast";
import { ToastProvider } from "@/components/ui/toast";
import { useThemeStore } from "@/stores/theme";

// ---------------------------------------------------------------------------
// TanStack Query
// ---------------------------------------------------------------------------

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// ---------------------------------------------------------------------------
// Theme
// Applies the persisted theme from localStorage to the DOM before first paint.
// Uses useEffect so it runs client-side only (after Zustand hydration).
// ---------------------------------------------------------------------------

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const applyTheme = useThemeStore((state) => state.applyTheme);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return <>{children}</>;
}

// ---------------------------------------------------------------------------
// Toast — reads placement from theme token
// ---------------------------------------------------------------------------

const VALID_PLACEMENTS = new Set([
  "top",
  "top start",
  "top end",
  "bottom",
  "bottom start",
  "bottom end",
]);

function ToastProviderWithPlacement() {
  const tokens = useThemeStore((state) => state.tokens);
  const placement = VALID_PLACEMENTS.has(tokens.toastPlacement)
    ? (tokens.toastPlacement as ToastVariants["placement"])
    : ("bottom end" as ToastVariants["placement"]);

  return <ToastProvider placement={placement} />;
}

// ---------------------------------------------------------------------------
// Root provider
// ---------------------------------------------------------------------------

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <ToastProviderWithPlacement />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
