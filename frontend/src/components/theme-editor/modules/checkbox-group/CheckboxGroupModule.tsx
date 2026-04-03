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
  usePreviewExternal,
} from "../_shared";
import { ColorInput } from "../colors/ColorInput";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "6px" },
  { label: "presets.rounded", value: "12px" },
];

const GAP_PRESETS = [
  { label: "presets.tight", value: "6px" },
  { label: "presets.default", value: "10px" },
  { label: "presets.relaxed", value: "14px" },
  { label: "presets.spacious", value: "20px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function CheckboxGroupModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const gapPx = parseFloat(tokens.checkboxGroupGap ?? "10");
  const radiusPx = parseFloat(tokens.checkboxGroupRadius ?? "0");
  const paddingX = parseFloat(tokens.checkboxGroupPaddingX ?? "0");
  const paddingY = parseFloat(tokens.checkboxGroupPaddingY ?? "0");
  const borderW = parseFloat(tokens.checkboxGroupBorderWidth ?? "0");
  const labelFontPx = parseFloat(tokens.checkboxGroupLabelFontSize ?? "14");
  const labelGapPx = parseFloat(tokens.checkboxGroupLabelGap ?? "8");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.checkboxGroup.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Spacing ── */}
      <Section title={t("sections.spacing")}>
        <Row
          label={t("labels.itemGap")}
          onReset={() => resetColor(["checkboxGroupGap"])}
        >
          {GAP_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.checkboxGroupGap === p.value}
              onClick={() => setTokens({ checkboxGroupGap: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`${t("labels.gap")} — ${gapPx}px`}
          min={2}
          max={28}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ checkboxGroupGap: `${v}px` })}
          hint={[`2px ${t("hints.dense")}`, `28px ${t("hints.airy")}`]}
        />

        <SliderRow
          label={`${t("labels.paddingX")} — ${paddingX}px`}
          min={0}
          max={24}
          step={2}
          value={paddingX}
          onChange={(v) => setTokens({ checkboxGroupPaddingX: `${v}px` })}
          hint={[`0 ${t("hints.flush")}`, `24px ${t("hints.padded")}`]}
          onReset={() => resetColor(["checkboxGroupPaddingX"])}
        />

        <SliderRow
          label={`${t("labels.paddingY")} — ${paddingY}px`}
          min={0}
          max={24}
          step={2}
          value={paddingY}
          onChange={(v) => setTokens({ checkboxGroupPaddingY: `${v}px` })}
          hint={[`0 ${t("hints.flush")}`, `24px ${t("hints.padded")}`]}
          onReset={() => resetColor(["checkboxGroupPaddingY"])}
        />
      </Section>

      {/* ── Container shape ── */}
      <Section title={t("sections.container")}>
        <Row
          label={t("labels.radius")}
          onReset={() => resetColor(["checkboxGroupRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.checkboxGroupRadius === p.value}
              onClick={() => setTokens({ checkboxGroupRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        {radiusPx > 0 && (
          <SliderRow
            label={`${t("labels.radius")} — ${radiusPx}px`}
            min={0}
            max={20}
            step={1}
            value={radiusPx}
            onChange={(v) => setTokens({ checkboxGroupRadius: `${v}px` })}
            hint={[`0 ${t("hints.sharp")}`, `20px ${t("hints.rounded")}`]}
          />
        )}

        <SliderRow
          label={`${t("labels.border")} — ${borderW}px`}
          min={0}
          max={3}
          step={0.5}
          value={borderW}
          onChange={(v) => setTokens({ checkboxGroupBorderWidth: `${v}px` })}
          hint={[`0 ${t("hints.none")}`, `3px ${t("hints.heavy")}`]}
          onReset={() => resetColor(["checkboxGroupBorderWidth"])}
        />

        {borderW > 0 && <BorderStyleRow tokenKey="checkboxGroupBorderStyle" />}

        <Row
          label={t("labels.borderColor")}
          onReset={() => resetColor(["checkboxGroupBorderColor"])}
        >
          <div className="flex items-center gap-2">
            <ColorInput
              value={cssColorToHex(tokens.checkboxGroupBorderColor)}
              onChange={(hex) => setTokens({ checkboxGroupBorderColor: hex })}
              title={t("labels.borderColor")}
            />
            <span
              className="text-xs font-vita-mono"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {tokens.checkboxGroupBorderColor}
            </span>
          </div>
        </Row>
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.shadow")}>
        <ShadowBuilder
          value={tokens.checkboxGroupShadow}
          onChange={(v) => setTokens({ checkboxGroupShadow: v })}
          onReset={() => resetColor(["checkboxGroupShadow"])}
          defaults={{ y: 2, blur: 4, opacity: 6 }}
        />
      </Section>

      {/* ── Group label ── */}
      <Section title={t("sections.groupLabel")}>
        <SliderRow
          label={`${t("labels.fontSize")} — ${labelFontPx}px`}
          min={10}
          max={20}
          step={1}
          value={labelFontPx}
          onChange={(v) => setTokens({ checkboxGroupLabelFontSize: `${v}px` })}
          hint={[`10px ${t("hints.small")}`, `20px ${t("hints.large")}`]}
          onReset={() => resetColor(["checkboxGroupLabelFontSize"])}
        />
        <FontWeightRow
          tokenKey="checkboxGroupLabelFontWeight"
          label={t("labels.weight")}
        />
        <SliderRow
          label={`${t("labels.gap")} — ${labelGapPx}px`}
          min={2}
          max={16}
          step={1}
          value={labelGapPx}
          onChange={(v) => setTokens({ checkboxGroupLabelGap: `${v}px` })}
          hint={[`2px ${t("hints.tight")}`, `16px ${t("hints.spaced")}`]}
          onReset={() => resetColor(["checkboxGroupLabelGap"])}
        />
      </Section>
    </div>
  );
}
