"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { Label } from "@/components/ui/radio-group";
import type { FieldRendererProps } from "../../types";

export function SelectMultipleRenderer({
  field,
  value,
  onChange,
  error,
  readOnly,
}: FieldRendererProps) {
  const selected = (value as string[]) ?? [];

  return (
    <CheckboxGroup
      value={selected}
      onChange={(val: string[]) => onChange(val)}
      isReadOnly={readOnly}
      isInvalid={!!error}
    >
      {field.options?.map((opt) => (
        <Checkbox key={opt.value} value={opt.value}>
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label>{opt.label}</Label>
          </Checkbox.Content>
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
}
