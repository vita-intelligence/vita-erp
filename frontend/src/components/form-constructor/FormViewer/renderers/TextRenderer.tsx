"use client";

import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import type { FieldRendererProps } from "../../types";
import { buildInputStyle } from "./input-style";

export function TextRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
  readOnly,
}: FieldRendererProps) {
  const inputStyle = buildInputStyle(field.styling, error);

  if (field.appearance === "multiline") {
    return (
      <TextArea
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={field.description || field.label}
        readOnly={readOnly}
        rows={4}
        style={inputStyle}
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
      style={inputStyle}
    />
  );
}
