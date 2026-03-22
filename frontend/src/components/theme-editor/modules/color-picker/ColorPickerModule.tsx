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

// ── Presets ──────────────────────────────────────────────────────────────────

const POPOVER_RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "8px" },
  { label: "presets.rounded", value: "14px" },
  { label: "presets.large", value: "20px" },
];

const SWATCH_RADIUS_PRESETS = [
  { label: "presets.square", value: "0px" },
  { label: "presets.soft", value: "4px" },
  { label: "presets.rounded", value: "8px" },
  { label: "presets.circle", value: "9999px" },
];

const SWATCH_SIZE_PRESETS = [
  { label: "presets.small", value: "20px" },
  { label: "presets.medium", value: "28px" },
  { label: "presets.large", value: "36px" },
  { label: "presets.xl", value: "44px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function ColorPickerModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const popoverRadius = parseFloat(tokens.colorPickerPopoverRadius ?? "8");
  const popoverPadding = parseFloat(tokens.colorPickerPopoverPadding ?? "16");
  const popoverBorder = parseFloat(tokens.colorPickerPopoverBorderWidth ?? "1");
  const swatchRadius = parseFloat(tokens.colorPickerSwatchRadius ?? "6");
  const swatchSize = parseFloat(tokens.colorPickerSwatchSize ?? "28");
  const swatchGap = parseFloat(tokens.colorPickerSwatchGap ?? "6");
  const swatchBorder = parseFloat(tokens.colorPickerSwatchBorderWidth ?? "2");
  const sliderRadius = parseFloat(tokens.colorPickerSliderRadius ?? "9999");
  const sliderHeight = parseFloat(tokens.colorPickerSliderHeight ?? "12");
  const thumbSize = parseFloat(tokens.colorPickerThumbSize ?? "18");
  const thumbBorder = parseFloat(tokens.colorPickerThumbBorderWidth ?? "2");
  const areaRadius = parseFloat(tokens.colorPickerAreaRadius ?? "8");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.colorPicker.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Popover ── */}
      <Section title={t("sections.popover")}>
        <Row
          label={t("labels.radius")}
          onReset={() => resetColor(["colorPickerPopoverRadius"])}
        >
          {POPOVER_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.colorPickerPopoverRadius === p.value}
              onClick={() => setTokens({ colorPickerPopoverRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`${t("labels.radius")} — ${popoverRadius}px`}
          min={0}
          max={24}
          step={1}
          value={popoverRadius}
          onChange={(v) => setTokens({ colorPickerPopoverRadius: `${v}px` })}
          hint={["0 sharp", "24px rounded"]}
        />

        <SliderRow
          label={`${t("labels.padding")} — ${popoverPadding}px`}
          min={4}
          max={32}
          step={2}
          value={popoverPadding}
          onChange={(v) => setTokens({ colorPickerPopoverPadding: `${v}px` })}
          hint={["4px tight", "32px spacious"]}
          onReset={() => resetColor(["colorPickerPopoverPadding"])}
        />

        <SliderRow
          label={`${t("labels.border")} — ${popoverBorder}px`}
          min={0}
          max={3}
          step={0.5}
          value={popoverBorder}
          onChange={(v) =>
            setTokens({ colorPickerPopoverBorderWidth: `${v}px` })
          }
          hint={["0 none", "3px heavy"]}
          onReset={() => resetColor(["colorPickerPopoverBorderWidth"])}
        />

        {popoverBorder > 0 && (
          <BorderStyleRow tokenKey="colorPickerPopoverBorderStyle" />
        )}
      </Section>

      {/* ── Popover shadow ── */}
      <Section title={t("sections.popoverShadow")}>
        <ShadowBuilder
          value={tokens.colorPickerPopoverShadow}
          onChange={(v) => setTokens({ colorPickerPopoverShadow: v })}
          onReset={() => resetColor(["colorPickerPopoverShadow"])}
          defaults={{ y: 4, blur: 14, opacity: 10 }}
        />
      </Section>

      {/* ── Color area ── */}
      <Section title={t("sections.colorArea")}>
        <SliderRow
          label={`${t("labels.radius")} — ${areaRadius}px`}
          min={0}
          max={20}
          step={1}
          value={areaRadius}
          onChange={(v) => setTokens({ colorPickerAreaRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["colorPickerAreaRadius"])}
        />
      </Section>

      {/* ── Sliders ── */}
      <Section title={t("sections.sliders")}>
        <SliderRow
          label={`${t("labels.trackHeight")} — ${sliderHeight}px`}
          min={6}
          max={24}
          step={1}
          value={sliderHeight}
          onChange={(v) => setTokens({ colorPickerSliderHeight: `${v}px` })}
          hint={["6px thin", "24px thick"]}
          onReset={() => resetColor(["colorPickerSliderHeight"])}
        />

        <SliderRow
          label={`${t("labels.radius")} — ${sliderRadius > 100 ? "pill" : `${sliderRadius}px`}`}
          min={0}
          max={12}
          step={1}
          value={Math.min(sliderRadius, 12)}
          onChange={(v) => setTokens({ colorPickerSliderRadius: `${v}px` })}
          hint={["0 sharp", "12px rounded"]}
          onReset={() => resetColor(["colorPickerSliderRadius"])}
        />

        <Row label={t("labels.trackShape")}>
          {[
            { label: "presets.sharp", value: "0px" },
            { label: "presets.rounded", value: "6px" },
            { label: "presets.pill", value: "9999px" },
          ].map((p) => (
            <Chip
              key={p.value}
              active={tokens.colorPickerSliderRadius === p.value}
              onClick={() => setTokens({ colorPickerSliderRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Thumbs ── */}
      <Section title={t("sections.thumbs")}>
        <SliderRow
          label={`${t("labels.size")} — ${thumbSize}px`}
          min={12}
          max={28}
          step={1}
          value={thumbSize}
          onChange={(v) => setTokens({ colorPickerThumbSize: `${v}px` })}
          hint={["12px small", "28px large"]}
          onReset={() => resetColor(["colorPickerThumbSize"])}
        />

        <SliderRow
          label={`${t("labels.border")} — ${thumbBorder}px`}
          min={1}
          max={4}
          step={0.5}
          value={thumbBorder}
          onChange={(v) => setTokens({ colorPickerThumbBorderWidth: `${v}px` })}
          hint={["1px thin", "4px heavy"]}
          onReset={() => resetColor(["colorPickerThumbBorderWidth"])}
        />
      </Section>

      {/* ── Swatches ── */}
      <Section title={t("sections.swatches")}>
        <Row
          label={t("labels.size")}
          onReset={() => resetColor(["colorPickerSwatchSize"])}
        >
          {SWATCH_SIZE_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.colorPickerSwatchSize === p.value}
              onClick={() => setTokens({ colorPickerSwatchSize: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`${t("labels.size")} — ${swatchSize}px`}
          min={16}
          max={48}
          step={2}
          value={swatchSize}
          onChange={(v) => setTokens({ colorPickerSwatchSize: `${v}px` })}
          hint={["16px tiny", "48px large"]}
        />

        <Row
          label={t("labels.shape")}
          onReset={() => resetColor(["colorPickerSwatchRadius"])}
        >
          {SWATCH_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? swatchRadius >= 100
                  : tokens.colorPickerSwatchRadius === p.value
              }
              onClick={() => setTokens({ colorPickerSwatchRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`${t("labels.gap")} — ${swatchGap}px`}
          min={2}
          max={14}
          step={1}
          value={swatchGap}
          onChange={(v) => setTokens({ colorPickerSwatchGap: `${v}px` })}
          hint={["2px tight", "14px spaced"]}
          onReset={() => resetColor(["colorPickerSwatchGap"])}
        />

        <SliderRow
          label={`${t("labels.border")} — ${swatchBorder}px`}
          min={0}
          max={4}
          step={0.5}
          value={swatchBorder}
          onChange={(v) =>
            setTokens({ colorPickerSwatchBorderWidth: `${v}px` })
          }
          hint={["0 none", "4px heavy"]}
          onReset={() => resetColor(["colorPickerSwatchBorderWidth"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title={t("sections.motion")}>
        <TransitionRow tokenKey="colorPickerTransitionDuration" />
      </Section>
    </div>
  );
}
