"use client";

/**
 * Org layout — wraps all organization-scoped pages.
 *
 * Sits inside AppLayout (AuthGuard) and adds OrgGuard on top.
 * Guard chain: AuthGuard → OrgGuard → children
 *
 * Applies theme background and text colors so all org pages
 * inherit the active theme automatically.
 */

import { EditorMount } from "@/components/theme-editor";

import OrgGuard from "./_components/OrgGuard";

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrgGuard>
      <div
        className="min-h-screen text-vita-text-secondary"
        style={{ backgroundColor: "var(--vita-background)" }}
      >
        {children}
      </div>
      <EditorMount />
    </OrgGuard>
  );
}
