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

// ── Radius presets ───────────────────────────────────────────────────────────

const RADIUS_PRESETS_RAW = [
  { labelKey: "sharp", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
  { label: "16px", value: "16px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function AccordionModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const RADIUS_PRESETS = RADIUS_PRESETS_RAW.map((p) => ({
    label: "labelKey" in p ? t(`presets.${p.labelKey}`) : p.label,
    value: p.value,
  }));

  const radiusPx = parseFloat(tokens.accordionRadius ?? "0");
  const borderWidthPx = parseFloat(tokens.accordionBorderWidth ?? "1");
  const separatorPx = parseFloat(tokens.accordionSeparatorHeight ?? "1");
  const triggerPxX = parseFloat(tokens.accordionTriggerPaddingX ?? "16");
  const triggerPxY = parseFloat(tokens.accordionTriggerPaddingY ?? "12");
  const contentPxX = parseFloat(tokens.accordionContentPaddingX ?? "16");
  const contentPxY = parseFloat(tokens.accordionContentPaddingY ?? "8");
  const triggerFontPx = parseFloat(tokens.accordionTriggerFontSize ?? "14");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.accordion.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <SliderRow
          label={`${t("labels.radius")} — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={radiusPx}
          onChange={(v) => setTokens({ accordionRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `24px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["accordionRadius"])}
        />
        <Row label="Quick presets">
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.accordionRadius === p.value}
              onClick={() => setTokens({ accordionRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <SliderRow
          label={`${t("labels.width")} — ${borderWidthPx}px`}
          min={0}
          max={4}
          step={0.5}
          value={borderWidthPx}
          onChange={(v) => setTokens({ accordionBorderWidth: `${v}px` })}
          hint={[`0 ${t("hints.none")}`, `4px ${t("hints.heavy")}`]}
          onReset={() => resetColor(["accordionBorderWidth"])}
        />
        <BorderStyleRow tokenKey="accordionBorderStyle" />
      </Section>

      {/* ── Separator ── */}
      <Section title={t("sections.separator")}>
        <SliderRow
          label={`${t("labels.height")} — ${separatorPx}px`}
          min={0}
          max={4}
          step={0.5}
          value={separatorPx}
          onChange={(v) => setTokens({ accordionSeparatorHeight: `${v}px` })}
          hint={[`0 ${t("hints.hidden")}`, `4px ${t("hints.thick")}`]}
          onReset={() => resetColor(["accordionSeparatorHeight"])}
        />
      </Section>

      {/* ── Spacing ── */}
      <Section title={t("sections.spacing")}>
        <SliderRow
          label={`${t("labels.triggerX")} — ${triggerPxX}px`}
          min={4}
          max={32}
          step={1}
          value={triggerPxX}
          onChange={(v) => setTokens({ accordionTriggerPaddingX: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `32px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["accordionTriggerPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.triggerY")} — ${triggerPxY}px`}
          min={4}
          max={24}
          step={1}
          value={triggerPxY}
          onChange={(v) => setTokens({ accordionTriggerPaddingY: `${v}px` })}
          hint={[`4px ${t("hints.compact")}`, `24px ${t("hints.tall")}`]}
          onReset={() => resetColor(["accordionTriggerPaddingY"])}
        />
        <SliderRow
          label={`${t("labels.contentX")} — ${contentPxX}px`}
          min={4}
          max={32}
          step={1}
          value={contentPxX}
          onChange={(v) => setTokens({ accordionContentPaddingX: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `32px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["accordionContentPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.contentY")} — ${contentPxY}px`}
          min={0}
          max={24}
          step={1}
          value={contentPxY}
          onChange={(v) => setTokens({ accordionContentPaddingY: `${v}px` })}
          hint={[`0 ${t("hints.flush")}`, `24px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["accordionContentPaddingY"])}
        />
      </Section>

      {/* ── Typography ── */}
      <Section title={t("sections.typography")}>
        <FontWeightRow
          tokenKey="accordionTriggerFontWeight"
          label={t("labels.triggerWeight")}
        />
        <SliderRow
          label={`${t("labels.triggerSize")} — ${triggerFontPx}px`}
          min={11}
          max={20}
          step={0.5}
          value={triggerFontPx}
          onChange={(v) => setTokens({ accordionTriggerFontSize: `${v}px` })}
          hint={[`11px ${t("hints.small")}`, `20px ${t("hints.large")}`]}
          onReset={() => resetColor(["accordionTriggerFontSize"])}
        />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.shadow")}>
        <ShadowBuilder
          value={tokens.accordionShadow ?? "none"}
          onChange={(v) => setTokens({ accordionShadow: v })}
          onReset={() => resetColor(["accordionShadow"])}
          defaults={{ y: 4, blur: 8, opacity: 8 }}
        />
      </Section>
    </div>
  );
}
