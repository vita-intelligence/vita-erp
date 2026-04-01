"use client";

import { ROUNDING_METHODS } from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import SwitchField from "../fields/SwitchField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

const CASH_ROUNDING_INCREMENTS = [
  "0.01",
  "0.05",
  "0.10",
  "0.25",
  "0.50",
  "1.00",
] as const;

export default function RoundingSection({ control, t }: Props) {
  return (
    <Section title={t("sections.rounding")}>
      <SelectField
        name="rounding_method"
        options={ROUNDING_METHODS}
        optionKey="rounding_method"
        control={control}
        t={t}
      />
      <SwitchField
        name="cash_rounding_enabled"
        control={control}
        t={t}
        description={t("descriptions.cash_rounding_enabled")}
      />
      <SelectField
        name="cash_rounding_increment"
        options={CASH_ROUNDING_INCREMENTS}
        optionKey="cash_rounding_increment"
        control={control}
        t={t}
      />
    </Section>
  );
}
