"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  BorderStyleRow,
  Chip,
  FontWeightRow,
  Row,
  Section,
  SliderRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

const RADIUS_PRESETS = [
  { label: "presets.none", value: "0px" },
  { label: "presets.4px", value: "4px" },
  { label: "presets.8px", value: "8px" },
  { label: "presets.pill", value: "9999px" },
];

export function BreadcrumbsModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const fontSizePx = parseFloat(tokens.breadcrumbsFontSize ?? "14");
  const gapPx = parseFloat(tokens.breadcrumbsGap ?? "8");
  const separatorPx = parseFloat(tokens.breadcrumbsSeparatorSize ?? "16");
  const separatorOpacity = parseFloat(
    tokens.breadcrumbsSeparatorOpacity ?? "0.5",
  );
  const itemPxX = parseFloat(tokens.breadcrumbsItemPaddingX ?? "0");
  const itemPxY = parseFloat(tokens.breadcrumbsItemPaddingY ?? "0");
  const itemRadiusPx = parseFloat(tokens.breadcrumbsItemRadius ?? "0");
  const itemBorderPx = parseFloat(tokens.breadcrumbsItemBorderWidth ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.breadcrumbs.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Typography ── */}
      <Section title={t("sections.typography")}>
        <SliderRow
          label={`${t("labels.fontSize")} — ${fontSizePx}px`}
          min={11}
          max={18}
          step={1}
          value={fontSizePx}
          onChange={(v) => setTokens({ breadcrumbsFontSize: `${v}px` })}
          hint={[`11px ${t("hints.compact")}`, `18px ${t("hints.large")}`]}
          onReset={() => resetColor(["breadcrumbsFontSize"])}
        />
        <FontWeightRow
          tokenKey="breadcrumbsFontWeight"
          label={t("labels.linkWeight")}
        />
        <FontWeightRow
          tokenKey="breadcrumbsActiveFontWeight"
          label={t("labels.activeWeight")}
        />
        <Row
          label={t("labels.letterSpacing")}
          onReset={() => resetColor(["breadcrumbsLetterSpacing"])}
        >
          {[
            { label: "presets.default", value: "0em" },
            { label: "presets.wide", value: "0.04em" },
            { label: "presets.wider", value: "0.08em" },
            { label: "presets.widest", value: "0.14em" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.breadcrumbsLetterSpacing === o.value}
              onClick={() => setTokens({ breadcrumbsLetterSpacing: o.value })}
            >
              {t(o.label)}
            </Chip>
          ))}
        </Row>
        <Row
          label={t("labels.textCase")}
          onReset={() => resetColor(["breadcrumbsTextTransform"])}
        >
          {[
            { label: "labels.textNormal", value: "none" },
            { label: "labels.uppercase", value: "uppercase" },
            { label: "labels.capitalize", value: "capitalize" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.breadcrumbsTextTransform === o.value}
              onClick={() => setTokens({ breadcrumbsTextTransform: o.value })}
            >
              {t(o.label)}
            </Chip>
          ))}
        </Row>
        <Row
          label={t("labels.underline")}
          onReset={() => resetColor(["breadcrumbsUnderline"])}
        >
          {[
            { label: "presets.none", value: "none" },
            { label: "presets.hover", value: "hover" },
            { label: "presets.always", value: "underline" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.breadcrumbsUnderline === o.value}
              onClick={() => setTokens({ breadcrumbsUnderline: o.value })}
            >
              {t(o.label)}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Item shape ── */}
      <Section title={t("sections.itemShape")}>
        <SliderRow
          label={`${t("labels.paddingX")} — ${itemPxX}px`}
          min={0}
          max={16}
          step={1}
          value={itemPxX}
          onChange={(v) => setTokens({ breadcrumbsItemPaddingX: `${v}px` })}
          hint={[`0 ${t("hints.plainText")}`, `16px ${t("hints.tagStyle")}`]}
          onReset={() => resetColor(["breadcrumbsItemPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.paddingY")} — ${itemPxY}px`}
          min={0}
          max={8}
          step={1}
          value={itemPxY}
          onChange={(v) => setTokens({ breadcrumbsItemPaddingY: `${v}px` })}
          hint={[`0 ${t("hints.inline")}`, `8px ${t("hints.padded")}`]}
          onReset={() => resetColor(["breadcrumbsItemPaddingY"])}
        />
        <SliderRow
          label={`${t("labels.radius")} — ${itemRadiusPx}px`}
          min={0}
          max={20}
          step={1}
          value={Math.min(itemRadiusPx, 20)}
          onChange={(v) => setTokens({ breadcrumbsItemRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `20px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["breadcrumbsItemRadius"])}
        />
        <Row label={t("labels.quickPresets")}>
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.breadcrumbsItemRadius === p.value}
              onClick={() => setTokens({ breadcrumbsItemRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Item border ── */}
      <Section title={t("sections.itemBorder")}>
        <SliderRow
          label={`${t("labels.width")} — ${itemBorderPx}px`}
          min={0}
          max={3}
          step={0.5}
          value={itemBorderPx}
          onChange={(v) => setTokens({ breadcrumbsItemBorderWidth: `${v}px` })}
          hint={[`0 ${t("hints.none")}`, `3px ${t("hints.heavy")}`]}
          onReset={() => resetColor(["breadcrumbsItemBorderWidth"])}
        />
        <BorderStyleRow tokenKey="breadcrumbsItemBorderStyle" />
      </Section>

      {/* ── Spacing ── */}
      <Section title={t("sections.spacing")}>
        <SliderRow
          label={`${t("labels.gap")} — ${gapPx}px`}
          min={2}
          max={20}
          step={1}
          value={gapPx}
          onChange={(v) => setTokens({ breadcrumbsGap: `${v}px` })}
          hint={[`2px ${t("hints.tight")}`, `20px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["breadcrumbsGap"])}
        />
      </Section>

      {/* ── Separator ── */}
      <Section title={t("sections.separator")}>
        <Row
          label={t("labels.icon")}
          onReset={() => resetColor(["breadcrumbsSeparatorIcon"])}
        >
          {[
            { label: "›", value: "chevron-right" },
            { label: "/", value: "slash" },
            { label: "•", value: "dot" },
            { label: "→", value: "arrow-right" },
            { label: "—", value: "minus" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={
                (tokens.breadcrumbsSeparatorIcon ?? "chevron-right") === o.value
              }
              onClick={() => setTokens({ breadcrumbsSeparatorIcon: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
        <SliderRow
          label={`${t("labels.iconSize")} — ${separatorPx}px`}
          min={10}
          max={24}
          step={1}
          value={separatorPx}
          onChange={(v) => setTokens({ breadcrumbsSeparatorSize: `${v}px` })}
          hint={[`10px ${t("hints.small")}`, `24px ${t("hints.large")}`]}
          onReset={() => resetColor(["breadcrumbsSeparatorSize"])}
        />
        <SliderRow
          label={`${t("labels.opacity")} — ${Math.round(separatorOpacity * 100)}%`}
          min={0.1}
          max={1}
          step={0.05}
          value={separatorOpacity}
          onChange={(v) => setTokens({ breadcrumbsSeparatorOpacity: `${v}` })}
          hint={[`10% ${t("hints.faint")}`, `100% ${t("hints.full")}`]}
          onReset={() => resetColor(["breadcrumbsSeparatorOpacity"])}
        />
      </Section>
    </div>
  );
}
