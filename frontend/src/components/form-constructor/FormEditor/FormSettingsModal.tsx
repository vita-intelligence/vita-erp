"use client";

/**
 * FormSettingsModal — configures form-level settings:
 * layout mode, styling, progress bar, field numbering, submit text.
 */

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ColorInput } from "@/components/theme-editor/modules/colors/ColorInput";
import { Button } from "@/components/ui/button";
import { Input, Label, TextField } from "@/components/ui/input";
import type { FormLayout, FormSettings, FormStyling } from "../types";
import { BackgroundPicker } from "./BackgroundPicker";

type FormSettingsModalProps = {
  settings: FormSettings;
  onSave: (settings: FormSettings) => void;
  onClose: () => void;
};

const DEFAULT_SETTINGS: FormSettings = {
  layout: "single-page",
};

export function FormSettingsModal({
  settings: initial,
  onSave,
  onClose,
}: FormSettingsModalProps) {
  const t = useTranslations("formConstructor");
  const [settings, setSettings] = useState<FormSettings>({
    ...DEFAULT_SETTINGS,
    ...initial,
  });

  const s = settings.styling ?? {};

  function patchStyling(patch: Partial<FormStyling>) {
    const next = { ...s, ...patch };
    for (const key of Object.keys(next) as (keyof FormStyling)[]) {
      if (!next[key]) delete next[key];
    }
    setSettings({
      ...settings,
      styling: Object.keys(next).length > 0 ? next : undefined,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.4)" }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: modal */}
      <div
        role="dialog"
        className="flex flex-col rounded-vita-xl shadow-lg"
        style={{
          background: "var(--vita-surface)",
          border: "1px solid var(--vita-neutral-200)",
          width: "min(520px, 92vw)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
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
            {t("formSettings.title")}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {/* ── Layout Mode ──────────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("formSettings.layout")}
            </p>
            <p
              className="text-[11px]"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {t("formSettings.layoutHint")}
            </p>
            <div className="flex flex-col gap-1.5">
              {(
                [
                  "single-page",
                  "page-per-group",
                  "page-per-field",
                ] as FormLayout[]
              ).map((mode) => (
                <label
                  key={mode}
                  className="flex cursor-pointer items-start gap-2 rounded-vita-md p-2.5 transition-colors"
                  style={{
                    border:
                      settings.layout === mode
                        ? "2px solid var(--vita-primary)"
                        : "1px solid var(--vita-neutral-200)",
                    background:
                      settings.layout === mode
                        ? "color-mix(in oklch, var(--vita-primary) 5%, transparent)"
                        : "var(--vita-background)",
                  }}
                >
                  <input
                    type="radio"
                    name="layout"
                    checked={settings.layout === mode}
                    onChange={() => setSettings({ ...settings, layout: mode })}
                    className="mt-0.5"
                  />
                  <div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--vita-text-primary)" }}
                    >
                      {t(`formSettings.layoutModes.${mode}`)}
                    </span>
                    <p
                      className="mt-0.5 text-[11px]"
                      style={{ color: "var(--vita-text-muted)" }}
                    >
                      {t(`formSettings.layoutDescriptions.${mode}`)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ── Display Options ──────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("formSettings.displayOptions")}
            </p>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showProgressBar ?? false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    showProgressBar: e.target.checked || undefined,
                  })
                }
              />
              <span
                className="text-xs"
                style={{ color: "var(--vita-text-primary)" }}
              >
                {t("formSettings.showProgressBar")}
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showFieldNumbers ?? false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    showFieldNumbers: e.target.checked || undefined,
                  })
                }
              />
              <span
                className="text-xs"
                style={{ color: "var(--vita-text-primary)" }}
              >
                {t("formSettings.showFieldNumbers")}
              </span>
            </label>

            <TextField>
              <Label>{t("formSettings.submitButtonText")}</Label>
              <Input
                value={settings.submitButtonText ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    submitButtonText: e.target.value || undefined,
                  })
                }
                placeholder={t("viewer.submit")}
              />
            </TextField>
          </div>

          {/* ── Form Styling ─────────────────────────────────────────── */}
          <div
            className="flex flex-col gap-3 rounded-vita-lg p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("formSettings.styling")}
            </p>

            <BackgroundPicker
              label={t("formSettings.bgColor")}
              value={s.backgroundColor}
              onChange={(v) => patchStyling({ backgroundColor: v })}
            />
            <ColorFieldInline
              label={t("formSettings.textColor")}
              value={s.textColor}
              onChange={(v) => patchStyling({ textColor: v })}
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <TextField>
                  <Label>{t("formSettings.maxWidth")}</Label>
                  <Input
                    value={s.maxWidth ?? ""}
                    onChange={(e) =>
                      patchStyling({ maxWidth: e.target.value || undefined })
                    }
                    placeholder="600px"
                  />
                </TextField>
              </div>
              <div className="flex-1">
                <TextField>
                  <Label>{t("formSettings.padding")}</Label>
                  <Input
                    value={s.padding ?? ""}
                    onChange={(e) =>
                      patchStyling({ padding: e.target.value || undefined })
                    }
                    placeholder="20px"
                  />
                </TextField>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <TextField>
                  <Label>{t("formSettings.borderRadius")}</Label>
                  <Input
                    value={s.borderRadius ?? ""}
                    onChange={(e) =>
                      patchStyling({
                        borderRadius: e.target.value || undefined,
                      })
                    }
                    placeholder="12px"
                  />
                </TextField>
              </div>
              <div className="flex-1">
                <TextField>
                  <Label>{t("formSettings.fontFamily")}</Label>
                  <Input
                    value={s.fontFamily ?? ""}
                    onChange={(e) =>
                      patchStyling({ fontFamily: e.target.value || undefined })
                    }
                    placeholder="Inter, sans-serif"
                  />
                </TextField>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — always visible */}
        <div
          className="flex shrink-0 justify-end gap-2 border-t px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <Button size="sm" variant="outline" onPress={onClose}>
            {t("config.cancel")}
          </Button>
          <Button size="sm" variant="primary" onPress={() => onSave(settings)}>
            {t("config.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ColorFieldInline({
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
      <div className="flex items-center gap-1.5">
        <ColorInput
          value={value || "#808080"}
          onChange={(hex) => onChange(hex)}
          title={label}
        />
        {value && (
          <button
            type="button"
            className="text-[10px]"
            style={{ color: "var(--vita-text-muted)" }}
            onClick={() => onChange(undefined)}
          >
            ✕
          </button>
        )}
        {!value && (
          <span
            className="text-[10px]"
            style={{ color: "var(--vita-text-muted)" }}
          >
            Default
          </span>
        )}
      </div>
    </div>
  );
}
