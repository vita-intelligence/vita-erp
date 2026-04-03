"use client";

import { useTranslations } from "next-intl";

import { cssColorToHex } from "@/lib/color";
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
import { ColorInput } from "../colors/ColorInput";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const TRIGGER_RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "6px" },
  { label: "presets.rounded", value: "12px" },
  { label: "presets.pill", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function DatePickerModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const triggerRadius = parseFloat(tokens.datePickerTriggerRadius ?? "0");
  const triggerBorderWidth = parseFloat(
    tokens.datePickerTriggerBorderWidth ?? "1",
  );
  const triggerPaddingX = parseFloat(tokens.datePickerTriggerPaddingX ?? "12");
  const triggerPaddingY = parseFloat(tokens.datePickerTriggerPaddingY ?? "8");
  const popoverRadius = parseFloat(tokens.datePickerPopoverRadius ?? "0");
  const popoverPadding = parseFloat(tokens.datePickerPopoverPadding ?? "12");
  const indicatorSize = parseFloat(tokens.datePickerIndicatorSize ?? "18");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.datePicker.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Trigger ── */}
      <Section title={t("sections.trigger")}>
        <Row
          label={t("labels.radius")}
          onReset={() => resetColor(["datePickerTriggerRadius"])}
        >
          {TRIGGER_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.datePickerTriggerRadius === p.value}
              onClick={() => setTokens({ datePickerTriggerRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`${t("labels.radius")} — ${triggerRadius > 100 ? "pill" : `${triggerRadius}px`}`}
          min={0}
          max={20}
          step={1}
          value={Math.min(triggerRadius, 20)}
          onChange={(v) => setTokens({ datePickerTriggerRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `20px ${t("hints.rounded")}`]}
        />

        <SliderRow
          label={`${t("labels.border")} — ${triggerBorderWidth}px`}
          min={0}
          max={3}
          step={0.5}
          value={triggerBorderWidth}
          onChange={(v) =>
            setTokens({ datePickerTriggerBorderWidth: `${v}px` })
          }
          hint={[`0 ${t("hints.none")}`, `3px ${t("hints.heavy")}`]}
          onReset={() => resetColor(["datePickerTriggerBorderWidth"])}
        />

        {triggerBorderWidth > 0 && (
          <BorderStyleRow tokenKey="datePickerTriggerBorderStyle" />
        )}

        <Row
          label={t("labels.borderColor")}
          onReset={() => resetColor(["datePickerBorderColor"])}
        >
          <div className="flex items-center gap-2">
            <ColorInput
              value={cssColorToHex(tokens.datePickerBorderColor)}
              onChange={(hex) => setTokens({ datePickerBorderColor: hex })}
              title={t("labels.borderColor")}
            />
            <span
              className="text-xs font-vita-mono"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {tokens.datePickerBorderColor}
            </span>
          </div>
        </Row>

        <SliderRow
          label={`${t("labels.paddingX")} — ${triggerPaddingX}px`}
          min={4}
          max={20}
          step={1}
          value={triggerPaddingX}
          onChange={(v) => setTokens({ datePickerTriggerPaddingX: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `20px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["datePickerTriggerPaddingX"])}
        />

        <SliderRow
          label={`${t("labels.paddingY")} — ${triggerPaddingY}px`}
          min={4}
          max={14}
          step={1}
          value={triggerPaddingY}
          onChange={(v) => setTokens({ datePickerTriggerPaddingY: `${v}px` })}
          hint={[`4px ${t("hints.compact")}`, `14px ${t("hints.tall")}`]}
          onReset={() => resetColor(["datePickerTriggerPaddingY"])}
        />
      </Section>

      {/* ── Trigger shadow ── */}
      <Section title={t("sections.triggerShadow")}>
        <ShadowBuilder
          value={tokens.datePickerTriggerShadow ?? "none"}
          onChange={(v) => setTokens({ datePickerTriggerShadow: v })}
          onReset={() => resetColor(["datePickerTriggerShadow"])}
          defaults={{ y: 1, blur: 3, opacity: 6 }}
        />
      </Section>

      {/* ── Popover ── */}
      <Section title={t("sections.popover")}>
        <SliderRow
          label={`${t("labels.radius")} — ${popoverRadius}px`}
          min={0}
          max={20}
          step={1}
          value={popoverRadius}
          onChange={(v) => setTokens({ datePickerPopoverRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `20px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["datePickerPopoverRadius"])}
        />

        <SliderRow
          label={`${t("labels.padding")} — ${popoverPadding}px`}
          min={4}
          max={24}
          step={2}
          value={popoverPadding}
          onChange={(v) => setTokens({ datePickerPopoverPadding: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `24px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["datePickerPopoverPadding"])}
        />
      </Section>

      {/* ── Popover shadow ── */}
      <Section title={t("sections.popoverShadow")}>
        <ShadowBuilder
          value={tokens.datePickerPopoverShadow ?? "none"}
          onChange={(v) => setTokens({ datePickerPopoverShadow: v })}
          onReset={() => resetColor(["datePickerPopoverShadow"])}
          defaults={{ y: 4, blur: 12, opacity: 10 }}
        />
      </Section>

      {/* ── Indicator ── */}
      <Section title={t("sections.indicator")}>
        <SliderRow
          label={`${t("labels.size")} — ${indicatorSize}px`}
          min={12}
          max={28}
          step={1}
          value={indicatorSize}
          onChange={(v) => setTokens({ datePickerIndicatorSize: `${v}px` })}
          hint={[`12px ${t("hints.small")}`, `28px ${t("hints.large")}`]}
          onReset={() => resetColor(["datePickerIndicatorSize"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title={t("sections.motion")}>
        <TransitionRow tokenKey="datePickerTransitionDuration" />
      </Section>
    </div>
  );
}
