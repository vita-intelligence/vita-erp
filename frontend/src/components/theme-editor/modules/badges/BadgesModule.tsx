"use client";

import { useThemeStore } from "@/stores/theme";
import { Chip, FontWeightRow, Row, Section } from "../_shared";
import { Preview } from "./Preview";

const SHAPE_PRESETS = [
  { label: "Square", value: "0px" },
  { label: "Soft", value: "4px" },
  { label: "Rounded", value: "8px" },
  { label: "Large", value: "16px" },
  { label: "Pill", value: "9999px" },
];

export function BadgesModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const isPill = parseFloat(tokens.badgeRadius) >= 100;

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-neutral-500">
        Controls the appearance of status badges, chips, and tags. Shape affects
        how rounded they appear — from sharp square labels to full pill shapes.
      </p>

      <Preview />

      {/* ── Shape ── */}
      <Section title="Shape">
        <Row label="Preset" onReset={() => resetColor(["badgeRadius"])}>
          {SHAPE_PRESETS.map((p) => {
            const isActive =
              p.value === "9999px" ? isPill : tokens.badgeRadius === p.value;
            return (
              <Chip
                key={p.value}
                active={isActive}
                onClick={() => setTokens({ badgeRadius: p.value })}
              >
                {p.label}
              </Chip>
            );
          })}
        </Row>

        {!isPill && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-vita-neutral-500">Fine-tune</span>
              <span className="text-xs font-semibold text-vita-neutral-600">
                {parseFloat(tokens.badgeRadius)}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={32}
              step={1}
              value={Math.min(parseFloat(tokens.badgeRadius), 32)}
              className="w-full accent-vita-primary"
              onChange={(e) =>
                setTokens({ badgeRadius: `${e.target.value}px` })
              }
            />
            <div className="flex justify-between text-xs text-vita-neutral-400">
              <span>0 — square</span>
              <span>32px — rounded</span>
            </div>
          </div>
        )}
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <FontWeightRow tokenKey="badgeFontWeight" />
      </Section>
    </div>
  );
}
