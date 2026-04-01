"use client";

import { Controller } from "react-hook-form";

import { Switch } from "@/components/ui/switch";

import type { SettingsFieldProps } from "./types";

type SwitchFieldProps = SettingsFieldProps & {
  description?: string;
};

export default function SwitchField({
  name,
  control,
  t,
  description,
}: SwitchFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-sm font-medium">{t(`fields.${name}`)}</span>
            {description && <p className="text-xs opacity-60">{description}</p>}
          </div>
          <Switch isSelected={Boolean(field.value)} onChange={field.onChange}>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
        </div>
      )}
    />
  );
}
