"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";

export function Preview() {
  const t = useTranslations("themeEditor");
  const [checked, setChecked] = useState<Set<string>>(
    new Set(["auto-reorder", "quality-hold"]),
  );

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const items = [
    { id: "auto-reorder", label: "Auto-reorder" },
    { id: "quality-hold", label: "Quality hold" },
    { id: "email-notifications", label: "Email notifications" },
    { id: "dark-mode", label: "Dark mode" },
    { id: "maintenance", label: "Maintenance mode", disabled: true },
  ];

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Switch
            key={item.id}
            isSelected={checked.has(item.id)}
            onChange={() => toggle(item.id)}
            isDisabled={item.disabled}
            className="flex"
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>{item.label}</Switch.Content>
          </Switch>
        ))}
      </div>
    </div>
  );
}
