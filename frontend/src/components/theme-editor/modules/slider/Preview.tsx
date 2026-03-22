"use client";

/**
 * Live slider preview — uses real HeroUI Slider compound component
 * so CSS tokens from slider.css apply automatically.
 */

import { Label } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Slider } from "@/components/ui/slider";

const SLIDERS = [
  {
    id: "capacity",
    labelKey: "productionCapacity",
    defaultValue: 75,
    max: 100,
  },
  { id: "quality", labelKey: "qualityThreshold", defaultValue: 90, max: 100 },
  {
    id: "reorder",
    labelKey: "reorderPoint",
    defaultValue: 150,
    max: 500,
    step: 5,
  },
];

export function Preview() {
  const t = useTranslations("themeEditor");
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(SLIDERS.map((s) => [s.id, s.defaultValue])),
  );

  return (
    <div className="space-y-4 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {t("preview.livePreview")}
      </p>

      <div className="space-y-5">
        {SLIDERS.map((s) => (
          <Slider
            key={s.id}
            value={values[s.id]}
            onChange={(v) =>
              setValues((prev) => ({ ...prev, [s.id]: v as number }))
            }
            minValue={0}
            maxValue={s.max}
            step={s.step ?? 1}
            aria-label={t(`preview.slider.${s.labelKey}`)}
          >
            <div className="flex justify-between text-xs text-vita-text-secondary mb-1">
              <Label>{t(`preview.slider.${s.labelKey}`)}</Label>
              <Slider.Output />
            </div>
            <Slider.Track>
              <Slider.Fill />
              <Slider.Thumb />
            </Slider.Track>
          </Slider>
        ))}
      </div>
    </div>
  );
}
