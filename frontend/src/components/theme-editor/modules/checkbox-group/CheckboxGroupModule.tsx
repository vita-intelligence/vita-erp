"use client";

import { useTranslations } from "next-intl";

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
          label={`Gap — ${gapPx}px`}
          min={2}
          max={28}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ checkboxGroupGap: `${v}px` })}
          hint={["2px dense", "28px airy"]}
        />

        <SliderRow
          label={`Padding X — ${paddingX}px`}
          min={0}
          max={24}
          step={2}
          value={paddingX}
          onChange={(v) => setTokens({ checkboxGroupPaddingX: `${v}px` })}
          hint={["0 flush", "24px padded"]}
          onReset={() => resetColor(["checkboxGroupPaddingX"])}
        />

        <SliderRow
          label={`Padding Y — ${paddingY}px`}
          min={0}
          max={24}
          step={2}
          value={paddingY}
          onChange={(v) => setTokens({ checkboxGroupPaddingY: `${v}px` })}
          hint={["0 flush", "24px padded"]}
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
            label={`Radius — ${radiusPx}px`}
            min={0}
            max={20}
            step={1}
            value={radiusPx}
            onChange={(v) => setTokens({ checkboxGroupRadius: `${v}px` })}
            hint={["0 sharp", "20px rounded"]}
          />
        )}

        <SliderRow
          label={`Border — ${borderW}px`}
          min={0}
          max={3}
          step={0.5}
          value={borderW}
          onChange={(v) => setTokens({ checkboxGroupBorderWidth: `${v}px` })}
          hint={["0 none", "3px heavy"]}
          onReset={() => resetColor(["checkboxGroupBorderWidth"])}
        />

        {borderW > 0 && <BorderStyleRow tokenKey="checkboxGroupBorderStyle" />}
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
          label={`Font size — ${labelFontPx}px`}
          min={10}
          max={20}
          step={1}
          value={labelFontPx}
          onChange={(v) => setTokens({ checkboxGroupLabelFontSize: `${v}px` })}
          hint={["10px small", "20px large"]}
          onReset={() => resetColor(["checkboxGroupLabelFontSize"])}
        />
        <FontWeightRow
          tokenKey="checkboxGroupLabelFontWeight"
          label={t("labels.weight")}
        />
        <SliderRow
          label={`Label gap — ${labelGapPx}px`}
          min={2}
          max={16}
          step={1}
          value={labelGapPx}
          onChange={(v) => setTokens({ checkboxGroupLabelGap: `${v}px` })}
          hint={["2px tight", "16px spaced"]}
          onReset={() => resetColor(["checkboxGroupLabelGap"])}
        />
      </Section>
    </div>
  );
}
