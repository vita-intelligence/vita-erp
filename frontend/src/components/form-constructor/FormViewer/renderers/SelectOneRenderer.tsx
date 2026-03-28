"use client";

import { Label, Radio, RadioGroup } from "@/components/ui/radio-group";
import type { FieldRendererProps } from "../../types";

export function SelectOneRenderer({
  field,
  value,
  onChange,
  error,
  readOnly,
}: FieldRendererProps) {
  return (
    <RadioGroup
      value={(value as string) ?? ""}
      onChange={(val: string) => onChange(val)}
      isReadOnly={readOnly}
      isInvalid={!!error}
    >
      {field.options?.map((opt) => (
        <Radio key={opt.value} value={opt.value}>
          <Radio.Control>
            <Radio.Indicator />
          </Radio.Control>
          <Radio.Content>
            <Label>{opt.label}</Label>
          </Radio.Content>
        </Radio>
      ))}
    </RadioGroup>
  );
}
