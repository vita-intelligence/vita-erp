"use client";

/**
 * FieldConfigModal — modal for editing field settings.
 *
 * Contains tabs: General, Options (select types), Validation, Conditions,
 * Calculate (calculate type). Each tab is a separate component following
 * the ConfigTabProps interface.
 */

import { useTranslations } from "next-intl";
import { useState } from "react";
import { getFieldMeta } from "../shared/field-registry";
import type { FieldElement, FormElement } from "../types";
import { CalculateTab } from "./FieldConfigTabs/CalculateTab";
import { ConditionsTab } from "./FieldConfigTabs/ConditionsTab";
import { GeneralTab } from "./FieldConfigTabs/GeneralTab";
import { OptionsTab } from "./FieldConfigTabs/OptionsTab";
import { TranslationsTab } from "./FieldConfigTabs/TranslationsTab";
import { ValidationTab } from "./FieldConfigTabs/ValidationTab";

type FieldConfigModalProps = {
  field: FieldElement;
  allElements: FormElement[];
  onSave: (updated: FieldElement) => void;
  onClose: () => void;
};

type TabId =
  | "general"
  | "options"
  | "validation"
  | "conditions"
  | "calculate"
  | "translations";

export function FieldConfigModal({
  field: initialField,
  allElements,
  onSave,
  onClose,
}: FieldConfigModalProps) {
  const t = useTranslations("formConstructor");
  const [field, setField] = useState<FieldElement>({ ...initialField });
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const meta = getFieldMeta(field.type);

  // Determine which tabs to show
  const allTabs: { id: TabId; label: string; show: boolean }[] = [
    { id: "general", label: t("config.tabs.general"), show: true },
    { id: "options", label: t("config.tabs.options"), show: meta.hasOptions },
    {
      id: "validation",
      label: t("config.tabs.validation"),
      show: meta.isInput,
    },
    { id: "conditions", label: t("config.tabs.conditions"), show: true },
    {
      id: "calculate",
      label: t("config.tabs.calculate"),
      show: meta.hasCalculate,
    },
    {
      id: "translations",
      label: t("config.tabs.translations"),
      show: true,
    },
  ];
  const tabs = allTabs.filter((tab) => tab.show);

  function handleUpdate(patch: Partial<FieldElement>) {
    setField((prev) => ({ ...prev, ...patch }));
  }

  function handleSave() {
    onSave(field);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.4)" }}
    >
      <div
        className="flex flex-col rounded-vita-xl shadow-lg"
        style={{
          background: "var(--vita-surface)",
          border: "1px solid var(--vita-neutral-200)",
          width: "min(580px, 92vw)",
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div
          className="shrink-0 border-b px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {t("config.title")} — {field.label || t(`fields.${meta.i18nKey}`)}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex shrink-0 gap-1 border-b px-6"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="relative px-3 py-2.5 text-xs font-medium transition-colors"
              style={{
                color:
                  activeTab === tab.id
                    ? "var(--vita-primary)"
                    : "var(--vita-text-muted)",
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--vita-primary)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "general" && (
            <GeneralTab
              field={field}
              onUpdate={handleUpdate}
              allElements={allElements}
            />
          )}
          {activeTab === "options" && (
            <OptionsTab
              field={field}
              onUpdate={handleUpdate}
              allElements={allElements}
            />
          )}
          {activeTab === "validation" && (
            <ValidationTab
              field={field}
              onUpdate={handleUpdate}
              allElements={allElements}
            />
          )}
          {activeTab === "conditions" && (
            <ConditionsTab
              field={field}
              onUpdate={handleUpdate}
              allElements={allElements}
            />
          )}
          {activeTab === "calculate" && (
            <CalculateTab
              field={field}
              onUpdate={handleUpdate}
              allElements={allElements}
            />
          )}
          {activeTab === "translations" && (
            <TranslationsTab
              field={field}
              onUpdate={handleUpdate}
              allElements={allElements}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex shrink-0 justify-end gap-2 border-t px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <button
            type="button"
            className="rounded-vita-md px-4 py-2 text-xs font-medium"
            style={{
              color: "var(--vita-text-secondary)",
              border: "1px solid var(--vita-neutral-200)",
            }}
            onClick={onClose}
          >
            {t("config.cancel")}
          </button>
          <button
            type="button"
            className="rounded-vita-md px-4 py-2 text-xs font-medium"
            style={{
              background: "var(--vita-primary)",
              color: "var(--vita-text-on-primary)",
            }}
            onClick={handleSave}
          >
            {t("config.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
