"use client";

/**
 * OptionsTab — manages the options list for select_one / select_multiple fields.
 *
 * Each option has a value (machine-readable) and label (display text).
 * Supports reordering via up/down buttons and inline add/remove controls.
 */

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { ConfigTabProps, SelectOption } from "../../types";

export function OptionsTab({ field, onUpdate }: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  const options: SelectOption[] = field.options ?? [];

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
    const next: SelectOption[] = [...options, { value: "", label: "" }];
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

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <p
        className="text-xs font-medium"
        style={{ color: "var(--vita-text-secondary)" }}
      >
        {t("config.options.heading")}
      </p>

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
