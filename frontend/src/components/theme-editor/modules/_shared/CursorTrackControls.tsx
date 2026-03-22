"use client";

/**
 * CursorTrackControls — shared cursor-tracking controls for any component.
 *
 * Renders intensity presets, a fine-grained slider, and a restore speed
 * control. Used by cards, buttons, badges, avatars, and calendar modules.
 */

import { useTranslations } from "next-intl";

import type { ThemeTokens } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

import { Chip, Row, Section, SliderRow } from "./primitives";

// ── Types ────────────────────────────────────────────────────────────────────

export type CursorTrackKeys = {
  intensity: keyof ThemeTokens;
  restore: keyof ThemeTokens;
};

export type CursorTrackControlsProps = {
  keys: CursorTrackKeys;
};

// ── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = [
  { labelKey: "cursorTrack.off", value: "0" },
  { labelKey: "cursorTrack.subtle", value: "6" },
  { labelKey: "cursorTrack.moderate", value: "12" },
  { labelKey: "cursorTrack.strong", value: "20" },
  { labelKey: "cursorTrack.dramatic", value: "30" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function CursorTrackControls({ keys }: CursorTrackControlsProps) {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();

  const intensity = parseFloat(tokens[keys.intensity] ?? "0");
  const restoreMs = parseFloat(tokens[keys.restore] ?? "300");

  return (
    <Section title={t("cursorTrack.title")}>
      <p className="text-xs text-vita-text-muted">
        {t("cursorTrack.description")}
      </p>

      <Row
        label={t("cursorTrack.intensity")}
        onReset={() => resetColor([keys.intensity])}
      >
        {PRESETS.map((p) => (
          <Chip
            key={p.value}
            active={tokens[keys.intensity] === p.value}
            onClick={() =>
              setTokens({
                [keys.intensity]: p.value,
              } as Partial<ThemeTokens>)
            }
          >
            {t(p.labelKey)}
          </Chip>
        ))}
      </Row>

      {intensity > 0 && (
        <>
          <SliderRow
            label={`${t("cursorTrack.intensity")} — ${intensity}°`}
            min={1}
            max={40}
            step={1}
            value={intensity}
            onChange={(v) =>
              setTokens({
                [keys.intensity]: `${v}`,
              } as Partial<ThemeTokens>)
            }
            hint={["1° subtle", "40° extreme"]}
          />
          <SliderRow
            label={`${t("cursorTrack.restore")} — ${restoreMs}ms`}
            min={100}
            max={1000}
            step={50}
            value={restoreMs}
            onChange={(v) =>
              setTokens({
                [keys.restore]: `${v}ms`,
              } as Partial<ThemeTokens>)
            }
            hint={["100ms snappy", "1000ms slow"]}
          />
        </>
      )}
    </Section>
  );
}
