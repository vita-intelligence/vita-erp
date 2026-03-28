"use client";

/**
 * OptionsTab — manages the options list for select_one / select_multiple fields.
 *
 * Each option has a value (machine-readable), label (display text),
 * and optional filterBy (for cascading selects).
 *
 * Also provides a "Choice filter" dropdown to link this field's options
 * to a parent select field for cascading behavior.
 */

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { collectFields } from "../../shared/schema-utils";
import type { ChoiceFilter, ConfigTabProps, SelectOption } from "../../types";

export function OptionsTab({ field, onUpdate, allElements }: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  const options: SelectOption[] = field.options ?? [];
  const hasFilter = field.choiceFilter !== undefined;

  // All select fields except the current one (for parent field dropdown)
  const selectFields = collectFields(allElements).filter(
    (f) =>
      f.id !== field.id &&
      (f.type === "select_one" || f.type === "select_multiple"),
  );

  function updateOption(index: number, patch: Partial<SelectOption>) {
    const next = options.map((opt, i) =>
      i === index ? { ...opt, ...patch } : opt,
    );
    onUpdate({ options: next });
  }

  function removeOption(index: number) {
    onUpdate({ options: options.filter((_, i) => i !== index) });
  }

  function addOption() {
    const next: SelectOption[] = [
      ...options,
      { value: "", label: "", filterBy: hasFilter ? "" : undefined },
    ];
    onUpdate({ options: next });
  }

  function moveOption(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= options.length) return;
    const next = [...options];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onUpdate({ options: next });
  }

  function setChoiceFilter(fieldId: string) {
    if (!fieldId) {
      // Remove filter — also clear filterBy from all options
      onUpdate({
        choiceFilter: undefined,
        options: options.map((opt) => ({ ...opt, filterBy: undefined })),
      });
    } else {
      onUpdate({ choiceFilter: { fieldId } as ChoiceFilter });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Choice filter — cascading select config */}
      {selectFields.length > 0 && (
        <div
          className="flex flex-col gap-3 rounded-vita-md p-3"
          style={{
            border: "1px solid var(--vita-neutral-200)",
            background: "var(--vita-background)",
          }}
        >
          <div className="flex flex-col gap-1">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("config.options.choiceFilter")}
            </p>
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {t("config.options.choiceFilterDescription")}
            </p>
          </div>

          <div>
            <p
              className="mb-1 text-[11px] font-medium"
              style={{ color: "var(--vita-text-secondary)" }}
            >
              {t("config.options.choiceFilterField")}
            </p>
            <select
              className="w-full rounded-vita-md border px-2 py-1.5 text-xs"
              style={{
                borderColor: "var(--vita-neutral-200)",
                background: "var(--vita-surface)",
                color: "var(--vita-text-primary)",
              }}
              value={field.choiceFilter?.fieldId ?? ""}
              onChange={(e) => setChoiceFilter(e.target.value)}
            >
              <option value="">{t("config.options.noFilter")}</option>
              {selectFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label} ({f.id})
                </option>
              ))}
            </select>
          </div>

          {hasFilter && (
            <div
              className="flex flex-col gap-2 rounded-vita-sm p-2.5"
              style={{
                background: "var(--vita-info-light, var(--vita-neutral-50))",
              }}
            >
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: "var(--vita-text-secondary)" }}
              >
                {t("config.options.choiceFilterHint")}
              </p>
              <p
                className="text-[11px] leading-relaxed italic"
                style={{ color: "var(--vita-text-muted)" }}
              >
                {t("config.options.choiceFilterExample")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Column headers */}
      {options.length > 0 && (
        <div className="flex items-center gap-2">
          {/* Spacer for reorder buttons */}
          <div className="w-4 shrink-0" />
          <span
            className="w-0 min-w-0 flex-1 text-[10px] font-medium"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {t("config.options.valuePlaceholder")}
          </span>
          <span
            className="w-0 min-w-0 flex-1 text-[10px] font-medium"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {t("config.options.labelPlaceholder")}
          </span>
          {hasFilter && (
            <span
              className="w-20 shrink-0 text-[10px] font-medium"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {t("config.options.filterByLabel")}
            </span>
          )}
          {/* Spacer for delete button */}
          <div className="w-6 shrink-0" />
        </div>
      )}

      {/* Option rows */}
      {options.length === 0 && (
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {t("config.options.empty")}
        </p>
      )}

      {options.map((opt, index) => (
        <div
          key={opt.value || `opt-${index}`}
          className="flex items-center gap-2"
        >
          {/* Reorder buttons */}
          <div className="flex shrink-0 flex-col gap-0.5">
            <button
              type="button"
              disabled={index === 0}
              className="flex h-4 w-4 items-center justify-center rounded-vita-sm transition-colors"
              style={{
                color:
                  index === 0
                    ? "var(--vita-neutral-300)"
                    : "var(--vita-text-muted)",
              }}
              onClick={() => moveOption(index, "up")}
              title={t("config.options.moveUp")}
            >
              <ChevronUp size={10} />
            </button>
            <button
              type="button"
              disabled={index === options.length - 1}
              className="flex h-4 w-4 items-center justify-center rounded-vita-sm transition-colors"
              style={{
                color:
                  index === options.length - 1
                    ? "var(--vita-neutral-300)"
                    : "var(--vita-text-muted)",
              }}
              onClick={() => moveOption(index, "down")}
              title={t("config.options.moveDown")}
            >
              <ChevronDown size={10} />
            </button>
          </div>

          {/* Value input */}
          <Input
            value={opt.value}
            onChange={(e) => updateOption(index, { value: e.target.value })}
            placeholder={t("config.options.valuePlaceholder")}
            className="w-0 min-w-0 flex-1"
          />

          {/* Label input */}
          <Input
            value={opt.label}
            onChange={(e) => updateOption(index, { label: e.target.value })}
            placeholder={t("config.options.labelPlaceholder")}
            className="w-0 min-w-0 flex-1"
          />

          {/* Filter by input (only when choice filter is active) */}
          {hasFilter && (
            <Input
              value={opt.filterBy ?? ""}
              onChange={(e) =>
                updateOption(index, { filterBy: e.target.value || undefined })
              }
              placeholder={t("config.options.filterByPlaceholder")}
              className="w-20 shrink-0"
            />
          )}

          {/* Remove button */}
          <button
            type="button"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-vita-sm transition-colors"
            style={{ color: "var(--vita-error)" }}
            onClick={() => removeOption(index)}
            title={t("config.options.remove")}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}

      {/* Add option button */}
      <Button
        variant="outline"
        size="sm"
        onPress={addOption}
        className="self-start"
      >
        <Plus size={12} />
        {t("config.options.add")}
      </Button>
    </div>
  );
}
