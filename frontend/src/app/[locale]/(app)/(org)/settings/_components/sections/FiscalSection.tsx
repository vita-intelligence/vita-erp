"use client";

import { ListBox, ListBoxItem } from "@heroui/react";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  COST_METHODS,
  FISCAL_CALENDAR_TYPES,
} from "../../_types/company-settings";
import NumberField from "../fields/NumberField";
import Section from "../fields/Section";
import SelectField from "../fields/SelectField";
import SwitchField from "../fields/SwitchField";
import type { SettingsFieldProps } from "../fields/types";

type Props = Pick<SettingsFieldProps, "control" | "t">;

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export default function FiscalSection({ control, t }: Props) {
  return (
    <Section title={t("sections.fiscal")}>
      <div>
        <span className="mb-1 block text-sm font-medium">
          {t("fields.fiscal_year_start_month")}
        </span>
        <Controller
          name="fiscal_year_start_month"
          control={control}
          render={({ field }) => (
            <Select
              selectedKey={String(field.value)}
              onSelectionChange={(key) => field.onChange(Number(key))}
              aria-label={t("fields.fiscal_year_start_month")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopover>
                <ListBox>
                  {MONTHS.map((m) => (
                    <ListBoxItem
                      key={m}
                      id={m}
                      textValue={t(`options.months.${m}`)}
                    >
                      {t(`options.months.${m}`)}
                    </ListBoxItem>
                  ))}
                </ListBox>
              </SelectPopover>
            </Select>
          )}
        />
      </div>
      <NumberField
        name="fiscal_year_start_day"
        min={1}
        max={31}
        control={control}
        t={t}
      />
      <SelectField
        name="fiscal_calendar_type"
        options={FISCAL_CALENDAR_TYPES}
        optionKey="fiscal_calendar_type"
        control={control}
        t={t}
      />
      <SelectField
        name="cost_method"
        options={COST_METHODS}
        optionKey="cost_method"
        control={control}
        t={t}
      />
      <SwitchField
        name="tax_inclusive_pricing"
        control={control}
        t={t}
        description={t("descriptions.tax_inclusive_pricing")}
      />
    </Section>
  );
}
