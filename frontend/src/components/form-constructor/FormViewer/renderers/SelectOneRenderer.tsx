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
  const selected = (value as string) ?? "";
  const options = field.options ?? [];

  // ── Minimal: native dropdown ──────────────────────────────────────────────
  if (field.appearance === "minimal") {
    return (
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
        className="w-full appearance-none"
        style={{
          WebkitAppearance: "none",
          borderRadius: "var(--vita-input-radius, 0px)",
          borderWidth: "1px",
          borderStyle: "var(--vita-input-border-style, solid)",
          borderColor: error ? "var(--vita-error)" : "var(--vita-neutral-200)",
          background: "var(--vita-surface)",
          color: "var(--vita-text-primary)",
          paddingLeft: "var(--vita-input-padding-x, 12px)",
          paddingRight: "36px",
          paddingTop: "var(--vita-input-padding-y, 8px)",
          paddingBottom: "var(--vita-input-padding-y, 8px)",
          fontSize: "var(--vita-input-font-size, 14px)",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          boxShadow: "var(--vita-input-shadow, none)",
        }}
      >
        <option value="">{field.description || field.label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // ── Compact: horizontal button grid ───────────────────────────────────────
  if (field.appearance === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = selected === opt.value;
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
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Likert: horizontal scale with endpoint labels ─────────────────────────
  if (field.appearance === "likert") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-0">
          {options.map((opt, i) => {
            const isActive = selected === opt.value;
            const isFirst = i === 0;
            const isLast = i === options.length - 1;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={readOnly}
                className="flex-1 py-2 text-center text-xs font-medium transition-colors"
                style={{
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: isActive
                    ? "var(--vita-primary)"
                    : "var(--vita-neutral-200)",
                  borderRadius: isFirst
                    ? "var(--vita-input-radius, 6px) 0 0 var(--vita-input-radius, 6px)"
                    : isLast
                      ? "0 var(--vita-input-radius, 6px) var(--vita-input-radius, 6px) 0"
                      : "0",
                  marginLeft: isFirst ? "0" : "-1px",
                  background: isActive
                    ? "var(--vita-primary)"
                    : "var(--vita-surface)",
                  color: isActive
                    ? "var(--vita-text-on-primary, #fff)"
                    : "var(--vita-text-primary)",
                  position: "relative",
                  zIndex: isActive ? 1 : 0,
                }}
                onClick={() => onChange(opt.value)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Default: vertical radio buttons ───────────────────────────────────────
  return (
    <RadioGroup
      value={selected}
      onChange={(val: string) => onChange(val)}
      isReadOnly={readOnly}
      isInvalid={!!error}
    >
      {options.map((opt) => (
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
