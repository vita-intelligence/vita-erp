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
        <button
          type="button"
          className="rounded-vita-md px-4 py-2 text-xs font-medium transition-colors"
          style={{
            color: "var(--vita-primary)",
            border: "1px solid var(--vita-neutral-200)",
          }}
          onClick={addRegex}
        >
          {t("config.validation.addRegex")}
        </button>
      </div>
    );
  }

  const regex = field.regex as NonNullable<typeof field.regex>;

  return (
    <div className="flex flex-col gap-5">
      {/* Pattern */}
      <label className="flex flex-col gap-1.5">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.validation.pattern")}
        </span>
        <input
          type="text"
          value={regex.pattern}
          onChange={(e) => updateRegex({ pattern: e.target.value })}
          placeholder={t("config.validation.patternPlaceholder")}
          className="rounded-vita-md px-3 py-2 font-mono text-sm outline-none transition-colors"
          style={{
            background: "var(--vita-background)",
            border: "1px solid var(--vita-neutral-200)",
            color: "var(--vita-text-primary)",
          }}
        />
      </label>

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
      <label className="flex flex-col gap-1.5">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          {t("config.validation.message")}
        </span>
        <input
          type="text"
          value={regex.message}
          onChange={(e) => updateRegex({ message: e.target.value })}
          placeholder={t("config.validation.messagePlaceholder")}
          className="rounded-vita-md px-3 py-2 text-sm outline-none transition-colors"
          style={{
            background: "var(--vita-background)",
            border: "1px solid var(--vita-neutral-200)",
            color: "var(--vita-text-primary)",
          }}
        />
      </label>

      {/* Remove link */}
      <button
        type="button"
        className="self-start text-xs font-medium transition-colors"
        style={{ color: "var(--vita-error)" }}
        onClick={removeRegex}
      >
        {t("config.validation.removeRegex")}
      </button>
    </div>
  );
}
