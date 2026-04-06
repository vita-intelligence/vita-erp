"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { Checkbox } from "@/components/ui/checkbox";

import { ACTION_CODES, MODULE_CODES } from "../constants";
import type { RolePermissionEntry } from "../types";

type Props = {
  permissions: RolePermissionEntry[];
  onChange: (updated: RolePermissionEntry[]) => void;
  isDisabled: boolean;
  isSystemRole: boolean;
};

/**
 * Module × action checkbox matrix for role permission management.
 */
export default function PermissionsGrid({
  permissions,
  onChange,
  isDisabled,
  isSystemRole,
}: Props) {
  const t = useTranslations("organogram");
  const hasPermission = useCallback(
    (module: string, action: string) => {
      // System roles (Owner) have implicit full access
      if (isSystemRole) return true;
      return permissions.some(
        (p) => p.module_code === module && p.action === action,
      );
    },
    [permissions, isSystemRole],
  );

  const toggle = useCallback(
    (module: string, action: string) => {
      const exists = hasPermission(module, action);
      const updated = exists
        ? permissions.filter(
            (p) => !(p.module_code === module && p.action === action),
          )
        : [...permissions, { module_code: module, action }];
      onChange(updated);
    },
    [permissions, hasPermission, onChange],
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "8px 12px",
                borderBottom: "1px solid var(--vita-border)",
                color: "var(--vita-text-muted)",
                fontWeight: 500,
              }}
            >
              {t("grid.module")}
            </th>
            {ACTION_CODES.map((action) => (
              <th
                key={action}
                style={{
                  textAlign: "center",
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--vita-border)",
                  color: "var(--vita-text-muted)",
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {t(`actions.${action}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MODULE_CODES.map((module) => (
            <tr key={module}>
              <td
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid var(--vita-border)",
                  color: "var(--vita-text-primary)",
                }}
              >
                {t(`modules.${module}`)}
              </td>
              {ACTION_CODES.map((action) => (
                <td
                  key={action}
                  style={{
                    textAlign: "center",
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--vita-border)",
                  }}
                >
                  <Checkbox
                    isSelected={hasPermission(module, action)}
                    onChange={() => toggle(module, action)}
                    isDisabled={isDisabled}
                    aria-label={`${module} ${action}`}
                  >
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
