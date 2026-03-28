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

import { getFieldMeta } from "../../shared/field-registry";
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

      {/* Default value — only for input fields */}
      {getFieldMeta(field.type).isInput &&
        field.type !== "file" &&
        field.type !== "image" &&
        field.type !== "signature" && (
          <TextField>
            <Label>{t("config.general.defaultValue")}</Label>
            <Input
              type={
                field.type === "integer" || field.type === "decimal"
                  ? "number"
                  : field.type === "date"
                    ? "date"
                    : field.type === "time"
                      ? "time"
                      : field.type === "datetime"
                        ? "datetime-local"
                        : "text"
              }
              value={
                field.defaultValue !== undefined
                  ? String(field.defaultValue)
                  : ""
              }
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  onUpdate({ defaultValue: undefined });
                  return;
                }
                if (field.type === "integer") {
                  onUpdate({ defaultValue: Number.parseInt(raw, 10) });
                } else if (field.type === "decimal") {
                  onUpdate({ defaultValue: Number.parseFloat(raw) });
                } else {
                  onUpdate({ defaultValue: raw });
                }
              }}
              placeholder={t("config.general.defaultValuePlaceholder")}
            />
          </TextField>
        )}

      {/* Appearance — only if the field type has multiple options */}
      {getFieldMeta(field.type).appearances.length > 1 && (
        <div>
          <p
            className="mb-1 text-xs font-medium"
            style={{ color: "var(--vita-text-secondary)" }}
          >
            {t("config.general.appearance")}
          </p>
          <div className="flex flex-wrap gap-2">
            {getFieldMeta(field.type).appearances.map((app) => {
              const isActive = (field.appearance ?? "default") === app;
              return (
                <button
                  key={app}
                  type="button"
                  className="rounded-vita-md px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    border: `1px solid ${isActive ? "var(--vita-primary)" : "var(--vita-neutral-200)"}`,
                    background: isActive
                      ? "var(--vita-primary)"
                      : "var(--vita-background)",
                    color: isActive
                      ? "var(--vita-text-on-primary, #fff)"
                      : "var(--vita-text-primary)",
                  }}
                  onClick={() =>
                    onUpdate({
                      appearance: app === "default" ? undefined : app,
                    })
                  }
                >
                  {t(`config.general.appearances.${app}`)}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
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
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </div>
    </div>
  );
}
