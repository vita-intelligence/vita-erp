"use client";

/**
 * BackgroundPicker — lets user choose a solid color or CSS gradient
 * for field/form backgrounds. Compact UI with toggle between modes.
 */

import { useTranslations } from "next-intl";
import { useState } from "react";

import { ColorInput } from "@/components/theme-editor/modules/colors/ColorInput";
import { isGradient } from "@/components/theme-editor/modules/colors/gradient-picker/helpers";
import { Input } from "@/components/ui/input";

type BackgroundPickerProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  label: string;
};

const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
];

export function BackgroundPicker({
  value,
  onChange,
  label,
}: BackgroundPickerProps) {
  const t = useTranslations("formConstructor");
  const isGrad = isGradient(value);
  const [mode, setMode] = useState<"solid" | "gradient">(
    isGrad ? "gradient" : "solid",
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px]" style={{ color: "var(--vita-text-muted)" }}>
        {label}
      </p>

      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          type="button"
          className="rounded-vita-sm px-2 py-1 text-[10px] font-medium transition-colors"
          style={{
            background:
              mode === "solid"
                ? "var(--vita-primary)"
                : "var(--vita-neutral-100)",
            color:
              mode === "solid"
                ? "var(--vita-text-on-primary, #fff)"
                : "var(--vita-text-muted)",
          }}
          onClick={() => {
            setMode("solid");
            if (isGrad) onChange(undefined);
          }}
        >
          {t("config.general.stylingBgSolid")}
        </button>
        <button
          type="button"
          className="rounded-vita-sm px-2 py-1 text-[10px] font-medium transition-colors"
          style={{
            background:
              mode === "gradient"
                ? "var(--vita-primary)"
                : "var(--vita-neutral-100)",
            color:
              mode === "gradient"
                ? "var(--vita-text-on-primary, #fff)"
                : "var(--vita-text-muted)",
          }}
          onClick={() => setMode("gradient")}
        >
          {t("config.general.stylingBgGradient")}
        </button>
        {value && (
          <button
            type="button"
            className="ml-auto text-[10px]"
            style={{ color: "var(--vita-text-muted)" }}
            onClick={() => {
              onChange(undefined);
              setMode("solid");
            }}
          >
            ✕
          </button>
        )}
      </div>

      {mode === "solid" ? (
        <div className="flex items-center gap-1.5">
          <ColorInput
            value={!isGrad && value ? value : "#808080"}
            onChange={(hex) => onChange(hex)}
            title={label}
          />
          {value && !isGrad && (
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {value}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Gradient presets */}
          <div className="flex flex-wrap gap-1.5">
            {PRESET_GRADIENTS.map((grad) => (
              <button
                key={grad}
                type="button"
                className="h-6 w-6 rounded-vita-sm transition-transform hover:scale-110"
                style={{
                  background: grad,
                  border:
                    value === grad
                      ? "2px solid var(--vita-primary)"
                      : "1px solid var(--vita-neutral-200)",
                }}
                onClick={() => onChange(grad)}
                title={grad}
              />
            ))}
          </div>

          {/* Custom gradient input */}
          <Input
            value={isGrad ? (value ?? "") : ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v.includes("gradient(")) onChange(v);
            }}
            placeholder="linear-gradient(135deg, #hex 0%, #hex 100%)"
            className="font-mono text-[11px]"
          />

          {/* Preview */}
          {value && isGrad && (
            <div
              className="h-6 w-full rounded-vita-sm"
              style={{
                background: value,
                border: "1px solid var(--vita-neutral-200)",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
