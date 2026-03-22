"use client";

/**
 * ColorsModule — composes all color-related sections.
 */

import { useTranslations } from "next-intl";

import { BrandSection } from "./BrandSection";
import { GradientPicker } from "./gradient-picker";
import { NeutralControls } from "./NeutralControls";
import { TextSection } from "./TextSection";

export function ColorsModule() {
  const t = useTranslations("themeEditor.modules.colors");

  return (
    <div className="space-y-8">
      <NeutralControls />

      <BrandSection />

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold font-vita-heading text-vita-text-primary">
            {t("surfaces")}
          </h3>
          <p className="text-xs text-vita-text-muted">
            {t("surfacesDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <GradientPicker
            tokenKey="background"
            label={t("background")}
            description={t("backgroundDescription")}
          />
          <GradientPicker
            tokenKey="surface"
            label={t("surface")}
            description={t("surfaceDescription")}
          />
        </div>
      </section>

      <TextSection />
    </div>
  );
}
