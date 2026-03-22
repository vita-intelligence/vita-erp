"use client";

/**
 * Live checkbox preview — uses real HeroUI Checkbox so CSS tokens
 * from checkbox.css apply automatically.
 */

import { Label } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

// ── Sample items ─────────────────────────────────────────────────────────────

const ITEMS = [
  { id: "raw-materials", labelKey: "rawMaterials" },
  { id: "quality-check", labelKey: "qualityCheck" },
  { id: "shipping-label", labelKey: "shippingLabel" },
  { id: "docs-attached", labelKey: "docsAttached" },
  { id: "supervisor-sign", labelKey: "supervisorSignOff", disabled: true },
];

export function Preview() {
  const t = useTranslations("themeEditor");
  const [checked, setChecked] = useState<Set<string>>(
    new Set(["raw-materials", "quality-check"]),
  );

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <div className="space-y-2.5">
        {ITEMS.map((item) => (
          <Checkbox
            key={item.id}
            isSelected={checked.has(item.id)}
            onChange={() => toggle(item.id)}
            isDisabled={item.disabled}
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label>{t(`preview.checkbox.${item.labelKey}`)}</Label>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </div>

      {/* Indeterminate example */}
      <div
        style={{
          borderTop: "1px solid var(--vita-neutral-200)",
          paddingTop: "0.75rem",
        }}
      >
        <p className="mb-2 text-xs text-vita-text-muted">
          {t("preview.indeterminate")}
        </p>
        <Checkbox
          isSelected={checked.size === ITEMS.length}
          isIndeterminate={checked.size > 0 && checked.size < ITEMS.length}
          onChange={() => {
            if (checked.size === ITEMS.length) {
              setChecked(new Set());
            } else {
              setChecked(new Set(ITEMS.map((i) => i.id)));
            }
          }}
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label>{t("preview.selectAll")}</Label>
          </Checkbox.Content>
        </Checkbox>
      </div>
    </div>
  );
}
