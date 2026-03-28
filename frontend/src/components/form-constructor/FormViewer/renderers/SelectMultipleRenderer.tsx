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
  const options = field.options ?? [];

  function toggle(optValue: string) {
    if (readOnly) return;
    const next = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(next);
  }

  // ── Minimal: multi-select with checkmarks ─────────────────────────────────
  if (field.appearance === "minimal") {
    return (
      <div
        className="flex flex-col rounded-vita-md"
        style={{
          border: `1px solid ${error ? "var(--vita-error)" : "var(--vita-neutral-200)"}`,
          background: "var(--vita-surface)",
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        {options.map((opt) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              disabled={readOnly}
              className="flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
              style={{
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: "var(--vita-neutral-100)",
                background: isActive
                  ? "var(--vita-primary-light, var(--vita-neutral-50))"
                  : "transparent",
                color: "var(--vita-text-primary)",
              }}
              onClick={() => toggle(opt.value)}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[10px]"
                style={{
                  border: `1px solid ${isActive ? "var(--vita-primary)" : "var(--vita-neutral-300)"}`,
                  background: isActive ? "var(--vita-primary)" : "transparent",
                  color: isActive
                    ? "var(--vita-text-on-primary, #fff)"
                    : "transparent",
                }}
              >
                {isActive ? "✓" : ""}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Compact: horizontal toggle buttons ────────────────────────────────────
  if (field.appearance === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              disabled={readOnly}
              className="rounded-vita-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                border: `1px solid ${isActive ? "var(--vita-primary)" : "var(--vita-neutral-200)"}`,
                background: isActive
                  ? "var(--vita-primary)"
                  : "var(--vita-surface)",
                color: isActive
                  ? "var(--vita-text-on-primary, #fff)"
                  : "var(--vita-text-primary)",
              }}
              onClick={() => toggle(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Default: vertical checkboxes ──────────────────────────────────────────
  return (
    <CheckboxGroup
      value={selected}
      onChange={(val: string[]) => onChange(val)}
      isReadOnly={readOnly}
      isInvalid={!!error}
    >
      {options.map((opt) => (
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
