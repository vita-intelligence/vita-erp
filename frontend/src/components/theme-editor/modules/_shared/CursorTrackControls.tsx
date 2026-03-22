"use client";

/**
 * CursorTrackControls — shared cursor-tracking controls for any component.
 *
 * Renders intensity presets, a fine-grained slider, and a restore speed
 * control. Used by cards, buttons, badges, avatars, and calendar modules.
 */

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
  { label: "Off", value: "0" },
  { label: "Subtle", value: "6" },
  { label: "Moderate", value: "12" },
  { label: "Strong", value: "20" },
  { label: "Dramatic", value: "30" },
];

// ── Component ────────────────────────────────────────────────────────────────

export function CursorTrackControls({ keys }: CursorTrackControlsProps) {
  const { tokens, setTokens, resetColor } = useThemeStore();

  const intensity = parseFloat(tokens[keys.intensity] ?? "0");
  const restoreMs = parseFloat(tokens[keys.restore] ?? "300");

  return (
    <Section title="Cursor tracking">
      <p className="text-xs text-vita-text-muted">
        Element rotates dynamically based on cursor position — the closer to an
        edge, the more it tilts toward you.
      </p>

      <Row label="Intensity" onReset={() => resetColor([keys.intensity])}>
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
            {p.label}
          </Chip>
        ))}
      </Row>

      {intensity > 0 && (
        <>
          <SliderRow
            label={`Intensity — ${intensity}°`}
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
            label={`Restore — ${restoreMs}ms`}
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
