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

export default function SelectField({
  name,
  options,
  optionKey,
  control,
  t,
}: SelectFieldProps) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium">
        {t(`fields.${name}`)}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            selectedKey={String(field.value)}
            onSelectionChange={(key) =>
              field.onChange(String(key) as CompanySettings[typeof name])
            }
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
                    textValue={t(`options.${optionKey}.${opt}`)}
                  >
                    {t(`options.${optionKey}.${opt}`)}
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
