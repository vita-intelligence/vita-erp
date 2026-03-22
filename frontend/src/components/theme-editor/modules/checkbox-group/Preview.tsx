"use client";

/**
 * Live checkbox group preview — uses real HeroUI CheckboxGroup and
 * Checkbox so CSS tokens apply automatically.
 */

import { Label } from "@heroui/react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/checkbox-group";

// ── Sample data ──────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { value: "production", label: "Production" },
  { value: "quality", label: "Quality Control" },
  { value: "warehouse", label: "Warehouse" },
  { value: "shipping", label: "Shipping" },
  { value: "maintenance", label: "Maintenance" },
];

const PERMISSIONS = [
  { value: "read", label: "View records" },
  { value: "write", label: "Edit records" },
  { value: "delete", label: "Delete records" },
  { value: "export", label: "Export data" },
];

export function Preview() {
  const [depts, setDepts] = useState(["production", "quality"]);
  const [perms, setPerms] = useState(["read", "write"]);

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        Live preview
      </p>

      <div className="space-y-5">
        {/* Vertical group */}
        <CheckboxGroup
          value={depts}
          onChange={setDepts}
          aria-label="Departments"
        >
          <Label>Departments</Label>
          {DEPARTMENTS.map((d) => (
            <Checkbox key={d.value} value={d.value}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label>{d.label}</Label>
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
          <Label>Permissions</Label>
          {PERMISSIONS.map((p) => (
            <Checkbox key={p.value} value={p.value}>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <Checkbox.Content>
                <Label>{p.label}</Label>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
}
