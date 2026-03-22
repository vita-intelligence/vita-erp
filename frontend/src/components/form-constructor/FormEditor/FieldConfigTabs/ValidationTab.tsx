"use client";

/**
 * ValidationTab — regex validation settings for input fields.
 *
 * Supports two modes:
 * - Hard: blocks form submission and shows an error message.
 * - Soft: allows submission but shows a warning message.
 *
 * When no regex rule exists, shows a single "Add validation" button.
 */

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input, Label, TextField } from "@/components/ui/input";

import type { ConfigTabProps, RegexRule } from "../../types";

export function ValidationTab({ field, onUpdate }: ConfigTabProps) {
  const t = useTranslations("formConstructor");

  const hasRegex = field.regex !== undefined;

  function addRegex() {
    const rule: RegexRule = { pattern: "", mode: "hard", message: "" };
    onUpdate({ regex: rule });
  }

  function removeRegex() {
    onUpdate({ regex: undefined });
  }

  function updateRegex(patch: Partial<RegexRule>) {
    if (!field.regex) return;
    onUpdate({ regex: { ...field.regex, ...patch } });
  }

  if (!hasRegex) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {t("config.validation.noRule")}
        </p>
        <Button variant="outline" size="sm" onPress={addRegex}>
          {t("config.validation.addRegex")}
        </Button>
      </div>
    );
  }

  const regex = field.regex as NonNullable<typeof field.regex>;

  return (
    <div className="flex flex-col gap-5">
      {/* Pattern */}
      <TextField>
        <Label>{t("config.validation.pattern")}</Label>
        <Input
          value={regex.pattern}
          onChange={(e) => updateRegex({ pattern: e.target.value })}
          placeholder={t("config.validation.patternPlaceholder")}
          className="font-mono"
        />
      </TextField>

      {/* Mode toggle */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.validation.mode")}
        </span>

        <div className="flex gap-2">
          {/* Hard mode */}
          <button
            type="button"
            className="flex flex-1 cursor-pointer flex-col gap-1 rounded-vita-md p-3 text-left transition-colors"
            style={{
              border:
                regex.mode === "hard"
                  ? "2px solid var(--vita-primary)"
                  : "1px solid var(--vita-neutral-200)",
              background:
                regex.mode === "hard"
                  ? "var(--vita-primary-light)"
                  : "var(--vita-background)",
            }}
            onClick={() => updateRegex({ mode: "hard" })}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("config.validation.modeHard")}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {t("config.validation.modeHardDesc")}
            </span>
          </button>

          {/* Soft mode */}
          <button
            type="button"
            className="flex flex-1 cursor-pointer flex-col gap-1 rounded-vita-md p-3 text-left transition-colors"
            style={{
              border:
                regex.mode === "soft"
                  ? "2px solid var(--vita-primary)"
                  : "1px solid var(--vita-neutral-200)",
              background:
                regex.mode === "soft"
                  ? "var(--vita-primary-light)"
                  : "var(--vita-background)",
            }}
            onClick={() => updateRegex({ mode: "soft" })}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("config.validation.modeSoft")}
            </span>
            <span
              className="text-[11px]"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {t("config.validation.modeSoftDesc")}
            </span>
          </button>
        </div>
      </div>

      {/* Custom message */}
      <TextField>
        <Label>{t("config.validation.message")}</Label>
        <Input
          value={regex.message}
          onChange={(e) => updateRegex({ message: e.target.value })}
          placeholder={t("config.validation.messagePlaceholder")}
        />
      </TextField>

      {/* Remove link */}
      <Button
        variant="ghost"
        size="sm"
        onPress={removeRegex}
        className="self-start text-[var(--vita-error)]"
      >
        {t("config.validation.removeRegex")}
      </Button>
    </div>
  );
}
