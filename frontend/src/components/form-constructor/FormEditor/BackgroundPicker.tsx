"use client";

/**
 * BackgroundPicker — solid color or gradient background picker.
 * Gradient mode uses visual ColorInput pickers for each stop + angle slider.
 */

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { ColorInput } from "@/components/theme-editor/modules/colors/ColorInput";
import { isGradient } from "@/components/theme-editor/modules/colors/gradient-picker/helpers";
import { Slider } from "@/components/ui/slider";

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

/** Parse two hex colors and angle from a linear-gradient CSS string. */
function parseGradientStops(css: string): {
  color1: string;
  color2: string;
  angle: number;
} {
  const defaults = { color1: "#667eea", color2: "#764ba2", angle: 135 };
  if (!css.includes("linear-gradient")) return defaults;
  const match = css.match(
    /linear-gradient\(\s*(\d+)deg\s*,\s*(#[0-9a-fA-F]{3,8})\s+\d+%\s*,\s*(#[0-9a-fA-F]{3,8})\s+\d+%/,
  );
  if (!match) return defaults;
  return {
    angle: Number.parseInt(match[1], 10),
    color1: match[2],
    color2: match[3],
  };
}

function buildGradient(color1: string, color2: string, angle: number): string {
  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

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

  // Gradient builder state
  const parsed = isGrad
    ? parseGradientStops(value ?? "")
    : { color1: "#667eea", color2: "#764ba2", angle: 135 };
  const [color1, setColor1] = useState(parsed.color1);
  const [color2, setColor2] = useState(parsed.color2);
  const [angle, setAngle] = useState(parsed.angle);

  // Sync state when value changes externally (e.g., preset click)
  useEffect(() => {
    if (isGrad && value) {
      const p = parseGradientStops(value);
      setColor1(p.color1);
      setColor2(p.color2);
      setAngle(p.angle);
    }
  }, [value, isGrad]);

  function updateGradient(c1: string, c2: string, a: number) {
    setColor1(c1);
    setColor2(c2);
    setAngle(a);
    onChange(buildGradient(c1, c2, a));
  }

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
          onClick={() => {
            setMode("gradient");
            if (!isGrad) {
              onChange(buildGradient(color1, color2, angle));
            }
          }}
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
        <div className="flex flex-col gap-3">
          {/* Visual gradient builder */}
          <div className="flex flex-col gap-2">
            {/* Color stops with pickers */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px]"
                  style={{ color: "var(--vita-text-muted)" }}
                >
                  {t("config.general.stylingGradientStart")}
                </span>
                <ColorInput
                  value={color1}
                  onChange={(hex) => updateGradient(hex, color2, angle)}
                  title="Start color"
                />
              </div>
              {/* Arrow */}
              <span
                className="mt-3 text-sm"
                style={{ color: "var(--vita-neutral-400)" }}
              >
                →
              </span>
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px]"
                  style={{ color: "var(--vita-text-muted)" }}
                >
                  {t("config.general.stylingGradientEnd")}
                </span>
                <ColorInput
                  value={color2}
                  onChange={(hex) => updateGradient(color1, hex, angle)}
                  title="End color"
                />
              </div>
            </div>

            {/* Angle slider */}
            <div className="flex items-center gap-2">
              <span
                className="text-[10px]"
                style={{ color: "var(--vita-text-muted)" }}
              >
                {t("config.general.stylingGradientAngle")}
              </span>
              <Slider
                minValue={0}
                maxValue={360}
                value={[angle]}
                onChange={(val: number | number[]) =>
                  updateGradient(
                    color1,
                    color2,
                    Array.isArray(val) ? val[0] : val,
                  )
                }
                className="flex-1"
              >
                <Slider.Track>
                  <Slider.Fill />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider>
              <span
                className="w-8 text-right font-mono text-[10px]"
                style={{ color: "var(--vita-text-muted)" }}
              >
                {angle}°
              </span>
            </div>
          </div>

          {/* Preview */}
          <div
            className="h-8 w-full rounded-vita-sm"
            style={{
              background:
                value && isGrad ? value : buildGradient(color1, color2, angle),
              border: "1px solid var(--vita-neutral-200)",
            }}
          />

          {/* Presets */}
          <div>
            <span
              className="text-[10px]"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {t("config.general.stylingGradientPresets")}
            </span>
            <div className="mt-1 flex flex-wrap gap-1.5">
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
          </div>
        </div>
      )}
    </div>
  );
}
