"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  Tabs,
} from "@/components/ui/tabs";

import { useRoleDetail, useSetRolePermissions, useUpdateRole } from "../hooks";
import type { RolePermissionEntry } from "../types";
import MemberList from "./MemberList";
import PermissionsGrid from "./PermissionsGrid";

type Props = {
  roleId: string;
  isReadOnly: boolean;
  onClose: () => void;
};

/**
 * Slide-in panel for role details: name, description, permissions, members.
 */
export default function RoleDetailPanel({
  roleId,
  isReadOnly,
  onClose,
}: Props) {
  const t = useTranslations("organogram");
  const { data: role, isLoading } = useRoleDetail(roleId);
  const updateMutation = useUpdateRole();
  const permsMutation = useSetRolePermissions();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
    }
  }, [role]);

  const handleNameBlur = useCallback(() => {
    if (!role || name.trim() === role.name) return;
    updateMutation.mutate({ id: roleId, name: name.trim() });
  }, [role, name, roleId, updateMutation]);

  const handleDescriptionBlur = useCallback(() => {
    if (!role || description === role.description) return;
    updateMutation.mutate({ id: roleId, description });
  }, [role, description, roleId, updateMutation]);

  const handlePermissionsChange = useCallback(
    (updated: RolePermissionEntry[]) => {
      permsMutation.mutate({ roleId, permissions: updated });
    },
    [roleId, permsMutation],
  );

  const isSystemRole = role?.is_system ?? false;
  const fieldsDisabled = isReadOnly || isSystemRole;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,
        maxWidth: "100vw",
        background: "var(--vita-surface)",
        borderLeft: "1px solid var(--vita-border)",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid var(--vita-border)",
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--vita-text-primary)",
            margin: 0,
          }}
        >
          {t("panel.title")}
        </h2>
        <button
          type="button"
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            padding: 4,
            border: "none",
            background: "transparent",
            color: "var(--vita-text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
        }}
      >
        {isLoading || !role ? (
          <p style={{ color: "var(--vita-text-muted)", fontSize: 13 }}>
            {t("panel.loading")}
          </p>
        ) : (
          <>
            {/* Name field */}
            <div style={{ marginBottom: 12 }}>
              <label
                htmlFor="role-name-input"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--vita-text-muted)",
                  marginBottom: 4,
                }}
              >
                {t("panel.name")}
              </label>
              <input
                id="role-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                disabled={fieldsDisabled}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--vita-border)",
                  background: fieldsDisabled
                    ? "var(--vita-background)"
                    : "transparent",
                  color: "var(--vita-text-primary)",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            {/* Description field */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="role-description-input"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--vita-text-muted)",
                  marginBottom: 4,
                }}
              >
                {t("panel.description")}
              </label>
              <textarea
                id="role-description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                disabled={isReadOnly}
                rows={2}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--vita-border)",
                  background: isReadOnly
                    ? "var(--vita-background)"
                    : "transparent",
                  color: "var(--vita-text-primary)",
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Tabs: Permissions / Members */}
            <Tabs defaultSelectedKey="permissions">
              <TabList aria-label="Role detail tabs">
                <Tab id="permissions">
                  {t("panel.permissions")}
                  <TabIndicator />
                </Tab>
                <Tab id="members">
                  {t("panel.members")}
                  <TabIndicator />
                </Tab>
              </TabList>

              <TabPanel id="permissions">
                <div style={{ paddingTop: 12 }}>
                  {isSystemRole && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--vita-text-muted)",
                        marginBottom: 12,
                        fontStyle: "italic",
                      }}
                    >
                      {t("panel.systemFullAccess")}
                    </p>
                  )}
                  <PermissionsGrid
                    permissions={role.permissions}
                    onChange={handlePermissionsChange}
                    isDisabled={isReadOnly || isSystemRole}
                    isSystemRole={isSystemRole}
                  />
                </div>
              </TabPanel>

              <TabPanel id="members">
                <div style={{ paddingTop: 12 }}>
                  <MemberList
                    roleId={roleId}
                    members={role.members}
                    isDisabled={isReadOnly}
                  />
                </div>
              </TabPanel>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
