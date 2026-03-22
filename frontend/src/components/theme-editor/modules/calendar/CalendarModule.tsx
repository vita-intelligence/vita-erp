"use client";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  FontWeightRow,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "Square", value: "0px" },
  { label: "Soft", value: "6px" },
  { label: "Rounded", value: "12px" },
  { label: "Large", value: "20px" },
];

const CELL_RADIUS_PRESETS = [
  { label: "Square", value: "0px" },
  { label: "Soft", value: "4px" },
  { label: "Rounded", value: "8px" },
  { label: "Circle", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function CalendarModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const radiusPx = parseFloat(tokens.calendarRadius ?? "0");
  const cellSizePx = parseFloat(tokens.calendarCellSize ?? "36");
  const cellRadiusPx = parseFloat(tokens.calendarCellRadius ?? "0");
  const isCellCircle = cellRadiusPx >= 100;
  const cellFontPx = parseFloat(tokens.calendarCellFontSize ?? "13");
  const headerFontPx = parseFloat(tokens.calendarHeaderFontSize ?? "15");
  const weekdayFontPx = parseFloat(tokens.calendarWeekdayFontSize ?? "11");
  const paddingPx = parseFloat(tokens.calendarPadding ?? "12");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the appearance of calendar panels and date pickers used in
        scheduling and production planning views.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Container shape ── */}
      <Section title="Container">
        <Row label="Radius" onReset={() => resetColor(["calendarRadius"])}>
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

        <SliderRow
          label={`Radius — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={Math.min(radiusPx, 24)}
          onChange={(v) => setTokens({ calendarRadius: `${v}px` })}
          hint={["0 square", "24px rounded"]}
        />

        <SliderRow
          label={`Padding — ${paddingPx}px`}
          min={4}
          max={24}
          step={2}
          value={paddingPx}
          onChange={(v) => setTokens({ calendarPadding: `${v}px` })}
          hint={["4px compact", "24px spacious"]}
          onReset={() => resetColor(["calendarPadding"])}
        />
      </Section>

      {/* ── Cells ── */}
      <Section title="Day cells">
        <SliderRow
          label={`Cell size — ${cellSizePx}px`}
          min={28}
          max={48}
          step={2}
          value={cellSizePx}
          onChange={(v) => setTokens({ calendarCellSize: `${v}px` })}
          hint={["28px compact", "48px large"]}
          onReset={() => resetColor(["calendarCellSize"])}
        />

        <Row
          label="Cell shape"
          onReset={() => resetColor(["calendarCellRadius"])}
        >
          {CELL_RADIUS_PRESETS.map((p) => {
            const active =
              p.value === "9999px"
                ? isCellCircle
                : tokens.calendarCellRadius === p.value;
            return (
              <Chip
                key={p.value}
                active={active}
                onClick={() => setTokens({ calendarCellRadius: p.value })}
              >
                {p.label}
              </Chip>
            );
          })}
        </Row>

        {!isCellCircle && (
          <SliderRow
            label={`Cell radius — ${cellRadiusPx}px`}
            min={0}
            max={16}
            step={1}
            value={Math.min(cellRadiusPx, 16)}
            onChange={(v) => setTokens({ calendarCellRadius: `${v}px` })}
            hint={["0 square", "16px rounded"]}
          />
        )}
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

      {/* ── Typography ── */}
      <Section title="Typography">
        <SliderRow
          label={`Cell font — ${cellFontPx}px`}
          min={10}
          max={18}
          step={1}
          value={cellFontPx}
          onChange={(v) => setTokens({ calendarCellFontSize: `${v}px` })}
          hint={["10px small", "18px large"]}
          onReset={() => resetColor(["calendarCellFontSize"])}
        />

        <SliderRow
          label={`Header font — ${headerFontPx}px`}
          min={12}
          max={22}
          step={1}
          value={headerFontPx}
          onChange={(v) => setTokens({ calendarHeaderFontSize: `${v}px` })}
          hint={["12px compact", "22px large"]}
          onReset={() => resetColor(["calendarHeaderFontSize"])}
        />

        <FontWeightRow
          tokenKey="calendarHeaderFontWeight"
          label="Header weight"
        />

        <SliderRow
          label={`Weekday font — ${weekdayFontPx}px`}
          min={9}
          max={14}
          step={1}
          value={weekdayFontPx}
          onChange={(v) => setTokens({ calendarWeekdayFontSize: `${v}px` })}
          hint={["9px tiny", "14px normal"]}
          onReset={() => resetColor(["calendarWeekdayFontSize"])}
        />
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
