"use client";

/**
 * Brand color cards — each base color auto-derives light/dark variants.
 */

import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { BRAND_COLOR_META, deriveVariants } from "@/config";
import { cssColorToHex } from "@/lib/color";
import { useThemeStore } from "@/stores/theme";

import { ColorInput } from "./ColorInput";

export function BrandSection() {
  const t = useTranslations("themeEditor.modules.colors");
  const { tokens, setTokens, resetColor } = useThemeStore();

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold font-vita-heading text-vita-text-primary">
          {t("brandColors")}
        </h3>
        <p className="text-xs text-vita-text-muted">
          {t("brandColorsDescription")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {BRAND_COLOR_META.map(({ key, lightKey, darkKey }) => {
          const tKey = key === "info" ? "information" : key;
          const label = t(tKey);
          const description = t(`${tKey}Description`);

          return (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-vita-lg border border-vita-neutral-200 bg-vita-surface p-3"
            >
              <div className="flex h-10 w-full overflow-hidden rounded-vita-md shadow-vita-xs">
                <div
                  className="flex-1"
                  style={{ background: `var(--vita-${key}-dark)` }}
                />
                <div
                  className="flex-[2]"
                  style={{ background: `var(--vita-${key})` }}
                />
                <div
                  className="flex-1"
                  style={{ background: `var(--vita-${key}-light)` }}
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-vita-text-primary">
                    {label}
                  </p>
                  <p className="text-xs text-vita-text-muted leading-tight">
                    {description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    title={t("resetColor", { label })}
                    className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
                    onClick={() => resetColor([key, lightKey, darkKey])}
                  >
                    <RotateCcw size={12} />
                  </button>
                  <ColorInput
                    value={cssColorToHex(tokens[key])}
                    title={t("changeColor", { label })}
                    onChange={(hex) => {
                      const { light, dark } = deriveVariants(hex);
                      setTokens({
                        [key]: hex,
                        [lightKey]: light,
                        [darkKey]: dark,
                      } as Parameters<typeof setTokens>[0]);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
