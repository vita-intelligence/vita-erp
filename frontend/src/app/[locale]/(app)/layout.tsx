"use client";

/**
 * App layout — wraps all authenticated pages.
 *
 * Responsibilities:
 * 1. Auth guard — redirects to /login if not authenticated
 * 2. Future: sidebar + topbar + notification system
 *
 * The sidebar/topbar will be added when the organization system is built.
 * For now, this is a minimal wrapper that ensures auth state.
 */

import AuthGuard from "./_components/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
