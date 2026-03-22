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

const RADIUS_PRESETS = [
  { label: "Square", value: "0px" },
  { label: "Soft", value: "6px" },
  { label: "Rounded", value: "12px" },
  { label: "Large", value: "20px" },
];

export function CalendarModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const radiusPx = parseFloat(tokens.calendarRadius ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the container appearance of calendar panels and date pickers.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title="Shape">
        <SliderRow
          label={`Radius — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={Math.min(radiusPx, 24)}
          onChange={(v) => setTokens({ calendarRadius: `${v}px` })}
          hint={["0 square", "24px rounded"]}
          onReset={() => resetColor(["calendarRadius"])}
        />
        <Row label="Quick presets">
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.calendarRadius === p.value}
              onClick={() => setTokens({ calendarRadius: p.value })}
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
            top: "calendarBorderTop",
            right: "calendarBorderRight",
            bottom: "calendarBorderBottom",
            left: "calendarBorderLeft",
          }}
          max={3}
          step={0.5}
          hintMax="3px heavy"
        />
        <BorderStyleRow tokenKey="calendarBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.calendarShadow ?? "none"}
          onChange={(v) => setTokens({ calendarShadow: v })}
          onReset={() => resetColor(["calendarShadow"])}
          defaults={{ y: 2, blur: 6, opacity: 8 }}
        />
      </Section>
    </div>
  );
}
