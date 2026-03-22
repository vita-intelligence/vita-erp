"use client";

/**
 * AddFieldModal — modal for adding a new field.
 *
 * Shows a label input and a grid of field types grouped by category.
 * User enters a label, picks a type, then clicks "Configure..." to add.
 */

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FIELD_REGISTRY } from "../shared/field-registry";
import type { FieldType } from "../types";

type AddFieldModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (type: FieldType, label: string) => void;
};

export function AddFieldModal({ open, onClose, onAdd }: AddFieldModalProps) {
  const t = useTranslations("formConstructor");
  const [label, setLabel] = useState("");
  const [selectedType, setSelectedType] = useState<FieldType | null>(null);

  if (!open) return null;

  function handleAdd() {
    if (!selectedType || !label.trim()) return;
    onAdd(selectedType, label.trim());
    setLabel("");
    setSelectedType(null);
  }

  function handleClose() {
    setLabel("");
    setSelectedType(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.4)" }}
    >
      <div
        className="rounded-vita-xl shadow-lg"
        style={{
          background: "var(--vita-surface)",
          border: "1px solid var(--vita-neutral-200)",
          width: "min(560px, 92vw)",
          maxHeight: "85vh",
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          className="border-b px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {t("addField.title")}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Label input */}
          <div>
            <p
              className="mb-2 text-xs font-medium"
              style={{ color: "var(--vita-text-secondary)" }}
            >
              {t("addField.labelPrompt")}
            </p>
            <Input
              placeholder={t("addField.labelPlaceholder")}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Field type grid */}
          <div>
            <p
              className="mb-3 text-xs font-medium"
              style={{ color: "var(--vita-text-secondary)" }}
            >
              {t("addField.typePrompt")}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {FIELD_REGISTRY.map((meta) => {
                const Icon = meta.icon;
                const isSelected = selectedType === meta.type;
                return (
                  <button
                    key={meta.type}
                    type="button"
                    className="flex items-center gap-2 rounded-vita-md border px-3 py-2 text-left text-xs transition-colors"
                    style={{
                      borderColor: isSelected
                        ? "var(--vita-primary)"
                        : "var(--vita-neutral-200)",
                      background: isSelected
                        ? "var(--vita-primary)"
                        : "var(--vita-background)",
                      color: isSelected
                        ? "var(--vita-text-on-primary)"
                        : "var(--vita-text-secondary)",
                    }}
                    onClick={() => setSelectedType(meta.type)}
                  >
                    <Icon size={14} className="shrink-0" />
                    <span className="truncate">
                      {t(`fields.${meta.i18nKey}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-2 border-t px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <Button size="sm" variant="outline" onPress={handleClose}>
            {t("addField.cancel")}
          </Button>
          <Button
            size="sm"
            variant="primary"
            isDisabled={!selectedType || !label.trim()}
            onPress={handleAdd}
          >
            {t("addField.configure")}
          </Button>
        </div>
      </div>
    </div>
  );
}
