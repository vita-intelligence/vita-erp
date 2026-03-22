"use client";

/**
 * Hover3DControls — shared hover animation controls with both simple 2D
 * effects (lift, scale) and 3D rotation effects.
 *
 * Designed for components that don't have an existing hover system
 * (cards, badges, avatar). Buttons use their own hover module.
 *
 * When "none" is selected, hover rotation tokens are set to "" which
 * removes them from the DOM — the CSS `var()` fallback chain then uses
 * the static rotation values, preserving any 3D transform on hover.
 */

import { useState } from "react";

import type { ThemeTokens } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

import { TransitionRow } from "./controls";
import { Chip, Row, Section, SliderRow } from "./primitives";

// ── Types ────────────────────────────────────────────────────────────────────

export type HoverEffectType =
  | "none"
  | "lift"
  | "scale"
  | "lift-scale"
  | "tilt-forward"
  | "tilt-side"
  | "tilt-3d"
  | "flip-peek"
  | "lift-tilt";

export type Hover3DKeys = {
  hoverRotateX: keyof ThemeTokens;
  hoverRotateY: keyof ThemeTokens;
  hoverRotateZ: keyof ThemeTokens;
  hoverTranslateY: keyof ThemeTokens;
  hoverScale: keyof ThemeTokens;
  transitionDuration: keyof ThemeTokens;
};

export type Hover3DControlsProps = {
  keys: Hover3DKeys;
};

// ── Hover presets ────────────────────────────────────────────────────────────

type HoverPreset = {
  /** "" means "inherit from static" (CSS var removed → fallback fires) */
  rotateX: string;
  rotateY: string;
  rotateZ: string;
  translateY: string;
  scale: string;
};

const HOVER_DEFAULTS: Record<HoverEffectType, HoverPreset> = {
  // "none" — all rotations inherit from static (empty = removed from DOM)
  none: {
    rotateX: "",
    rotateY: "",
    rotateZ: "",
    translateY: "0px",
    scale: "1",
  },
  lift: {
    rotateX: "",
    rotateY: "",
    rotateZ: "",
    translateY: "-4px",
    scale: "1",
  },
  scale: {
    rotateX: "",
    rotateY: "",
    rotateZ: "",
    translateY: "0px",
    scale: "1.03",
  },
  "lift-scale": {
    rotateX: "",
    rotateY: "",
    rotateZ: "",
    translateY: "-3px",
    scale: "1.02",
  },
  "tilt-forward": {
    rotateX: "-5deg",
    rotateY: "0deg",
    rotateZ: "0deg",
    translateY: "0px",
    scale: "1",
  },
  "tilt-side": {
    rotateX: "0deg",
    rotateY: "8deg",
    rotateZ: "0deg",
    translateY: "0px",
    scale: "1",
  },
  "tilt-3d": {
    rotateX: "-4deg",
    rotateY: "6deg",
    rotateZ: "0deg",
    translateY: "0px",
    scale: "1",
  },
  "flip-peek": {
    rotateX: "0deg",
    rotateY: "15deg",
    rotateZ: "0deg",
    translateY: "0px",
    scale: "1",
  },
  "lift-tilt": {
    rotateX: "-3deg",
    rotateY: "4deg",
    rotateZ: "0deg",
    translateY: "-3px",
    scale: "1",
  },
};

