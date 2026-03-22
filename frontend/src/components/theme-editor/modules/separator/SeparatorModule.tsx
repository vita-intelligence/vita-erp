"use client";

import { useThemeStore } from "@/stores/theme";

import { Chip, Row, Section, SliderRow, usePreviewExternal } from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "Rounded", value: "3px" },
  { label: "Pill", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function SeparatorModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const thicknessPx = parseFloat(tokens.separatorThickness ?? "1");
  const radiusPx = parseFloat(tokens.separatorRadius ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the thickness and shape of divider lines.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Thickness ── */}
      <Section title="Thickness">
        <SliderRow
          label={`Thickness — ${thicknessPx}px`}
          min={1}
          max={6}
          step={1}
          value={thicknessPx}
          onChange={(v) => setTokens({ separatorThickness: `${v}px` })}
          hint={["1px thin", "6px heavy"]}
          onReset={() => resetColor(["separatorThickness"])}
        />
      </Section>

      {/* ── Shape ── */}
      <Section title="Shape">
        <Row
          label="Radius preset"
          onReset={() => resetColor(["separatorRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? radiusPx >= 100
                  : tokens.separatorRadius === p.value
              }
              onClick={() => setTokens({ separatorRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        {radiusPx < 100 && (
          <SliderRow
            label={`Radius — ${radiusPx}px`}
            min={0}
            max={6}
            step={1}
            value={radiusPx}
            onChange={(v) => setTokens({ separatorRadius: `${v}px` })}
            hint={["0 sharp", "6px round"]}
          />
        )}
      </Section>
    </div>
  );
}
