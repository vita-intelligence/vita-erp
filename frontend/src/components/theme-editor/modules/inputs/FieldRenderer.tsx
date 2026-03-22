"use client";

/**
 * Renders a single preview field in above / left / inside label placement.
 */

import type { ThemeTokens } from "@/config/themes";

import { buildWrapperStyle } from "./input-styles";

// ── Types ────────────────────────────────────────────────────────────────────

export type FieldData = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  error?: boolean;
  errorMsg?: string;
  mono?: boolean;
};

type FieldRendererProps = {
  field: FieldData;
  placement: "above" | "left" | "inside";
  focused: boolean;
  tokens: ThemeTokens;
  wrapperBase: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  onFocus: (id: string) => void;
  onBlur: () => void;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function ErrorHint({ message }: { message: string }) {
  return (
    <p
      style={{
        fontSize: "0.6875rem",
        marginTop: "0.15rem",
        color: "var(--vita-error)",
      }}
    >
      {message}
    </p>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function FieldRenderer({
  field,
  placement,
  focused,
  tokens,
  wrapperBase,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
}: FieldRendererProps) {
  const error = !!field.error;
  const wrapper = buildWrapperStyle(wrapperBase, tokens, focused, error);
  const errorLabelColor = error ? { color: "var(--vita-error)" } : {};

  const fieldInputStyle = field.mono
    ? { ...inputStyle, fontFamily: "var(--vita-font-mono)" }
    : inputStyle;

  const input = (
    <input
      className="vita-field"
      style={fieldInputStyle}
      defaultValue={field.value}
      placeholder={field.placeholder}
      onFocus={() => onFocus(field.id)}
      onBlur={onBlur}
      readOnly
    />
  );

  const errorHint = error && field.errorMsg && (
    <ErrorHint message={field.errorMsg} />
  );

  if (placement === "left") {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              ...labelStyle,
              width: "4.5rem",
              flexShrink: 0,
              textAlign: "right",
              ...errorLabelColor,
            }}
          >
            {field.label}
          </span>
          <div style={{ flex: 1 }}>
            <div style={wrapper}>{input}</div>
            {errorHint}
          </div>
        </div>
      </div>
    );
  }

  if (placement === "inside") {
    return (
      <div>
        <div style={wrapper}>
          <span
            style={{
              fontWeight: labelStyle.fontWeight,
              fontSize: `calc(${tokens.inputLabelSize ?? "12px"} * 0.85)`,
              color: error ? "var(--vita-error)" : "var(--vita-text-muted)",
              display: "block",
              lineHeight: 1.2,
              marginBottom: "0.1rem",
            }}
          >
            {field.label}
          </span>
          {input}
        </div>
        {errorHint}
      </div>
    );
  }

  // "above" (default)
  return (
    <div>
      <span
        style={{ ...labelStyle, marginBottom: "0.25rem", ...errorLabelColor }}
      >
        {field.label}
      </span>
      <div style={wrapper}>{input}</div>
      {errorHint}
    </div>
  );
}
