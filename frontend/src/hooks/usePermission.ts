"use client";

/**
 * usePermission — RBAC check hook.
 *
 * Returns true if the current user has the given module:action permission
 * in the active organization. Owner role short-circuits to true for every
 * check. Returns false while permissions are still loading — callers should
 * assume "no access" until proven otherwise to avoid flashing edit UIs.
 *
 * @example
 *   const canEdit = usePermission("company_settings", "write");
 *   <Button isDisabled={!canEdit}>Save</Button>
 */

import { useOrgStore } from "@/stores/organization";

export function usePermission(module: string, action: string): boolean {
  return useOrgStore((s) => {
    const p = s.permissions;
    if (!p) return false;
    if (p.is_owner) return true;
    return p.permissions[module]?.includes(action) ?? false;
  });
}

/**
 * usePermissionsLoaded — true once permissions have been fetched for the
 * active org. Use this to distinguish "loading" from "denied" states.
 */
export function usePermissionsLoaded(): boolean {
  return useOrgStore((s) => s.permissions !== null);
}
