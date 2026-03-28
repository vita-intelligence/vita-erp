"use client";

import { Input } from "@/components/ui/input";
import type { FieldRendererProps } from "../../types";
import { buildInputStyle } from "./input-style";

export function NumberRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
  readOnly,
}: FieldRendererProps) {
  const isInteger = field.type === "integer";

  return (
    <Input
      type="number"
      step={isInteger ? "1" : "any"}
      value={value === undefined || value === null ? "" : String(value)}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange(undefined);
          return;
        }
        onChange(isInteger ? Number.parseInt(raw, 10) : Number.parseFloat(raw));
      }}
      onBlur={onBlur}
      placeholder={field.description || field.label}
      readOnly={readOnly}
      style={buildInputStyle(field.styling, error)}
    />
  );
}
