"use client";

/**
 * Transform3DControls — shared 3D rotation sliders for static (idle) rotation.
 *
 * Provides per-axis sliders (X, Y, Z) and quick presets.
 * Used by any module that supports 3D transforms.
 */

import { useTranslations } from "next-intl";

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
  labelKey: string;
  x: string;
  y: string;
  z: string;
};

const PRESETS: Preset3D[] = [
  { labelKey: "presets.flat", x: "0deg", y: "0deg", z: "0deg" },
  { labelKey: "presets.subtleTilt", x: "2deg", y: "3deg", z: "0deg" },
  { labelKey: "presets.forwardLean", x: "5deg", y: "0deg", z: "0deg" },
  { labelKey: "presets.sideLean", x: "0deg", y: "5deg", z: "0deg" },
  { labelKey: "presets.twist", x: "0deg", y: "0deg", z: "3deg" },
  { labelKey: "presets.dramatic", x: "8deg", y: "-6deg", z: "2deg" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function Transform3DControls({ keys }: Transform3DControlsProps) {
  const t = useTranslations("themeEditor");
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
    <Section title={t("transform3d.title")}>
      <Row
        label={t("transform3d.presets")}
        onReset={() => resetColor([keys.rotateX, keys.rotateY, keys.rotateZ])}
      >
        {PRESETS.map((p) => (
          <Chip
            key={p.labelKey}
            active={isPresetActive(p)}
            onClick={() => applyPreset(p)}
          >
            {t(p.labelKey)}
          </Chip>
        ))}
      </Row>

      <SliderRow
        label={`${t("transform3d.rotateX")} — ${xDeg}°`}
        min={-180}
        max={180}
        step={1}
        value={xDeg}
        onChange={(v) =>
          setTokens({
            [keys.rotateX]: `${v}deg`,
          } as Partial<ThemeTokens>)
        }
        hint={[
          `-180° ${t("transform3d.hintXBack")}`,
          `180° ${t("transform3d.hintXForward")}`,
        ]}
        onReset={() => resetColor([keys.rotateX])}
      />

      <SliderRow
        label={`${t("transform3d.rotateY")} — ${yDeg}°`}
        min={-180}
        max={180}
        step={1}
        value={yDeg}
        onChange={(v) =>
          setTokens({
            [keys.rotateY]: `${v}deg`,
          } as Partial<ThemeTokens>)
        }
        hint={[
          `-180° ${t("transform3d.hintYLeft")}`,
          `180° ${t("transform3d.hintYRight")}`,
        ]}
        onReset={() => resetColor([keys.rotateY])}
      />

      <SliderRow
        label={`${t("transform3d.rotateZ")} — ${zDeg}°`}
        min={-180}
        max={180}
        step={1}
        value={zDeg}
        onChange={(v) =>
          setTokens({
            [keys.rotateZ]: `${v}deg`,
          } as Partial<ThemeTokens>)
        }
        hint={[
          `-180° ${t("transform3d.hintZCcw")}`,
          `180° ${t("transform3d.hintZCw")}`,
        ]}
        onReset={() => resetColor([keys.rotateZ])}
      />
    </Section>
  );
}
