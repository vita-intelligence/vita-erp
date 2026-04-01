"use client";

import { Controller } from "react-hook-form";

import { Switch } from "@/components/ui/switch";

import type { SettingsFieldProps } from "./types";

export default function SwitchField({ name, control, t }: SettingsFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex items-start justify-between gap-4 py-4">
          <div className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-vita-text-primary">
              {t(`fields.${name}`)}
            </span>
            <span className="block text-xs text-vita-text-muted">
              {t(`descriptions.${name}`)}
            </span>
          </div>
          <div className="shrink-0 pt-0.5">
            <Switch isSelected={Boolean(field.value)} onChange={field.onChange}>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch>
          </div>
        </div>
      )}
    />
  );
}
