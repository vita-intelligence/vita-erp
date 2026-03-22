"use client";

/**
 * Live checkbox group preview — uses real HeroUI CheckboxGroup and
 * Checkbox so CSS tokens apply automatically.
 */

import { Label } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/checkbox-group";

// ── Sample data ──────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { value: "production", labelKey: "production" },
  { value: "quality", labelKey: "qualityControl" },
  { value: "warehouse", labelKey: "warehouse" },
  { value: "shipping", labelKey: "shipping" },
  { value: "maintenance", labelKey: "maintenance" },
];

const PERMISSIONS = [
  { value: "read", labelKey: "viewRecords" },
  { value: "write", labelKey: "editRecords" },
  { value: "delete", labelKey: "deleteRecords" },
  { value: "export", labelKey: "exportData" },
];

export function Preview() {
  const t = useTranslations("themeEditor");
  const [depts, setDepts] = useState(["production", "quality"]);
  const [perms, setPerms] = useState(["read", "write"]);

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <div className="space-y-5">
        {/* Vertical group */}
        <CheckboxGroup
          value={depts}
          onChange={setDepts}
          aria-label="Departments"
        >
          <Label>{t("preview.departments")}</Label>
          {DEPARTMENTS.map((d) => (
            <Checkbox key={d.value} value={d.value}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label>{t(`preview.checkboxGroup.${d.labelKey}`)}</Label>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </CheckboxGroup>

        {/* Horizontal group */}
        <CheckboxGroup
          value={perms}
          onChange={setPerms}
          aria-label="Permissions"
          className="flex-row flex-wrap"
        >
          <Label>{t("preview.permissions")}</Label>
          {PERMISSIONS.map((p) => (
            <Checkbox key={p.value} value={p.value}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label>{t(`preview.checkboxGroup.${p.labelKey}`)}</Label>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
}
