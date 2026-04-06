"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useTranslations } from "next-intl";

import { Spinner } from "@/components/ui/spinner";
import { usePermission, usePermissionsLoaded } from "@/hooks/usePermission";

import OrganogramCanvas from "./OrganogramCanvas";

export type OrganogramProps = {
  readOnly?: boolean;
};

/**
 * Public organogram component — gates rendering on RBAC permissions.
 *
 * - No `organogram:read` → renders nothing
 * - Has `organogram:read` but not `write` → read-only canvas
 * - Has `organogram:write` → full editor
 * - `readOnly` prop can force read-only regardless of permissions
 */
export function Organogram({ readOnly: forceReadOnly }: OrganogramProps) {
  const t = useTranslations("organogram");
  const permissionsLoaded = usePermissionsLoaded();
  const canRead = usePermission("organogram", "read");
  const canWrite = usePermission("organogram", "write");

  if (!permissionsLoaded) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!canRead) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          color: "var(--vita-text-muted)",
          fontSize: 14,
        }}
      >
        {t("noPermission")}
      </div>
    );
  }

  const isReadOnly = forceReadOnly ?? !canWrite;

  return (
    <div
      style={{ width: "100%", height: "calc(100vh - 240px)", minHeight: 500 }}
    >
      <ReactFlowProvider>
        <OrganogramCanvas readOnly={isReadOnly} />
      </ReactFlowProvider>
    </div>
  );
}
