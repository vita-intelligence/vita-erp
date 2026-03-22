"use client";

import { useThemeStore } from "@/stores/theme";

import {
  BorderStyleRow,
  Chip,
  FontWeightRow,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  TransitionRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "Soft", value: "4px" },
  { label: "Rounded", value: "8px" },
  { label: "Circle", value: "9999px" },
];

const SIZE_PRESETS = [
  { label: "Small", value: "16px" },
  { label: "Medium", value: "20px" },
  { label: "Large", value: "24px" },
  { label: "XL", value: "28px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function CheckboxModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const sizePx = parseFloat(tokens.checkboxSize ?? "20");
  const radiusPx = parseFloat(tokens.checkboxRadius ?? "4");
  const borderPx = parseFloat(tokens.checkboxBorderWidth ?? "2");
  const gapPx = parseFloat(tokens.checkboxGap ?? "8");
  const labelFontPx = parseFloat(tokens.checkboxLabelFontSize ?? "14");
  const indicatorPx = parseFloat(tokens.checkboxIndicatorSize ?? "12");
  const strokeW = parseFloat(tokens.checkboxIndicatorStroke ?? "2.5");
  const checkedScale = parseFloat(tokens.checkboxCheckedScale ?? "0.95");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the appearance of all checkboxes — the control box, checkmark
        indicator, and label text across the entire interface.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Control box ── */}
      <Section title="Control box">
        <Row label="Size preset" onReset={() => resetColor(["checkboxSize"])}>
          {SIZE_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.checkboxSize === p.value}
              onClick={() => setTokens({ checkboxSize: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`Size — ${sizePx}px`}
          min={14}
          max={32}
          step={1}
          value={sizePx}
          onChange={(v) => setTokens({ checkboxSize: `${v}px` })}
          hint={["14px compact", "32px large"]}
          onReset={() => resetColor(["checkboxSize"])}
        />

        <Row
          label="Radius preset"
          onReset={() => resetColor(["checkboxRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? radiusPx >= 100
                  : tokens.checkboxRadius === p.value
              }
              onClick={() => setTokens({ checkboxRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        {radiusPx < 100 && (
          <SliderRow
            label={`Radius — ${radiusPx}px`}
            min={0}
            max={16}
            step={1}
            value={radiusPx}
            onChange={(v) => setTokens({ checkboxRadius: `${v}px` })}
            hint={["0 sharp", "16px rounded"]}
          />
        )}
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <SliderRow
          label={`Width — ${borderPx}px`}
          min={1}
          max={4}
          step={0.5}
          value={borderPx}
          onChange={(v) => setTokens({ checkboxBorderWidth: `${v}px` })}
          hint={["1px thin", "4px heavy"]}
          onReset={() => resetColor(["checkboxBorderWidth"])}
        />
        <BorderStyleRow tokenKey="checkboxBorderStyle" />
      </Section>

      {/* ── Indicator (checkmark) ── */}
      <Section title="Indicator">
        <SliderRow
          label={`Icon size — ${indicatorPx}px`}
          min={8}
          max={24}
          step={1}
          value={indicatorPx}
          onChange={(v) => setTokens({ checkboxIndicatorSize: `${v}px` })}
          hint={["8px small", "24px large"]}
          onReset={() => resetColor(["checkboxIndicatorSize"])}
        />
        <SliderRow
          label={`Stroke — ${strokeW}`}
          min={1}
          max={5}
          step={0.5}
          value={strokeW}
          onChange={(v) => setTokens({ checkboxIndicatorStroke: `${v}` })}
          hint={["1 thin", "5 heavy"]}
          onReset={() => resetColor(["checkboxIndicatorStroke"])}
        />
      </Section>

      {/* ── Label ── */}
      <Section title="Label">
        <SliderRow
          label={`Font size — ${labelFontPx}px`}
          min={10}
          max={20}
          step={1}
          value={labelFontPx}
          onChange={(v) => setTokens({ checkboxLabelFontSize: `${v}px` })}
          hint={["10px small", "20px large"]}
          onReset={() => resetColor(["checkboxLabelFontSize"])}
        />
        <FontWeightRow tokenKey="checkboxLabelFontWeight" label="Weight" />
        <SliderRow
          label={`Gap — ${gapPx}px`}
          min={4}
          max={16}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ checkboxGap: `${v}px` })}
          hint={["4px tight", "16px spacious"]}
          onReset={() => resetColor(["checkboxGap"])}
        />
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.checkboxShadow}
          onChange={(v) => setTokens({ checkboxShadow: v })}
          onReset={() => resetColor(["checkboxShadow"])}
          defaults={{ y: 1, blur: 3, opacity: 10 }}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title="Motion">
        <SliderRow
          label={`Check scale — ${checkedScale.toFixed(2)}×`}
          min={0.8}
          max={1}
          step={0.01}
          value={checkedScale}
          onChange={(v) => setTokens({ checkboxCheckedScale: v.toFixed(2) })}
          hint={["0.80 strong pop", "1.00 none"]}
          onReset={() => resetColor(["checkboxCheckedScale"])}
        />
        <TransitionRow tokenKey="checkboxTransitionDuration" />
      </Section>
    </div>
  );
}
