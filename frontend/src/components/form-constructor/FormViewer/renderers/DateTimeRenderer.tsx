"use client";

import { Input } from "@/components/ui/input";
import type { FieldRendererProps } from "../../types";

const TYPE_MAP = {
  date: "date",
  datetime: "datetime-local",
  time: "time",
} as const;

export function DateTimeRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
  readOnly,
}: FieldRendererProps) {
  const inputType = TYPE_MAP[field.type as keyof typeof TYPE_MAP] ?? "text";

  return (
    <Input
      type={inputType}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      readOnly={readOnly}
      style={error ? { borderColor: "var(--vita-error)" } : undefined}
    />
  );
}
