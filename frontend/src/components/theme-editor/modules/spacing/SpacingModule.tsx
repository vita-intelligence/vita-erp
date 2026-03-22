"use client";

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useThemeStore } from "@/stores/theme";

export function SpacingModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();

  const pct = Math.round((parseFloat(tokens.spacing) / 0.25) * 100);

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.spacing.allControls")}
      </p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
            {t("modules.spacing.density")}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold font-vita-mono text-vita-text-secondary">
              {pct}%
            </span>
            <button
              type="button"
              title={t("chrome.reset")}
              className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
              onClick={() => resetColor(["spacing"])}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
        <input
          type="range"
          min={0.2}
          max={0.35}
          step={0.005}
          value={parseFloat(tokens.spacing)}
          className="w-full accent-vita-primary"
          onChange={(e) => setTokens({ spacing: `${e.target.value}rem` })}
        />
        <div className="flex justify-between text-xs text-vita-text-muted">
          <span>{t("preview.spacing.compact")}</span>
          <span>{t("preview.spacing.default")}</span>
          <span>{t("preview.spacing.comfortable")}</span>
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
          {t("modules.spacing.preview")}
        </p>
        <div className="rounded-vita-lg border border-vita-neutral-200 bg-vita-surface overflow-hidden">
          <div className="border-b border-vita-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold font-vita-heading text-vita-text-primary">
              {t("preview.spacing.orderTitle")}{" "}
              <span className="font-vita-mono">
                {t("preview.spacing.orderNumber")}
              </span>
            </p>
          </div>
          <div className="divide-y divide-vita-neutral-100">
            {[
              {
                label: t("preview.spacing.product"),
                value: t("preview.spacing.productValue"),
              },
              {
                label: t("preview.spacing.quantity"),
                value: t("preview.spacing.quantityValue"),
                mono: true,
              },
              {
                label: t("preview.spacing.status"),
                value: t("preview.spacing.statusValue"),
              },
              {
                label: t("preview.spacing.dueDate"),
                value: t("preview.spacing.dueDateValue"),
                mono: true,
              },
            ].map(({ label, value, mono }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-2"
              >
                <span className="text-xs text-vita-text-muted">{label}</span>
                <span
                  className={`text-xs font-medium text-vita-text-primary${mono ? " font-vita-mono" : ""}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-vita-text-muted">
          {t("preview.spacing.description")}
        </p>
      </div>
    </div>
  );
}
