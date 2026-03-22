"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  BorderStyleRow,
  Chip,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  TransitionRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

const POPOVER_RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "6px" },
  { label: "presets.rounded", value: "12px" },
];

const TRIGGER_RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "6px" },
  { label: "presets.rounded", value: "12px" },
];

export function ComboBoxModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const popoverRadiusPx = parseFloat(tokens.comboBoxPopoverRadius ?? "0");
  const popoverPaddingPx = parseFloat(tokens.comboBoxPopoverPadding ?? "4");
  const popoverBorderWidthPx = parseFloat(
    tokens.comboBoxPopoverBorderWidth ?? "1",
  );
  const triggerRadiusPx = parseFloat(tokens.comboBoxTriggerRadius ?? "0");
  const triggerBorderWidthPx = parseFloat(
    tokens.comboBoxTriggerBorderWidth ?? "1",
  );
  const itemPxX = parseFloat(tokens.comboBoxItemPaddingX ?? "12");
  const itemPxY = parseFloat(tokens.comboBoxItemPaddingY ?? "8");
  const itemFontPx = parseFloat(tokens.comboBoxItemFontSize ?? "14");
  const itemRadiusPx = parseFloat(tokens.comboBoxItemRadius ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.comboBox.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Popover ── */}
      <Section title={t("sections.popover")}>
        <SliderRow
          label={`${t("labels.radius")} — ${popoverRadiusPx}px`}
          min={0}
          max={20}
          step={1}
          value={popoverRadiusPx}
          onChange={(v) => setTokens({ comboBoxPopoverRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["comboBoxPopoverRadius"])}
        />
        <Row label={t("labels.quickPresets")}>
          {POPOVER_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.comboBoxPopoverRadius === p.value}
              onClick={() => setTokens({ comboBoxPopoverRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>
        <SliderRow
          label={`${t("labels.padding")} — ${popoverPaddingPx}px`}
          min={2}
          max={20}
          step={1}
          value={popoverPaddingPx}
          onChange={(v) => setTokens({ comboBoxPopoverPadding: `${v}px` })}
          hint={["2px tight", "20px spacious"]}
          onReset={() => resetColor(["comboBoxPopoverPadding"])}
        />
        <SliderRow
          label={`${t("labels.width")} — ${popoverBorderWidthPx}px`}
          min={0}
          max={3}
          step={0.5}
          value={popoverBorderWidthPx}
          onChange={(v) => setTokens({ comboBoxPopoverBorderWidth: `${v}px` })}
          hint={["0 none", "3px heavy"]}
          onReset={() => resetColor(["comboBoxPopoverBorderWidth"])}
        />
        <BorderStyleRow tokenKey="comboBoxPopoverBorderStyle" />
      </Section>

      {/* ── Popover shadow ── */}
      <Section title={t("sections.popoverShadow")}>
        <ShadowBuilder
          value={tokens.comboBoxPopoverShadow ?? "none"}
          onChange={(v) => setTokens({ comboBoxPopoverShadow: v })}
          onReset={() => resetColor(["comboBoxPopoverShadow"])}
          defaults={{ y: 4, blur: 12, opacity: 10 }}
        />
      </Section>

      {/* ── Trigger ── */}
      <Section title={t("sections.trigger")}>
        <SliderRow
          label={`${t("labels.radius")} — ${triggerRadiusPx}px`}
          min={0}
          max={16}
          step={1}
          value={triggerRadiusPx}
          onChange={(v) => setTokens({ comboBoxTriggerRadius: `${v}px` })}
          hint={["0 sharp", "16px rounded"]}
          onReset={() => resetColor(["comboBoxTriggerRadius"])}
        />
        <Row label={t("labels.quickPresets")}>
          {TRIGGER_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.comboBoxTriggerRadius === p.value}
              onClick={() => setTokens({ comboBoxTriggerRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>
        <SliderRow
          label={`${t("labels.width")} — ${triggerBorderWidthPx}px`}
          min={0}
          max={3}
          step={0.5}
          value={triggerBorderWidthPx}
          onChange={(v) => setTokens({ comboBoxTriggerBorderWidth: `${v}px` })}
          hint={["0 none", "3px heavy"]}
          onReset={() => resetColor(["comboBoxTriggerBorderWidth"])}
        />
      </Section>

      {/* ── List items ── */}
      <Section title={t("sections.listItems")}>
        <SliderRow
          label={`${t("labels.paddingX")} — ${itemPxX}px`}
          min={4}
          max={20}
          step={1}
          value={itemPxX}
          onChange={(v) => setTokens({ comboBoxItemPaddingX: `${v}px` })}
          hint={["4px tight", "20px spacious"]}
          onReset={() => resetColor(["comboBoxItemPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.paddingY")} — ${itemPxY}px`}
          min={4}
          max={14}
          step={1}
          value={itemPxY}
          onChange={(v) => setTokens({ comboBoxItemPaddingY: `${v}px` })}
          hint={["4px compact", "14px tall"]}
          onReset={() => resetColor(["comboBoxItemPaddingY"])}
        />
        <SliderRow
          label={`${t("labels.fontSize")} — ${itemFontPx}px`}
          min={10}
          max={18}
          step={0.5}
          value={itemFontPx}
          onChange={(v) => setTokens({ comboBoxItemFontSize: `${v}px` })}
          hint={["10px small", "18px large"]}
          onReset={() => resetColor(["comboBoxItemFontSize"])}
        />
        <SliderRow
          label={`${t("labels.itemRadius")} — ${itemRadiusPx}px`}
          min={0}
          max={12}
          step={1}
          value={itemRadiusPx}
          onChange={(v) => setTokens({ comboBoxItemRadius: `${v}px` })}
          hint={["0 sharp", "12px rounded"]}
          onReset={() => resetColor(["comboBoxItemRadius"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title={t("sections.motion")}>
        <TransitionRow tokenKey="comboBoxTransitionDuration" />
      </Section>
    </div>
  );
}
