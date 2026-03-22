"use client";

/**
 * GeneralTab — basic field settings: ID, label, description, required, hidden.
 *
 * Validates field ID uniqueness using isIdUnique from schema-utils and
 * displays an inline warning when the entered ID collides with another element.
 */

import { useTranslations } from "next-intl";

import { FieldError, Input, Label, TextField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { isIdUnique } from "../../shared/schema-utils";
import type { ConfigTabProps } from "../../types";

export function GeneralTab({ field, onUpdate, allElements }: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  // Check uniqueness excluding the field's own original ID
  const idDuplicate =
    field.id.trim() !== "" && !isIdUnique(field.id, allElements, field.id);

  return (
    <div className="flex flex-col gap-5">
      {/* Field ID */}
      <TextField isInvalid={idDuplicate}>
        <Label>{t("config.general.fieldId")}</Label>
        <Input
          value={field.id}
          onChange={(e) => onUpdate({ id: e.target.value })}
        />
        {idDuplicate && (
          <FieldError>{t("config.general.duplicateIdWarning")}</FieldError>
        )}
      </TextField>

      {/* Label */}
      <TextField>
        <Label>{t("config.general.label")}</Label>
        <Input
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </TextField>

      {/* Description */}
      <TextField>
        <Label>{t("config.general.description")}</Label>
        <Input
          value={field.description ?? ""}
          onChange={(e) =>
            onUpdate({ description: e.target.value || undefined })
          }
          placeholder={t("config.general.descriptionPlaceholder")}
        />
      </TextField>

      {/* Required toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {t("config.general.required")}
          </span>
          <span className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
            {t("config.general.requiredHint")}
          </span>
        </div>
        <Switch
          isSelected={field.required}
          onChange={() => onUpdate({ required: !field.required })}
          size="sm"
        />
      </div>

      {/* Hidden toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {t("config.general.hidden")}
          </span>
          <span className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
            {t("config.general.hiddenHint")}
          </span>
        </div>
        <Switch
          isSelected={field.hidden}
          onChange={() => onUpdate({ hidden: !field.hidden })}
          size="sm"
        />
      </div>
    </div>
  );
}
