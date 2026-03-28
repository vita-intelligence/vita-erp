"use client";

/**
 * GeneralTab — basic field settings: ID, label, description, required, hidden.
 *
 * Validates field ID uniqueness using isIdUnique from schema-utils and
 * displays an inline warning when the entered ID collides with another element.
 */

import { useTranslations } from "next-intl";
import { ColorInput } from "@/components/theme-editor/modules/colors/ColorInput";
import { FieldError, Input, Label, TextField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getFieldMeta } from "../../shared/field-registry";
import { isIdUnique } from "../../shared/schema-utils";
import type { ConfigTabProps, FieldStyling } from "../../types";
import { BackgroundPicker } from "../BackgroundPicker";

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

      {/* Styling */}
      <StylingSection
        styling={field.styling}
        onUpdate={(s) => onUpdate({ styling: s })}
        t={t}
      />
    </div>
  );
}

// ── Styling Section ─────────────────────────────────────────────────────────

function StylingSection({
  styling,
  onUpdate,
  t,
}: {
  styling?: FieldStyling;
  onUpdate: (s: FieldStyling | undefined) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const s = styling ?? {};
  const hasAny = Object.values(s).some(Boolean);

  function patch(updates: Partial<FieldStyling>) {
    const next = { ...s, ...updates };
    for (const key of Object.keys(next) as (keyof FieldStyling)[]) {
      if (!next[key]) delete next[key];
    }
    onUpdate(Object.keys(next).length > 0 ? next : undefined);
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-vita-lg p-3"
      style={{
        border: "1px solid var(--vita-neutral-200)",
        background: "var(--vita-background)",
      }}
    >
      <p
        className="text-xs font-semibold"
        style={{ color: "var(--vita-text-primary)" }}
      >
        {t("config.general.styling")}
      </p>

      {/* Field wrapper styling */}
      <div className="flex flex-col gap-3">
        <p
          className="text-[11px] font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.general.stylingFieldSection")}
        </p>
        <BackgroundPicker
          label={t("config.general.stylingBg")}
          value={s.backgroundColor}
          onChange={(v) => patch({ backgroundColor: v })}
        />
        <ColorField
          label={t("config.general.stylingLabelColor")}
          value={s.labelColor}
          onChange={(v) => patch({ labelColor: v })}
        />
      </div>

      {/* Input element colors */}
      <div>
        <p
          className="mb-2 text-[11px] font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.general.stylingInputSection")}
        </p>
        <div className="flex flex-wrap gap-3">
          <ColorField
            label={t("config.general.stylingInputBg")}
            value={s.inputBgColor}
            onChange={(v) => patch({ inputBgColor: v })}
          />
          <ColorField
            label={t("config.general.stylingInputText")}
            value={s.inputTextColor}
            onChange={(v) => patch({ inputTextColor: v })}
          />
          <ColorField
            label={t("config.general.stylingInputBorder")}
            value={s.inputBorderColor}
            onChange={(v) => patch({ inputBorderColor: v })}
          />
        </div>
      </div>

      {/* Font controls */}
      <div className="flex gap-3">
        <div className="flex-1">
          <p
            className="mb-1 text-[11px]"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {t("config.general.stylingFontSize")}
          </p>
          <select
            className="w-full"
            style={{
              borderRadius: "var(--vita-input-radius)",
              borderWidth: "1px",
              borderStyle: "var(--vita-input-border-style, solid)",
              borderColor: "var(--vita-neutral-200)",
              background: "var(--vita-surface)",
              color: "var(--vita-text-primary)",
              paddingLeft: "var(--vita-input-padding-x, 12px)",
              paddingRight: "var(--vita-input-padding-x, 12px)",
              paddingTop: "var(--vita-input-padding-y, 8px)",
              paddingBottom: "var(--vita-input-padding-y, 8px)",
              fontSize: "var(--vita-input-font-size, 14px)",
            }}
            value={s.fontSize ?? ""}
            onChange={(e) => patch({ fontSize: e.target.value || undefined })}
          >
            <option value="">{t("config.general.stylingDefault")}</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
        </div>
        <div className="flex-1">
          <p
            className="mb-1 text-[11px]"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {t("config.general.stylingFontWeight")}
          </p>
          <select
            className="w-full"
            style={{
              borderRadius: "var(--vita-input-radius)",
              borderWidth: "1px",
              borderStyle: "var(--vita-input-border-style, solid)",
              borderColor: "var(--vita-neutral-200)",
              background: "var(--vita-surface)",
              color: "var(--vita-text-primary)",
              paddingLeft: "var(--vita-input-padding-x, 12px)",
              paddingRight: "var(--vita-input-padding-x, 12px)",
              paddingTop: "var(--vita-input-padding-y, 8px)",
              paddingBottom: "var(--vita-input-padding-y, 8px)",
              fontSize: "var(--vita-input-font-size, 14px)",
            }}
            value={s.fontWeight ?? ""}
            onChange={(e) => patch({ fontWeight: e.target.value || undefined })}
          >
            <option value="">{t("config.general.stylingDefault")}</option>
            <option value="normal">Normal</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>

      {/* Reset */}
      {hasAny && (
        <button
          type="button"
          className="self-start text-xs"
          style={{ color: "var(--vita-error)" }}
          onClick={() => onUpdate(undefined)}
        >
          {t("config.general.stylingReset")}
        </button>
      )}
    </div>
  );
}

// ── Color Field (uses HeroUI ColorPicker via ColorInput wrapper) ─────────────

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px]" style={{ color: "var(--vita-text-muted)" }}>
        {label}
      </p>
      {value ? (
        <div className="flex items-center gap-1.5">
          <ColorInput
            value={value}
            onChange={(hex) => onChange(hex)}
            title={label}
          />
          <span
            className="font-mono text-[10px]"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {value}
          </span>
          <button
            type="button"
            className="text-[10px]"
            style={{ color: "var(--vita-text-muted)" }}
            onClick={() => onChange(undefined)}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <ColorInput
            value="#808080"
            onChange={(hex) => onChange(hex)}
            title={label}
          />
          <span
            className="ml-1.5 text-[10px]"
            style={{ color: "var(--vita-text-muted)" }}
          >
            Set
          </span>
        </div>
      )}
    </div>
  );
}
