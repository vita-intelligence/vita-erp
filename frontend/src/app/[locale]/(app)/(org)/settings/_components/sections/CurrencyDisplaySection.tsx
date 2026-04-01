"use client";

import {
  CURRENCY_POSITIONS,
  NEGATIVE_FORMATS,
} from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import SwitchField from "../fields/SwitchField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

export default function CurrencyDisplaySection({ control, t }: Props) {
  return (
    <Section
      title={t("sections.currency_display")}
      description={t("sections.currency_display_description")}
    >
      <SelectField
        name="currency_symbol_position"
        options={CURRENCY_POSITIONS}
        optionKey="currency_symbol_position"
        control={control}
        t={t}
      />
      <SelectField
        name="negative_format"
        options={NEGATIVE_FORMATS}
        optionKey="negative_format"
        control={control}
        t={t}
      />
      <SwitchField name="currency_spacing" control={control} t={t} />
      <SwitchField name="multi_currency_enabled" control={control} t={t} />
    </Section>
  );
}
