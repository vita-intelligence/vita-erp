"use client";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Radius presets ───────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
  { label: "16px", value: "16px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function CardsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const radiusPx = parseFloat(tokens.cardRadius);

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the appearance of all cards and panels — the primary content
        containers across the ERP interface.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title="Shape">
        <SliderRow
          label={`Radius — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={radiusPx}
          onChange={(v) => setTokens({ cardRadius: `${v}px` })}
          hint={["0 sharp", "24px rounded"]}
          onReset={() => resetColor(["cardRadius"])}
        />
        <Row label="Quick presets">
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.cardRadius === p.value}
              onClick={() => setTokens({ cardRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <BorderControls
          keys={{
            top: "cardBorderTop",
            right: "cardBorderRight",
            bottom: "cardBorderBottom",
            left: "cardBorderLeft",
          }}
          max={5}
          step={0.5}
          hintMax="5px heavy"
        />
        <BorderStyleRow tokenKey="cardBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.cardShadow}
          onChange={(v) => setTokens({ cardShadow: v })}
          onReset={() => resetColor(["cardShadow"])}
          defaults={{ y: 6, blur: 10, opacity: 8 }}
        />
      </Section>
    </div>
  );
}