const EFFECT_OPTIONS: { label: string; value: HoverEffectType }[] = [
  { label: "None", value: "none" },
  { label: "Lift", value: "lift" },
  { label: "Scale", value: "scale" },
  { label: "Lift + Scale", value: "lift-scale" },
  { label: "Tilt forward", value: "tilt-forward" },
  { label: "Tilt side", value: "tilt-side" },
  { label: "Tilt 3D", value: "tilt-3d" },
  { label: "Flip peek", value: "flip-peek" },
  { label: "Lift + Tilt", value: "lift-tilt" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function detectActiveEffect(
  tokens: ThemeTokens,
  keys: Hover3DKeys,
): HoverEffectType {
  const rx = tokens[keys.hoverRotateX] ?? "";
  const ry = tokens[keys.hoverRotateY] ?? "";
  const rz = tokens[keys.hoverRotateZ] ?? "";
  const ty = tokens[keys.hoverTranslateY] ?? "0px";
  const sc = tokens[keys.hoverScale] ?? "1";

  for (const [type, preset] of Object.entries(HOVER_DEFAULTS)) {
    if (
      rx === preset.rotateX &&
      ry === preset.rotateY &&
      rz === preset.rotateZ &&
      ty === preset.translateY &&
      sc === preset.scale
    ) {
      return type as HoverEffectType;
    }
  }
  return "none";
}

// ── Component ────────────────────────────────────────────────────────────────

export function Hover3DControls({ keys }: Hover3DControlsProps) {
  const { tokens, setTokens, resetColor } = useThemeStore();

  const [effectType, setEffectType] = useState<HoverEffectType>(() =>
    detectActiveEffect(tokens, keys),
  );

  // Current fine-grained values (fallback to 0 for display when "" / unset)
  const hoverRx = parseFloat(tokens[keys.hoverRotateX] || "0");
  const hoverRy = parseFloat(tokens[keys.hoverRotateY] || "0");
  const hoverRz = parseFloat(tokens[keys.hoverRotateZ] || "0");
  const hoverTy = parseFloat(tokens[keys.hoverTranslateY] ?? "0");
  const hoverScale = parseFloat(tokens[keys.hoverScale] ?? "1");

  function applyEffect(type: HoverEffectType) {
    setEffectType(type);
    const preset = HOVER_DEFAULTS[type];
    setTokens({
      [keys.hoverRotateX]: preset.rotateX,
      [keys.hoverRotateY]: preset.rotateY,
      [keys.hoverRotateZ]: preset.rotateZ,
      [keys.hoverTranslateY]: preset.translateY,
      [keys.hoverScale]: preset.scale,
    } as Partial<ThemeTokens>);
  }

  function resetAll() {
    setEffectType("none");
    resetColor([
      keys.hoverRotateX,
      keys.hoverRotateY,
      keys.hoverRotateZ,
      keys.hoverTranslateY,
      keys.hoverScale,
    ]);
  }

  // Determine which fine-grained controls to show
  const shows3D =
    effectType === "tilt-forward" ||
    effectType === "tilt-side" ||
    effectType === "tilt-3d" ||
    effectType === "flip-peek" ||
    effectType === "lift-tilt";
  const showsLift =
    effectType === "lift" ||
    effectType === "lift-scale" ||
    effectType === "lift-tilt";
  const showsScale = effectType === "scale" || effectType === "lift-scale";

  return (
    <Section title="Hover animation">
      {/* Effect type selector */}
      <Row label="Effect" onReset={resetAll}>
        {EFFECT_OPTIONS.map((o) => (
          <Chip
            key={o.value}
            active={effectType === o.value}
            onClick={() => applyEffect(o.value)}
          >
            {o.label}
          </Chip>
        ))}
      </Row>

      {/* Lift controls */}
      {showsLift && (
        <SliderRow
          label={`Lift — ${Math.abs(hoverTy)}px`}
          min={1}
          max={12}
          step={1}
          value={Math.abs(hoverTy)}
          onChange={(v) =>
            setTokens({
              [keys.hoverTranslateY]: `-${v}px`,
            } as Partial<ThemeTokens>)
          }
          hint={["1px subtle", "12px floating"]}
        />
      )}

      {/* Scale controls */}
      {showsScale && (
        <SliderRow
          label={`Scale — ${hoverScale.toFixed(2)}×`}
          min={1.01}
          max={1.15}
          step={0.01}
          value={hoverScale}
          onChange={(v) =>
            setTokens({
              [keys.hoverScale]: v.toFixed(2),
            } as Partial<ThemeTokens>)
          }
          hint={["1.01 subtle", "1.15 strong"]}
        />
      )}

      {/* 3D rotation controls */}
      {shows3D && (
        <>
          <SliderRow
            label={`Hover X — ${hoverRx}°`}
            min={-30}
            max={30}
            step={1}
            value={hoverRx}
            onChange={(v) =>
              setTokens({
                [keys.hoverRotateX]: `${v}deg`,
              } as Partial<ThemeTokens>)
            }
            hint={["-30° backward", "30° forward"]}
          />
          <SliderRow
            label={`Hover Y — ${hoverRy}°`}
            min={-30}
            max={30}
            step={1}
            value={hoverRy}
            onChange={(v) =>
              setTokens({
                [keys.hoverRotateY]: `${v}deg`,
              } as Partial<ThemeTokens>)
            }
            hint={["-30° left", "30° right"]}
          />
          <SliderRow
            label={`Hover Z — ${hoverRz}°`}
            min={-20}
            max={20}
            step={1}
            value={hoverRz}
            onChange={(v) =>
              setTokens({
                [keys.hoverRotateZ]: `${v}deg`,
              } as Partial<ThemeTokens>)
            }
            hint={["-20° counter-cw", "20° clockwise"]}
          />
        </>
      )}

      {/* Transition speed — shown for all non-none effects */}
      {effectType !== "none" && (
        <TransitionRow tokenKey={keys.transitionDuration} />
      )}
    </Section>
  );
}
