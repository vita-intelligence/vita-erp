"use client";

import { Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";

import type { SettingsFieldProps } from "./types";

type NumberFieldProps = SettingsFieldProps & {
  min: number;
  max: number;
};

export default function NumberField({
  name,
  min,
  max,
  control,
  t,
  isDisabled,
}: NumberFieldProps) {
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
          <Input
            type="number"
            min={min}
            max={max}
            value={field.value != null ? String(field.value) : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              field.onChange(Number(e.target.value))
            }
            aria-label={t(`fields.${name}`)}
            disabled={isDisabled}
          />
        )}
      />
    </div>
  );
}
