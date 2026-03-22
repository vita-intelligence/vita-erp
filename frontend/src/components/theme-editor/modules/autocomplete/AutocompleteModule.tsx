"use client";

import { useTranslations } from "next-intl";

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

const RADIUS_PRESETS_RAW = [
  { labelKey: "sharp", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
];

export function AutocompleteModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const RADIUS_PRESETS = RADIUS_PRESETS_RAW.map((p) => ({
    label: "labelKey" in p ? t(`presets.${p.labelKey}`) : p.label,
    value: p.value,
  }));

  const popoverRadiusPx = parseFloat(tokens.autocompletePopoverRadius ?? "0");
  const popoverPaddingPx = parseFloat(tokens.autocompletePopoverPadding ?? "4");
  const itemPxX = parseFloat(tokens.autocompleteItemPaddingX ?? "12");
  const itemPxY = parseFloat(tokens.autocompleteItemPaddingY ?? "8");
  const itemFontPx = parseFloat(tokens.autocompleteItemFontSize ?? "14");
  const itemRadiusPx = parseFloat(tokens.autocompleteItemRadius ?? "0");
  const dividerPx = parseFloat(tokens.autocompleteItemDivider ?? "0");
  const maxHeightPx = parseFloat(tokens.autocompleteMaxHeight ?? "256");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.autocomplete.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Popover shape ── */}
      <Section title={t("sections.dropdownShape")}>
        <SliderRow
          label={`${t("labels.radius")} — ${popoverRadiusPx}px`}
          min={0}
          max={20}
          step={1}
          value={popoverRadiusPx}
          onChange={(v) => setTokens({ autocompletePopoverRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["autocompletePopoverRadius"])}
        />
        <Row label="Quick presets">
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.autocompletePopoverRadius === p.value}
              onClick={() => setTokens({ autocompletePopoverRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Popover border ── */}
      <Section title={t("sections.dropdownBorder")}>
        <BorderControls
          keys={{
            top: "autocompletePopoverBorderTop",
            right: "autocompletePopoverBorderRight",
            bottom: "autocompletePopoverBorderBottom",
            left: "autocompletePopoverBorderLeft",
          }}
          max={3}
          step={0.5}
          hintMax="3px heavy"
        />
        <BorderStyleRow tokenKey="autocompletePopoverBorderStyle" />
      </Section>

      {/* ── Popover spacing ── */}
      <Section title={t("sections.dropdownSpacing")}>
        <SliderRow
          label={`${t("labels.padding")} — ${popoverPaddingPx}px`}
          min={0}
          max={12}
          step={1}
          value={popoverPaddingPx}
          onChange={(v) => setTokens({ autocompletePopoverPadding: `${v}px` })}
          hint={["0 flush", "12px spacious"]}
          onReset={() => resetColor(["autocompletePopoverPadding"])}
        />
        <SliderRow
          label={`${t("labels.maxHeight")} — ${maxHeightPx}px`}
          min={120}
          max={480}
          step={8}
          value={maxHeightPx}
          onChange={(v) => setTokens({ autocompleteMaxHeight: `${v}px` })}
          hint={["120px compact", "480px tall"]}
          onReset={() => resetColor(["autocompleteMaxHeight"])}
        />
      </Section>

      {/* ── Items ── */}
      <Section title={t("sections.listItems")}>
        <SliderRow
          label={`${t("labels.paddingX")} — ${itemPxX}px`}
          min={4}
          max={24}
          step={1}
          value={itemPxX}
          onChange={(v) => setTokens({ autocompleteItemPaddingX: `${v}px` })}
          hint={["4px tight", "24px spacious"]}
          onReset={() => resetColor(["autocompleteItemPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.paddingY")} — ${itemPxY}px`}
          min={2}
          max={16}
          step={1}
          value={itemPxY}
          onChange={(v) => setTokens({ autocompleteItemPaddingY: `${v}px` })}
          hint={["2px compact", "16px tall"]}
          onReset={() => resetColor(["autocompleteItemPaddingY"])}
        />
        <SliderRow
          label={`${t("labels.fontSize")} — ${itemFontPx}px`}
          min={11}
          max={18}
          step={0.5}
          value={itemFontPx}
          onChange={(v) => setTokens({ autocompleteItemFontSize: `${v}px` })}
          hint={["11px small", "18px large"]}
          onReset={() => resetColor(["autocompleteItemFontSize"])}
        />
        <SliderRow
          label={`${t("labels.itemRadius")} — ${itemRadiusPx}px`}
          min={0}
          max={12}
          step={1}
          value={itemRadiusPx}
          onChange={(v) => setTokens({ autocompleteItemRadius: `${v}px` })}
          hint={["0 sharp", "12px rounded"]}
          onReset={() => resetColor(["autocompleteItemRadius"])}
        />
        <SliderRow
          label={`${t("labels.divider")} — ${dividerPx}px`}
          min={0}
          max={2}
          step={0.5}
          value={dividerPx}
          onChange={(v) => setTokens({ autocompleteItemDivider: `${v}px` })}
          hint={["0 none", "2px visible"]}
          onReset={() => resetColor(["autocompleteItemDivider"])}
        />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.dropdownShadow")}>
        <ShadowBuilder
          value={tokens.autocompletePopoverShadow ?? "none"}
          onChange={(v) => setTokens({ autocompletePopoverShadow: v })}
          onReset={() => resetColor(["autocompletePopoverShadow"])}
          defaults={{ y: 4, blur: 12, opacity: 10 }}
        />
      </Section>
    </div>
  );
}
