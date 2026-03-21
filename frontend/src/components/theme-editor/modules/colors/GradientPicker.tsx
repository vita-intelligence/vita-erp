"use client";

/**
 * Surface editor — solid color, custom gradient builder, or preset picker.
 * Outputs a full CSS `background` value.
 */

import { Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";

import { cssColorToHex } from "@/lib/color";
import { useThemeStore } from "@/stores/theme";
import { Chip } from "../_shared";

import {
  DARK_GRADIENT_PRESETS,
  GRADIENT_PRESETS,
  type GradientPreset,
} from "./gradient-presets";

// ── Types ────────────────────────────────────────────────────────────────────

type Mode = "solid" | "gradient";
type GradientType = "linear" | "radial";

type ColorStop = {
  id: number;
  color: string;
  position: number; // 0–100
};

let nextStopId = 1;

type GradientPickerProps = {
  tokenKey: "background" | "surface";
  label: string;
  description: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function isGradient(value: string): boolean {
  return value.includes("gradient(");
}

function buildLinearGradient(angle: number, stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
  return `linear-gradient(${angle}deg, ${stopsStr})`;
}

function buildRadialGradient(stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
  return `radial-gradient(circle at 50% 50%, ${stopsStr})`;
}

function defaultStops(isDark: boolean): ColorStop[] {
  return isDark
    ? [
        { id: nextStopId++, color: "#1a1a2e", position: 0 },
        { id: nextStopId++, color: "#0f0f1a", position: 100 },
      ]
    : [
        { id: nextStopId++, color: "#f8f9fa", position: 0 },
        { id: nextStopId++, color: "#e9ecef", position: 100 },
      ];
}

// ── Stop Editor ──────────────────────────────────────────────────────────────

function StopEditor({
  stop,
  index,
  total,
  onChange,
  onRemove,
}: {
  stop: ColorStop;
  index: number;
  total: number;
  onChange: (index: number, stop: ColorStop) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        className="h-6 w-6 shrink-0 cursor-pointer rounded-vita-sm border border-vita-neutral-200"
        value={stop.color}
        onChange={(e) => onChange(index, { ...stop, color: e.target.value })}
        title={`Stop ${index + 1} color`}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={stop.position}
        className="flex-1 accent-vita-primary"
        onChange={(e) =>
          onChange(index, { ...stop, position: Number(e.target.value) })
        }
        title={`Stop ${index + 1} position`}
      />
      <span className="w-8 text-right text-xs font-vita-mono text-vita-text-muted">
        {stop.position}%
      </span>
      {total > 2 && (
        <button
          type="button"
          title="Remove stop"
          className="p-0.5 text-vita-text-muted hover:text-vita-text-secondary"
          onClick={() => onRemove(index)}
        >
          <Minus size={10} />
        </button>
      )}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function GradientPicker({
  tokenKey,
  label,
  description,
}: GradientPickerProps) {
  const { mode: themeMode, tokens, setTokens, resetColor } = useThemeStore();
  const value = tokens[tokenKey];
  const isDark = themeMode === "dark";

  const [mode, setMode] = useState<Mode>(
    isGradient(value) ? "gradient" : "solid",
  );
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>(() => defaultStops(isDark));

  const presets = isDark ? DARK_GRADIENT_PRESETS : GRADIENT_PRESETS;

  // ── Gradient builder ────────────────────────────────────────────────────

  const applyGradient = useCallback(
    (type: GradientType, a: number, s: ColorStop[]) => {
      const css =
        type === "linear" ? buildLinearGradient(a, s) : buildRadialGradient(s);
      setTokens({ [tokenKey]: css } as Parameters<typeof setTokens>[0]);
    },
    [tokenKey, setTokens],
  );

  function updateAngle(a: number) {
    setAngle(a);
    applyGradient(gradientType, a, stops);
  }

  function updateStop(index: number, stop: ColorStop) {
    const next = stops.map((s, i) => (i === index ? stop : s));
    setStops(next);
    applyGradient(gradientType, angle, next);
  }

  function removeStop(index: number) {
    if (stops.length <= 2) return;
    const next = stops.filter((_, i) => i !== index);
    setStops(next);
    applyGradient(gradientType, angle, next);
  }

  function addStop() {
    if (stops.length >= 6) return;
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    // Place new stop between the last two
    const lastTwo = sorted.slice(-2);
    const midPos = Math.round((lastTwo[0].position + lastTwo[1].position) / 2);
    const newStop: ColorStop = {
      id: nextStopId++,
      color: isDark ? "#1a1a2e" : "#dee2e6",
      position: midPos,
    };
    const next = [...stops, newStop];
    setStops(next);
    applyGradient(gradientType, angle, next);
  }

  function switchGradientType(type: GradientType) {
    setGradientType(type);
    applyGradient(type, angle, stops);
  }

  function applyPreset(preset: GradientPreset) {
    setMode("gradient");
    setTokens({
      [tokenKey]: preset.value,
    } as Parameters<typeof setTokens>[0]);
  }

  function switchToSolid() {
    setMode("solid");
    resetColor([tokenKey]);
  }

  function switchToGradient() {
    setMode("gradient");
    applyGradient(gradientType, angle, stops);
  }

  return (
    <div className="space-y-3 rounded-vita-lg border border-vita-neutral-200 bg-vita-surface p-3">
      {/* Preview swatch */}
      <div
        className="h-14 w-full rounded-vita-md border border-vita-neutral-200 shadow-vita-xs"
        style={{ background: value }}
      />

      {/* Header + controls */}
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
            title={`Reset ${label}`}
            className="p-1 text-vita-text-muted hover:text-vita-text-secondary"
            onClick={() => {
              setMode("solid");
              setStops(defaultStops(isDark));
              resetColor([tokenKey]);
            }}
          >
            <RotateCcw size={12} />
          </button>
          {mode === "solid" && (
            <input
              type="color"
              title={`Change ${label}`}
              className="h-7 w-7 cursor-pointer rounded-vita-sm border border-vita-neutral-200"
              value={isGradient(value) ? "#ffffff" : cssColorToHex(value)}
              onChange={(e) =>
                setTokens({
                  [tokenKey]: e.target.value,
                } as Parameters<typeof setTokens>[0])
              }
            />
          )}
        </div>
      </div>

      {/* Mode switcher */}
      <div className="flex items-center gap-1">
        <Chip active={mode === "solid"} onClick={switchToSolid}>
          Solid
        </Chip>
        <Chip active={mode === "gradient"} onClick={switchToGradient}>
          Gradient
        </Chip>
      </div>

      {/* ── Gradient controls ── */}
      {mode === "gradient" && (
        <div className="space-y-3">
          {/* Gradient type */}
          <div className="flex items-center gap-1">
            <Chip
              active={gradientType === "linear"}
              onClick={() => switchGradientType("linear")}
            >
              Linear
            </Chip>
            <Chip
              active={gradientType === "radial"}
              onClick={() => switchGradientType("radial")}
            >
              Radial
            </Chip>
          </div>

          {/* Angle control (linear only) */}
          {gradientType === "linear" && (
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-vita-text-secondary">
                Angle
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

          {/* Color stops */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-vita-text-secondary">
                Color stops
              </span>
              {stops.length < 6 && (
                <button
                  type="button"
                  title="Add color stop"
                  className="flex items-center gap-0.5 rounded-vita-sm border border-vita-neutral-200 px-1.5 py-0.5 text-xs text-vita-text-muted hover:text-vita-text-secondary"
                  onClick={addStop}
                >
                  <Plus size={10} />
                  Add
                </button>
              )}
            </div>
            {stops.map((stop, i) => (
              <StopEditor
                key={stop.id}
                stop={stop}
                index={i}
                total={stops.length}
                onChange={updateStop}
                onRemove={removeStop}
              />
            ))}
          </div>

          {/* Quick presets */}
          <div className="space-y-1.5">
            <span className="text-xs text-vita-text-muted">Quick presets</span>
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
                  onClick={() => applyPreset(preset)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
