"use client";

import {
  DECIMAL_SEPARATORS,
  DIGIT_GROUPINGS,
  THOUSANDS_SEPARATORS,
} from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

export default function NumberFormattingSection({ control, t }: Props) {
  return (
    <Section
      title={t("sections.number_formatting")}
      description={t("sections.number_formatting_description")}
    >
      <SelectField
        name="decimal_separator"
        options={DECIMAL_SEPARATORS}
        optionKey="decimal_separator"
        control={control}
        t={t}
      />
      <SelectField
        name="thousands_separator"
        options={THOUSANDS_SEPARATORS}
        optionKey="thousands_separator"
        control={control}
        t={t}
      />
      <SelectField
        name="digit_grouping"
        options={DIGIT_GROUPINGS}
        optionKey="digit_grouping"
        control={control}
        t={t}
      />
    </Section>
  );
}
