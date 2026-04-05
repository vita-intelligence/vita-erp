"use client";

import NumberField from "../fields/NumberField";
import Section from "../fields/Section";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t" | "isDisabled">;

export default function PrecisionSection({ control, t, isDisabled }: Props) {
  return (
    <Section
      title={t("sections.precision")}
      description={t("sections.precision_description")}
    >
      <NumberField
        name="quantity_precision"
        min={0}
        max={10}
        control={control}
        t={t}
        isDisabled={isDisabled}
      />
      <NumberField
        name="price_precision"
        min={0}
        max={10}
        control={control}
        t={t}
        isDisabled={isDisabled}
      />
      <NumberField
        name="currency_precision"
        min={0}
        max={10}
        control={control}
        t={t}
        isDisabled={isDisabled}
      />
      <NumberField
        name="exchange_rate_precision"
        min={0}
        max={10}
        control={control}
        t={t}
        isDisabled={isDisabled}
      />
      <NumberField
        name="percentage_precision"
        min={0}
        max={10}
        control={control}
        t={t}
        isDisabled={isDisabled}
      />
      <NumberField
        name="weight_precision"
        min={0}
        max={10}
        control={control}
        t={t}
        isDisabled={isDisabled}
      />
    </Section>
  );
}
