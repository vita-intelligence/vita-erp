"use client";

/**
 * Transform3DControls — shared 3D rotation sliders for static (idle) rotation.
 *
 * Provides per-axis sliders (X, Y, Z) and quick presets.
 * Used by any module that supports 3D transforms.
 */

import type { ThemeTokens } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

import { Chip, Row, Section, SliderRow } from "./primitives";

// ── Types ────────────────────────────────────────────────────────────────────

export type Transform3DKeys = {
  rotateX: keyof ThemeTokens;
  rotateY: keyof ThemeTokens;
  rotateZ: keyof ThemeTokens;
};

export type Transform3DControlsProps = {
  keys: Transform3DKeys;
};

// ── Presets ──────────────────────────────────────────────────────────────────

type Preset3D = {
  label: string;
  x: string;
  y: string;
  z: string;
};

const PRESETS: Preset3D[] = [
  { label: "Flat", x: "0deg", y: "0deg", z: "0deg" },
  { label: "Subtle tilt", x: "2deg", y: "3deg", z: "0deg" },
  { label: "Forward lean", x: "5deg", y: "0deg", z: "0deg" },
  { label: "Side lean", x: "0deg", y: "5deg", z: "0deg" },
  { label: "Twist", x: "0deg", y: "0deg", z: "3deg" },
  { label: "Dramatic", x: "8deg", y: "-6deg", z: "2deg" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function Transform3DControls({ keys }: Transform3DControlsProps) {
  const { tokens, setTokens, resetColor } = useThemeStore();

  const xDeg = parseFloat(tokens[keys.rotateX] ?? "0");
  const yDeg = parseFloat(tokens[keys.rotateY] ?? "0");
  const zDeg = parseFloat(tokens[keys.rotateZ] ?? "0");

  function applyPreset(preset: Preset3D) {
    setTokens({
      [keys.rotateX]: preset.x,
      [keys.rotateY]: preset.y,
      [keys.rotateZ]: preset.z,
    } as Partial<ThemeTokens>);
  }

  function isPresetActive(preset: Preset3D): boolean {
    return (
      tokens[keys.rotateX] === preset.x &&
      tokens[keys.rotateY] === preset.y &&
      tokens[keys.rotateZ] === preset.z
    );
  }

  return (
    <Section title="3D Transform">
      <Row
        label="Presets"
        onReset={() => resetColor([keys.rotateX, keys.rotateY, keys.rotateZ])}
      >
        {PRESETS.map((p) => (
          <Chip
            key={p.label}
            active={isPresetActive(p)}
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </Chip>
        ))}
      </Row>

      <SliderRow
        label={`Rotate X — ${xDeg}°`}
        min={-180}
        max={180}
        step={1}
        value={xDeg}
        onChange={(v) =>
          setTokens({
            [keys.rotateX]: `${v}deg`,
          } as Partial<ThemeTokens>)
        }
        hint={["-180° full back", "180° full forward"]}
        onReset={() => resetColor([keys.rotateX])}
      />

      <SliderRow
        label={`Rotate Y — ${yDeg}°`}
        min={-180}
        max={180}
        step={1}
        value={yDeg}
        onChange={(v) =>
          setTokens({
            [keys.rotateY]: `${v}deg`,
          } as Partial<ThemeTokens>)
        }
        hint={["-180° full left", "180° full right"]}
        onReset={() => resetColor([keys.rotateY])}
      />

      <SliderRow
        label={`Rotate Z — ${zDeg}°`}
        min={-180}
        max={180}
        step={1}
        value={zDeg}
        onChange={(v) =>
          setTokens({
            [keys.rotateZ]: `${v}deg`,
          } as Partial<ThemeTokens>)
        }
        hint={["-180° counter-cw", "180° clockwise"]}
        onReset={() => resetColor([keys.rotateZ])}
      />
    </Section>
  );
}
