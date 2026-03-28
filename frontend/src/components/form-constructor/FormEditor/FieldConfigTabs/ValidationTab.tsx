"use client";

/**
 * ValidationTab — validation settings for input fields.
 *
 * Sections:
 *   1. Value constraints (min/max for numbers, minLength/maxLength for text)
 *   2. Regex validation (hard/soft mode)
 *   3. Custom constraint expression (cross-field, complex logic)
 */

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input, Label, TextField } from "@/components/ui/input";

import type {
  ConfigTabProps,
  CustomConstraintRule,
  FieldConstraints,
  RegexRule,
} from "../../types";

export function ValidationTab({ field, onUpdate }: ConfigTabProps) {
  const t = useTranslations("formConstructor");
  const c = field.constraints;
  const isNumber = field.type === "integer" || field.type === "decimal";
  const isText = field.type === "text";

  // ── Constraints helpers ───────────────────────────────────────────────────

  function updateConstraints(patch: Partial<FieldConstraints>) {
    onUpdate({ constraints: { ...c, ...patch } });
  }

  function updateCustomRule(patch: Partial<CustomConstraintRule>) {
    const existing = c?.customRule ?? {
      expression: "",
      message: "",
      mode: "hard" as const,
    };
    updateConstraints({ customRule: { ...existing, ...patch } });
  }

  function removeCustomRule() {
    updateConstraints({ customRule: undefined });
  }

  // ── Regex helpers ─────────────────────────────────────────────────────────

  const hasRegex = field.regex !== undefined;

  function addRegex() {
    onUpdate({ regex: { pattern: "", mode: "hard", message: "" } });
  }

  function removeRegex() {
    onUpdate({ regex: undefined });
  }

  function updateRegex(patch: Partial<RegexRule>) {
    if (!field.regex) return;
    onUpdate({ regex: { ...field.regex, ...patch } });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* ── Value / Length Constraints ───────────────────────────────────── */}
      {(isNumber || isText) && (
        <div className="flex flex-col gap-3">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {isNumber
              ? t("config.validation.valueRange")
              : t("config.validation.lengthRange")}
          </span>

          <div className="flex gap-3">
            <div className="flex-1">
              <TextField>
                <Label>
                  {isNumber
                    ? t("config.validation.minValue")
                    : t("config.validation.minLengthLabel")}
                </Label>
                <Input
                  type="number"
                  value={
                    isNumber
                      ? c?.min !== undefined
                        ? String(c.min)
                        : ""
                      : c?.minLength !== undefined
                        ? String(c.minLength)
                        : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (isNumber) {
                      updateConstraints({
                        min: raw ? Number(raw) : undefined,
                      });
                    } else {
                      updateConstraints({
                        minLength: raw ? Number(raw) : undefined,
                      });
                    }
                  }}
                  placeholder={t("config.validation.noLimit")}
                />
              </TextField>
            </div>
            <div className="flex-1">
              <TextField>
                <Label>
                  {isNumber
                    ? t("config.validation.maxValue")
                    : t("config.validation.maxLengthLabel")}
                </Label>
                <Input
                  type="number"
                  value={
                    isNumber
                      ? c?.max !== undefined
                        ? String(c.max)
                        : ""
                      : c?.maxLength !== undefined
                        ? String(c.maxLength)
                        : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (isNumber) {
                      updateConstraints({
                        max: raw ? Number(raw) : undefined,
                      });
                    } else {
                      updateConstraints({
                        maxLength: raw ? Number(raw) : undefined,
                      });
                    }
                  }}
                  placeholder={t("config.validation.noLimit")}
                />
              </TextField>
            </div>
          </div>
        </div>
      )}

      {/* ── Regex Validation ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--vita-text-primary)" }}
        >
          {t("config.validation.title")}
        </span>

        {!hasRegex ? (
          <div className="flex items-center gap-3">
            <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
              {t("config.validation.noRule")}
            </p>
            <Button variant="outline" size="sm" onPress={addRegex}>
              {t("config.validation.addRegex")}
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-3 rounded-vita-md p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            <TextField>
              <Label>{t("config.validation.pattern")}</Label>
              <Input
                value={field.regex?.pattern}
                onChange={(e) => updateRegex({ pattern: e.target.value })}
                placeholder={t("config.validation.patternPlaceholder")}
                className="font-mono"
              />
            </TextField>

            {/* Mode toggle */}
            <div className="flex gap-2">
              <ModeButton
                active={field.regex?.mode === "hard"}
                label={t("config.validation.modeHard")}
                desc={t("config.validation.modeHardDesc")}
                onClick={() => updateRegex({ mode: "hard" })}
              />
              <ModeButton
                active={field.regex?.mode === "soft"}
                label={t("config.validation.modeSoft")}
                desc={t("config.validation.modeSoftDesc")}
                onClick={() => updateRegex({ mode: "soft" })}
              />
            </div>

            <TextField>
              <Label>{t("config.validation.message")}</Label>
              <Input
                value={field.regex?.message}
                onChange={(e) => updateRegex({ message: e.target.value })}
                placeholder={t("config.validation.messagePlaceholder")}
              />
            </TextField>

            <Button
              variant="ghost"
              size="sm"
              onPress={removeRegex}
              className="self-start text-[var(--vita-error)]"
            >
              {t("config.validation.removeRegex")}
            </Button>
          </div>
        )}
      </div>

      {/* ── Custom Constraint Expression ─────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--vita-text-primary)" }}
        >
          {t("config.validation.customConstraint")}
        </span>

        {!c?.customRule ? (
          <div className="flex items-center gap-3">
            <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
              {t("config.validation.noCustomRule")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onPress={() =>
                updateCustomRule({
                  expression: "",
                  message: "",
                  mode: "hard",
                })
              }
            >
              {t("config.validation.addCustomRule")}
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col gap-3 rounded-vita-md p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            <TextField>
              <Label>{t("config.validation.customExpression")}</Label>
              <Input
                value={c.customRule.expression}
                onChange={(e) =>
                  updateCustomRule({ expression: e.target.value })
                }
                placeholder={t("config.validation.customExpressionPlaceholder")}
                className="font-mono"
              />
            </TextField>

            <div
              className="rounded-vita-sm p-2"
              style={{
                background: "var(--vita-info-light, var(--vita-neutral-50))",
              }}
            >
              <p
                className="text-[11px]"
                style={{ color: "var(--vita-text-muted)" }}
              >
                {t("config.validation.customExpressionHint")}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2">
              <ModeButton
                active={c.customRule.mode === "hard"}
                label={t("config.validation.modeHard")}
                desc={t("config.validation.modeHardDesc")}
                onClick={() => updateCustomRule({ mode: "hard" })}
              />
              <ModeButton
                active={c.customRule.mode === "soft"}
                label={t("config.validation.modeSoft")}
                desc={t("config.validation.modeSoftDesc")}
                onClick={() => updateCustomRule({ mode: "soft" })}
              />
            </div>

            <TextField>
              <Label>{t("config.validation.message")}</Label>
              <Input
                value={c.customRule.message}
                onChange={(e) => updateCustomRule({ message: e.target.value })}
                placeholder={t("config.validation.messagePlaceholder")}
              />
            </TextField>

            <Button
              variant="ghost"
              size="sm"
              onPress={removeCustomRule}
              className="self-start text-[var(--vita-error)]"
            >
              {t("config.validation.removeCustomRule")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Shared Mode Button ──────────────────────────────────────────────────────

function ModeButton({
  active,
  label,
  desc,
  onClick,
}: {
  active: boolean;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex flex-1 cursor-pointer flex-col gap-1 rounded-vita-md p-3 text-left transition-colors"
      style={{
        border: active
          ? "2px solid var(--vita-primary)"
          : "1px solid var(--vita-neutral-200)",
        background: active
          ? "var(--vita-primary-light)"
          : "var(--vita-background)",
      }}
      onClick={onClick}
    >
      <span
        className="text-xs font-semibold"
        style={{ color: "var(--vita-text-primary)" }}
      >
        {label}
      </span>
      <span className="text-[11px]" style={{ color: "var(--vita-text-muted)" }}>
        {desc}
      </span>
    </button>
  );
}
