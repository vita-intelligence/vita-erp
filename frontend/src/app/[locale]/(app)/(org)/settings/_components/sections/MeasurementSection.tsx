"use client";

import {
  AREA_UOMS,
  LENGTH_UOMS,
  MEASUREMENT_SYSTEMS,
  TEMPERATURE_UOMS,
  VOLUME_UOMS,
  WEIGHT_UOMS,
} from "../../_types/company-settings";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

export default function MeasurementSection({ control, t }: Props) {
  return (
    <Section
      title={t("sections.measurement")}
      description={t("sections.measurement_description")}
    >
      <SelectField
        name="measurement_system"
        options={MEASUREMENT_SYSTEMS}
        optionKey="measurement_system"
        control={control}
        t={t}
      />
      <SelectField
        name="default_weight_uom"
        options={WEIGHT_UOMS}
        optionKey="default_weight_uom"
        control={control}
        t={t}
      />
      <SelectField
        name="default_length_uom"
        options={LENGTH_UOMS}
        optionKey="default_length_uom"
        control={control}
        t={t}
      />
      <SelectField
        name="default_volume_uom"
        options={VOLUME_UOMS}
        optionKey="default_volume_uom"
        control={control}
        t={t}
      />
      <SelectField
        name="default_temperature_uom"
        options={TEMPERATURE_UOMS}
        optionKey="default_temperature_uom"
        control={control}
        t={t}
      />
      <SelectField
        name="default_area_uom"
        options={AREA_UOMS}
        optionKey="default_area_uom"
        control={control}
        t={t}
      />
    </Section>
  );
}
