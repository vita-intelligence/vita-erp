"use client";

import { Controller } from "react-hook-form";

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
}: NumberFieldProps) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium">
        {t(`fields.${name}`)}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            type="number"
            min={min}
            max={max}
            value={Number(field.value)}
            onChange={(e) => field.onChange(Number(e.target.value))}
            aria-label={t(`fields.${name}`)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            style={{
              borderRadius: "var(--vita-input-radius, 0px)",
              borderColor: "var(--vita-input-border-color, #d4d4d8)",
            }}
          />
        )}
      />
    </div>
  );
}
