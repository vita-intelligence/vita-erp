"use client";

/**
 * Surface editor — solid color or custom gradient builder.
 * Outputs a full CSS `background` value.
 */

import { Plus, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { cssColorToHex } from "@/lib/color";
import { useThemeStore } from "@/stores/theme";
import { Chip } from "../../_shared";
import { ColorInput } from "../ColorInput";

import {
  buildGradient,
  type ColorStop,
  createStop,
  defaultStops,
  type GradientType,
  isGradient,
  parseGradient,
} from "./helpers";
import { DARK_GRADIENT_PRESETS, GRADIENT_PRESETS } from "./presets";
import { StopEditor } from "./StopEditor";

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_STOPS = 6;
const MIN_STOPS = 2;

// ── Props ────────────────────────────────────────────────────────────────────

type Mode = "solid" | "gradient";

type GradientPickerProps = {
  tokenKey: keyof import("@/config/themes").ThemeTokens;
  label: string;
  description: string;
};

// ── Component ────────────────────────────────────────────────────────────────

export function GradientPicker({
  tokenKey,
  label,
  description,
}: GradientPickerProps) {
  const t = useTranslations("themeEditor.modules.colors");
  const { mode: themeMode, tokens, setTokens, resetColor } = useThemeStore();
  const value = tokens[tokenKey] ?? "";
  const isDark = themeMode === "dark";

  const [mode, setMode] = useState<Mode>(
    isGradient(value) ? "gradient" : "solid",
  );
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>(() => defaultStops(isDark));

  const presets = isDark ? DARK_GRADIENT_PRESETS : GRADIENT_PRESETS;

  const apply = useCallback(
    (type: GradientType, a: number, s: ColorStop[]) => {
      setTokens({
        [tokenKey]: buildGradient(type, a, s),
      } as Parameters<typeof setTokens>[0]);
    },
    [tokenKey, setTokens],
  );

  // ── Actions ─────────────────────────────────────────────────────────────

  function updateAngle(a: number) {
    setAngle(a);
    apply(gradientType, a, stops);
  }

  function updateStop(index: number, stop: ColorStop) {
    const next = stops.map((s, i) => (i === index ? stop : s));
    setStops(next);
    apply(gradientType, angle, next);
  }

  function removeStop(index: number) {
    if (stops.length <= MIN_STOPS) return;
    const next = stops.filter((_, i) => i !== index);
    setStops(next);
    apply(gradientType, angle, next);
  }

  function addStop() {
    if (stops.length >= MAX_STOPS) return;
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const lastTwo = sorted.slice(-2);
    const midPos = Math.round((lastTwo[0].position + lastTwo[1].position) / 2);
    const next = [...stops, createStop(isDark ? "#1a1a2e" : "#dee2e6", midPos)];
    setStops(next);
    apply(gradientType, angle, next);
  }

  function switchGradientType(type: GradientType) {
    setGradientType(type);
    apply(type, angle, stops);
  }

  function switchToSolid() {
    setMode("solid");
    resetColor([tokenKey]);
  }

  function switchToGradient() {
    setMode("gradient");
    apply(gradientType, angle, stops);
  }

  function reset() {
    setMode("solid");
    setStops(defaultStops(isDark));
    resetColor([tokenKey]);
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3 rounded-vita-lg border border-vita-neutral-200 bg-vita-surface p-3">
      {/* Preview */}
      <div
        className="h-14 w-full rounded-vita-md border border-vita-neutral-200 shadow-vita-xs"
        style={{ background: value }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-vita-text-primary">
            {label}
          </p>
          <p className="text-xs text-vita-text-muted leading-tight">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            title={t("resetColor", { label })}
            className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
            onClick={reset}
          >
            <RotateCcw size={12} />
          </button>
          {mode === "solid" && (
            <ColorInput
              value={
                isGradient(value) || !value ? "#ffffff" : cssColorToHex(value)
              }
              title={t("changeColor", { label })}
              onChange={(hex) =>
                setTokens({
                  [tokenKey]: hex,
                } as Parameters<typeof setTokens>[0])
              }
            />
          )}
        </div>
      </div>

      {/* Mode */}
      <div className="flex items-center gap-1">
        <Chip active={mode === "solid"} onClick={switchToSolid}>
          {t("solid")}
        </Chip>
        <Chip active={mode === "gradient"} onClick={switchToGradient}>
          {t("gradient")}
        </Chip>
      </div>

      {/* Gradient controls */}
      {mode === "gradient" && (
        <div className="space-y-3">
          {/* Type */}
          <div className="flex items-center gap-1">
            <Chip
              active={gradientType === "linear"}
              onClick={() => switchGradientType("linear")}
            >
              {t("linear")}
            </Chip>
            <Chip
              active={gradientType === "radial"}
              onClick={() => switchGradientType("radial")}
            >
              {t("radial")}
            </Chip>
          </div>

          {/* Angle (linear only) */}
          {gradientType === "linear" && (
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-vita-text-secondary">
                {t("angle")}
              </span>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={angle}
                className="flex-1 accent-vita-primary"
                onChange={(e) => updateAngle(Number(e.target.value))}
              />
              <span className="w-8 text-right text-xs font-vita-mono text-vita-text-muted">
                {angle}°
              </span>
            </div>
          )}

          {/* Stops */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-vita-text-secondary">
                {t("colorStops")}
              </span>
              {stops.length < MAX_STOPS && (
                <button
                  type="button"
                  title={t("addColorStop")}
                  className="flex items-center gap-0.5 rounded-vita-sm border border-vita-neutral-200 px-1.5 py-0.5 text-xs text-vita-text-muted hover:text-vita-text-secondary"
                  onClick={addStop}
                >
                  <Plus size={10} />
                  {t("add")}
                </button>
              )}
            </div>
            {stops.map((stop, i) => (
              <StopEditor
                key={stop.id}
                stop={stop}
                index={i}
                canRemove={stops.length > MIN_STOPS}
                onChange={updateStop}
                onRemove={removeStop}
              />
            ))}
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <span className="text-xs text-vita-text-muted">
              {t("quickPresets")}
            </span>
            <div className="grid grid-cols-7 gap-1">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  title={preset.label}
                  className="h-6 rounded-vita-sm border transition-all"
                  style={{
                    background: preset.swatch,
                    borderColor:
                      value === preset.value
                        ? "var(--vita-primary)"
                        : "var(--vita-neutral-200)",
                  }}
                  onClick={() => {
                    setMode("gradient");
                    // Parse preset to sync local state (stops, angle, type)
                    const parsed = parseGradient(preset.value);
                    if (parsed) {
                      setGradientType(parsed.type);
                      setAngle(parsed.angle);
                      setStops(parsed.stops);
                    }
                    setTokens({
                      [tokenKey]: preset.value,
                    } as Parameters<typeof setTokens>[0]);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
