"use client";

import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import type { FieldRendererProps } from "../../types";

export function TextRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
  readOnly,
}: FieldRendererProps) {
  if (field.appearance === "multiline") {
    return (
      <TextArea
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={field.description || field.label}
        readOnly={readOnly}
        rows={4}
        style={error ? { borderColor: "var(--vita-error)" } : undefined}
      />
    );
  }

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
