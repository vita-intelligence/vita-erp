"use client";

import NumberField from "../fields/NumberField";
import Section from "../fields/Section";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

export default function PrecisionSection({ control, t }: Props) {
  return (
    <Section title={t("sections.precision")}>
      <NumberField
        name="quantity_precision"
        min={0}
        max={10}
        control={control}
        t={t}
      />
      <NumberField
        name="price_precision"
        min={0}
        max={10}
        control={control}
        t={t}
      />
      <NumberField
        name="currency_precision"
        min={0}
        max={10}
        control={control}
        t={t}
      />
      <NumberField
        name="exchange_rate_precision"
        min={0}
        max={10}
        control={control}
        t={t}
      />
      <NumberField
        name="percentage_precision"
        min={0}
        max={10}
        control={control}
        t={t}
      />
      <NumberField
        name="weight_precision"
        min={0}
        max={10}
        control={control}
        t={t}
      />
    </Section>
  );
}
