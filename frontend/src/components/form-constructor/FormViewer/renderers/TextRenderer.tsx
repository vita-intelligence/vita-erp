"use client";

import { Input } from "@/components/ui/input";
import type { FieldRendererProps } from "../../types";

export function TextRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
  readOnly,
}: FieldRendererProps) {
  return (
    <Input
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={field.description || field.label}
      readOnly={readOnly}
      style={error ? { borderColor: "var(--vita-error)" } : undefined}
    />
  );
}
