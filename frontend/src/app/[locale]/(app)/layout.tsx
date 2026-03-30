"use client";

/**
 * App layout — wraps all authenticated pages.
 *
 * Guard chain:
 * 1. AuthGuard — redirects to /login if not authenticated, blocks if unverified
 * 2. (org)/layout.tsx → OrgGuard — handles org selection/creation
 *
 * Pages outside (org)/ (create-organization, select-organization) only
 * need auth — they are accessible without an org context.
 */

import AuthGuard from "./_components/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
