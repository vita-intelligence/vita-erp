"use client";

import {
  CALENDAR_SYSTEMS,
  DATE_FORMATS,
  TIME_FORMATS,
  WEEK_START_DAYS,
} from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

export default function DateTimeSection({ control, t }: Props) {
  return (
    <Section
      title={t("sections.date_time")}
      description={t("sections.date_time_description")}
    >
      <SelectField
        name="date_format"
        options={DATE_FORMATS}
        optionKey="date_format"
        control={control}
        t={t}
      />
      <SelectField
        name="time_format"
        options={TIME_FORMATS}
        optionKey="time_format"
        control={control}
        t={t}
      />
      <SelectField
        name="week_start_day"
        options={WEEK_START_DAYS}
        optionKey="week_start_day"
        control={control}
        t={t}
      />
      <SelectField
        name="calendar_system"
        options={CALENDAR_SYSTEMS}
        optionKey="calendar_system"
        control={control}
        t={t}
      />
    </Section>
  );
}
