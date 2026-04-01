"use client";

import { ListBox, ListBoxItem } from "@heroui/react";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectPopover,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CompanySettings } from "../../_types/company-settings";
import type { SettingsFieldProps } from "./types";

type SelectFieldProps = SettingsFieldProps & {
  options: readonly string[];
  optionKey: string;
};

function i18nKey(value: string): string {
  return value.replaceAll(".", "_");
}

export default function SelectField({
  name,
  options,
  optionKey,
  control,
  t,
}: SelectFieldProps) {
  return (
    <div className="py-4">
      <span className="block text-sm font-medium text-vita-text-primary">
        {t(`fields.${name}`)}
      </span>
      <span className="mb-2 block text-xs text-vita-text-muted">
        {t(`descriptions.${name}`)}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            selectedKey={String(field.value)}
            onSelectionChange={(key) => {
              if (key == null) return;
              field.onChange(String(key) as CompanySettings[typeof name]);
            }}
            aria-label={t(`fields.${name}`)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPopover>
              <ListBox>
                {options.map((opt) => (
                  <ListBoxItem
                    key={opt}
                    id={opt}
                    textValue={t(`options.${optionKey}.${i18nKey(opt)}`)}
                  >
                    {t(`options.${optionKey}.${i18nKey(opt)}`)}
                  </ListBoxItem>
                ))}
              </ListBox>
            </SelectPopover>
          </Select>
        )}
      />
    </div>
  );
}
