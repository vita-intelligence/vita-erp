"use client";

/**
 * Org layout — wraps all organization-scoped pages.
 *
 * Sits inside AppLayout (AuthGuard) and adds OrgGuard on top.
 * Guard chain: AuthGuard → OrgGuard → children
 *
 * Future: sidebar + topbar + notification system will live here.
 */

import OrgGuard from "./_components/OrgGuard";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return <OrgGuard>{children}</OrgGuard>;
}
