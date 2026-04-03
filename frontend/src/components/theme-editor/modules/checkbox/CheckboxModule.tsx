"use client";

import { useTranslations } from "next-intl";

import { cssColorToHex } from "@/lib/color";
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
import { ColorInput } from "../colors/ColorInput";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "4px" },
  { label: "presets.rounded", value: "8px" },
  { label: "presets.circle", value: "9999px" },
];

const SIZE_PRESETS = [
  { label: "presets.small", value: "16px" },
  { label: "presets.medium", value: "20px" },
  { label: "presets.large", value: "24px" },
  { label: "presets.xl", value: "28px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function CheckboxModule() {
  const t = useTranslations("themeEditor");
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
        {t("modules.checkbox.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Control box ── */}
      <Section title={t("sections.controlBox")}>
        <Row
          label={t("labels.sizePreset")}
          onReset={() => resetColor(["checkboxSize"])}
        >
          {SIZE_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.checkboxSize === p.value}
              onClick={() => setTokens({ checkboxSize: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`${t("labels.size")} — ${sizePx}px`}
          min={14}
          max={32}
          step={1}
          value={sizePx}
          onChange={(v) => setTokens({ checkboxSize: `${v}px` })}
          hint={[`14px ${t("hints.compact")}`, `32px ${t("hints.large")}`]}
          onReset={() => resetColor(["checkboxSize"])}
        />

        <Row
          label={t("labels.radiusPreset")}
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
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        {radiusPx < 100 && (
          <SliderRow
            label={`${t("labels.radius")} — ${radiusPx}px`}
            min={0}
            max={16}
            step={1}
            value={radiusPx}
            onChange={(v) => setTokens({ checkboxRadius: `${v}px` })}
            hint={[`0 ${t("hints.sharp")}`, `16px ${t("hints.rounded")}`]}
          />
        )}
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <SliderRow
          label={`${t("labels.width")} — ${borderPx}px`}
          min={1}
          max={4}
          step={0.5}
          value={borderPx}
          onChange={(v) => setTokens({ checkboxBorderWidth: `${v}px` })}
          hint={[`1px ${t("hints.thin")}`, `4px ${t("hints.heavy")}`]}
          onReset={() => resetColor(["checkboxBorderWidth"])}
        />
        <BorderStyleRow tokenKey="checkboxBorderStyle" />
        <Row
          label={t("labels.borderColor")}
          onReset={() => resetColor(["checkboxBorderColor"])}
        >
          <div className="flex items-center gap-2">
            <ColorInput
              value={cssColorToHex(tokens.checkboxBorderColor)}
              onChange={(hex) => setTokens({ checkboxBorderColor: hex })}
              title={t("labels.borderColor")}
            />
            <span
              className="text-xs font-vita-mono"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {tokens.checkboxBorderColor}
            </span>
          </div>
        </Row>
      </Section>

      {/* ── Indicator (checkmark) ── */}
      <Section title={t("sections.indicator")}>
        <SliderRow
          label={`${t("labels.iconSize")} — ${indicatorPx}px`}
          min={8}
          max={24}
          step={1}
          value={indicatorPx}
          onChange={(v) => setTokens({ checkboxIndicatorSize: `${v}px` })}
          hint={[`8px ${t("hints.small")}`, `24px ${t("hints.large")}`]}
          onReset={() => resetColor(["checkboxIndicatorSize"])}
        />
        <SliderRow
          label={`${t("labels.stroke")} — ${strokeW}`}
          min={1}
          max={5}
          step={0.5}
          value={strokeW}
          onChange={(v) => setTokens({ checkboxIndicatorStroke: `${v}` })}
          hint={[`1 ${t("hints.thin")}`, `5 ${t("hints.heavy")}`]}
          onReset={() => resetColor(["checkboxIndicatorStroke"])}
        />
      </Section>

      {/* ── Label ── */}
      <Section title={t("sections.label")}>
        <SliderRow
          label={`${t("labels.fontSize")} — ${labelFontPx}px`}
          min={10}
          max={20}
          step={1}
          value={labelFontPx}
          onChange={(v) => setTokens({ checkboxLabelFontSize: `${v}px` })}
          hint={[`10px ${t("hints.small")}`, `20px ${t("hints.large")}`]}
          onReset={() => resetColor(["checkboxLabelFontSize"])}
        />
        <FontWeightRow
          tokenKey="checkboxLabelFontWeight"
          label={t("labels.weight")}
        />
        <SliderRow
          label={`${t("labels.gap")} — ${gapPx}px`}
          min={4}
          max={16}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ checkboxGap: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `16px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["checkboxGap"])}
        />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.shadow")}>
        <ShadowBuilder
          value={tokens.checkboxShadow}
          onChange={(v) => setTokens({ checkboxShadow: v })}
          onReset={() => resetColor(["checkboxShadow"])}
          defaults={{ y: 1, blur: 3, opacity: 10 }}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title={t("sections.motion")}>
        <SliderRow
          label={`${t("labels.checkScale")} — ${checkedScale.toFixed(2)}×`}
          min={0.8}
          max={1}
          step={0.01}
          value={checkedScale}
          onChange={(v) => setTokens({ checkboxCheckedScale: v.toFixed(2) })}
          hint={[`0.80 ${t("hints.strongPop")}`, `1.00 ${t("hints.none")}`]}
          onReset={() => resetColor(["checkboxCheckedScale"])}
        />
        <TransitionRow tokenKey="checkboxTransitionDuration" />
      </Section>
    </div>
  );
}
