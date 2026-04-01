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

const RADIUS_PRESETS_RAW = [
  { labelKey: "sharp", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
  { label: "16px", value: "16px" },
  { labelKey: "pill", value: "9999px" },
];

const PLACEMENT_OPTIONS = [
  { label: "Top", value: "top" },
  { label: "Top Start", value: "top start" },
  { label: "Top End", value: "top end" },
  { label: "Bottom", value: "bottom" },
  { label: "Bottom Start", value: "bottom start" },
  { label: "Bottom End", value: "bottom end" },
];

export function ToastModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const RADIUS_PRESETS = RADIUS_PRESETS_RAW.map((p) => ({
    label: "labelKey" in p ? t(`presets.${p.labelKey}`) : p.label,
    value: p.value,
  }));

  const radiusPx = parseFloat(tokens.toastRadius ?? "12");
  const borderPx = parseFloat(tokens.toastBorderWidth ?? "1");
  const pxX = parseFloat(tokens.toastPaddingX ?? "16");
  const pxY = parseFloat(tokens.toastPaddingY ?? "12");
  const gapPx = parseFloat(tokens.toastGap ?? "8");
  const contentGapPx = parseFloat(tokens.toastContentGap ?? "4");
  const titlePx = parseFloat(tokens.toastTitleFontSize ?? "14");
  const descPx = parseFloat(tokens.toastDescriptionFontSize ?? "13");
  const descOpacity = parseFloat(tokens.toastDescriptionOpacity ?? "0.7");
  const iconPx = parseFloat(tokens.toastIconSize ?? "20");
  const actionRadiusPx = parseFloat(tokens.toastActionRadius ?? "6");
  const actionPx = parseFloat(tokens.toastActionFontSize ?? "13");
  const closePx = parseFloat(tokens.toastCloseSize ?? "28");
  const closeRadiusPx = parseFloat(tokens.toastCloseRadius ?? "6");
  const closeOpacity = parseFloat(tokens.toastCloseOpacity ?? "0.5");
  const minW = parseFloat(tokens.toastMinWidth ?? "320");
  const maxW = parseFloat(tokens.toastMaxWidth ?? "420");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.toast.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Placement ── */}
      <Section title={t("modules.toast.placement")}>
        <Row label={t("modules.toast.position")}>
          {PLACEMENT_OPTIONS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.toastPlacement === p.value}
              onClick={() => setTokens({ toastPlacement: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <SliderRow
          label={`${t("labels.radius")} — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={radiusPx}
          onChange={(v) => setTokens({ toastRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `24px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["toastRadius"])}
        />
        <Row label="Quick presets">
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.toastRadius === p.value}
              onClick={() => setTokens({ toastRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <SliderRow
          label={`${t("labels.width")} — ${borderPx}px`}
          min={0}
          max={4}
          step={1}
          value={borderPx}
          onChange={(v) => setTokens({ toastBorderWidth: `${v}px` })}
          hint={[`0 ${t("hints.none")}`, `4px ${t("hints.thick")}`]}
          onReset={() => resetColor(["toastBorderWidth"])}
        />
        <BorderStyleRow tokenKey="toastBorderStyle" />
      </Section>

      {/* ── Spacing ── */}
      <Section title={t("sections.spacing")}>
        <SliderRow
          label={`${t("labels.paddingX")} — ${pxX}px`}
          min={8}
          max={32}
          step={1}
          value={pxX}
          onChange={(v) => setTokens({ toastPaddingX: `${v}px` })}
          hint={[`8px ${t("hints.compact")}`, `32px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["toastPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.paddingY")} — ${pxY}px`}
          min={6}
          max={24}
          step={1}
          value={pxY}
          onChange={(v) => setTokens({ toastPaddingY: `${v}px` })}
          hint={[`6px ${t("hints.compact")}`, `24px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["toastPaddingY"])}
        />
        <SliderRow
          label={`${t("modules.toast.stackGap")} — ${gapPx}px`}
          min={0}
          max={16}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ toastGap: `${v}px` })}
          hint={["0 tight", "16px loose"]}
          onReset={() => resetColor(["toastGap"])}
        />
        <SliderRow
          label={`${t("modules.toast.contentGap")} — ${contentGapPx}px`}
          min={0}
          max={12}
          step={1}
          value={contentGapPx}
          onChange={(v) => setTokens({ toastContentGap: `${v}px` })}
          hint={["0 tight", "12px loose"]}
          onReset={() => resetColor(["toastContentGap"])}
        />
      </Section>

      {/* ── Size ── */}
      <Section title={t("sections.sizes")}>
        <SliderRow
          label={`${t("modules.toast.minWidth")} — ${minW}px`}
          min={200}
          max={500}
          step={10}
          value={minW}
          onChange={(v) => setTokens({ toastMinWidth: `${v}px` })}
          hint={["200px narrow", "500px wide"]}
          onReset={() => resetColor(["toastMinWidth"])}
        />
        <SliderRow
          label={`${t("modules.toast.maxWidth")} — ${maxW}px`}
          min={300}
          max={600}
          step={10}
          value={maxW}
          onChange={(v) => setTokens({ toastMaxWidth: `${v}px` })}
          hint={["300px narrow", "600px wide"]}
          onReset={() => resetColor(["toastMaxWidth"])}
        />
      </Section>

      {/* ── Typography ── */}
      <Section title={t("sections.typography")}>
        <FontWeightRow tokenKey="toastTitleFontWeight" />
        <SliderRow
          label={`${t("modules.toast.titleSize")} — ${titlePx}px`}
          min={11}
          max={18}
          step={1}
          value={titlePx}
          onChange={(v) => setTokens({ toastTitleFontSize: `${v}px` })}
          hint={["11px small", "18px large"]}
          onReset={() => resetColor(["toastTitleFontSize"])}
        />
        <SliderRow
          label={`${t("modules.toast.descriptionSize")} — ${descPx}px`}
          min={10}
          max={16}
          step={1}
          value={descPx}
          onChange={(v) => setTokens({ toastDescriptionFontSize: `${v}px` })}
          hint={["10px small", "16px large"]}
          onReset={() => resetColor(["toastDescriptionFontSize"])}
        />
        <SliderRow
          label={`${t("modules.toast.descriptionOpacity")} — ${(descOpacity * 100).toFixed(0)}%`}
          min={0.3}
          max={1}
          step={0.05}
          value={descOpacity}
          onChange={(v) => setTokens({ toastDescriptionOpacity: `${v}` })}
          hint={["30% subtle", "100% full"]}
          onReset={() => resetColor(["toastDescriptionOpacity"])}
        />
      </Section>

      {/* ── Icon ── */}
      <Section title={t("modules.toast.icon")}>
        <SliderRow
          label={`${t("labels.size")} — ${iconPx}px`}
          min={14}
          max={28}
          step={1}
          value={iconPx}
          onChange={(v) => setTokens({ toastIconSize: `${v}px` })}
          hint={["14px small", "28px large"]}
          onReset={() => resetColor(["toastIconSize"])}
        />
      </Section>

      {/* ── Action Button ── */}
      <Section title={t("modules.toast.actionButton")}>
        <SliderRow
          label={`${t("labels.radius")} — ${actionRadiusPx}px`}
          min={0}
          max={12}
          step={1}
          value={actionRadiusPx}
          onChange={(v) => setTokens({ toastActionRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `12px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["toastActionRadius"])}
        />
        <SliderRow
          label={`${t("modules.toast.actionFontSize")} — ${actionPx}px`}
          min={10}
          max={16}
          step={1}
          value={actionPx}
          onChange={(v) => setTokens({ toastActionFontSize: `${v}px` })}
          hint={["10px small", "16px large"]}
          onReset={() => resetColor(["toastActionFontSize"])}
        />
        <FontWeightRow tokenKey="toastActionFontWeight" />
      </Section>

      {/* ── Close Button ── */}
      <Section title={t("modules.toast.closeButton")}>
        <SliderRow
          label={`${t("labels.size")} — ${closePx}px`}
          min={20}
          max={40}
          step={1}
          value={closePx}
          onChange={(v) => setTokens({ toastCloseSize: `${v}px` })}
          hint={["20px small", "40px large"]}
          onReset={() => resetColor(["toastCloseSize"])}
        />
        <SliderRow
          label={`${t("labels.radius")} — ${closeRadiusPx}px`}
          min={0}
          max={12}
          step={1}
          value={closeRadiusPx}
          onChange={(v) => setTokens({ toastCloseRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `12px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["toastCloseRadius"])}
        />
        <SliderRow
          label={`${t("modules.toast.closeOpacity")} — ${(closeOpacity * 100).toFixed(0)}%`}
          min={0.2}
          max={1}
          step={0.05}
          value={closeOpacity}
          onChange={(v) => setTokens({ toastCloseOpacity: `${v}` })}
          hint={["20% subtle", "100% full"]}
          onReset={() => resetColor(["toastCloseOpacity"])}
        />
      </Section>

      {/* ── Shadow ── */}
      <ShadowBuilder
        value={tokens.toastShadow ?? "none"}
        onChange={(v) => setTokens({ toastShadow: v })}
        onReset={() => resetColor(["toastShadow"])}
      />
    </div>
  );
}
