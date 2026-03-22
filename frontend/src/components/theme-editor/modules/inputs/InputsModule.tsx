"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
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
import { Preview } from "./Preview";

// ── Module ────────────────────────────────────────────────────────────────────

export function InputsModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const radiusPx = parseFloat(tokens.inputRadius ?? "0");
  const paddingXPx = parseFloat(tokens.inputPaddingX ?? "12");
  const paddingYPx = parseFloat(tokens.inputPaddingY ?? "8");
  const fontSizePx = parseFloat(tokens.inputFontSize ?? "14");
  const labelSizePx = parseFloat(tokens.inputLabelSize ?? "12");
  const placeholderPct = Math.round(
    parseFloat(tokens.inputPlaceholderOpacity ?? "0.45") * 100,
  );
  const focusRingPx = parseFloat(tokens.inputFocusRingWidth ?? "2");
  const focusOffsetPx = parseFloat(tokens.inputFocusRingOffset ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
        {t("modules.inputs.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <SliderRow
          label={`${t("labels.radius")} — ${radiusPx}px`}
          min={0}
          max={20}
          step={0.5}
          value={radiusPx}
          onChange={(v) => setTokens({ inputRadius: `${v}px` })}
          hint={[`0 ${t("hints.sharp")}`, `20px ${t("hints.rounded")}`]}
          onReset={() => resetColor(["inputRadius"])}
        />
        <SliderRow
          label={`${t("labels.paddingX")} — ${paddingXPx}px`}
          min={4}
          max={32}
          step={1}
          value={paddingXPx}
          onChange={(v) => setTokens({ inputPaddingX: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `32px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["inputPaddingX"])}
        />
        <SliderRow
          label={`${t("labels.paddingY")} — ${paddingYPx}px`}
          min={2}
          max={20}
          step={1}
          value={paddingYPx}
          onChange={(v) => setTokens({ inputPaddingY: `${v}px` })}
          hint={[`2px ${t("hints.compact")}`, `20px ${t("hints.tall")}`]}
          onReset={() => resetColor(["inputPaddingY"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <BorderControls
          keys={{
            top: "inputBorderTop",
            right: "inputBorderRight",
            bottom: "inputBorderBottom",
            left: "inputBorderLeft",
          }}
        />
        <BorderStyleRow tokenKey="inputBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.shadow")}>
        <ShadowBuilder
          value={tokens.inputShadow ?? "none"}
          onChange={(v) => setTokens({ inputShadow: v })}
          onReset={() => resetColor(["inputShadow"])}
          defaults={{ y: 2, blur: 4, opacity: 8 }}
        />
      </Section>

      {/* ── Focus ring ── */}
      <Section title={t("labels.focusRing")}>
        <SliderRow
          label={`${t("labels.ringWidth")} — ${focusRingPx}px`}
          min={0}
          max={6}
          step={0.5}
          value={focusRingPx}
          onChange={(v) => setTokens({ inputFocusRingWidth: `${v}px` })}
          hint={[`0 ${t("hints.none")}`, `6px ${t("hints.bold")}`]}
          onReset={() => resetColor(["inputFocusRingWidth"])}
        />
        <SliderRow
          label={`${t("labels.ringOffset")} — ${focusOffsetPx}px`}
          min={0}
          max={6}
          step={0.5}
          value={focusOffsetPx}
          onChange={(v) => setTokens({ inputFocusRingOffset: `${v}px` })}
          hint={[`0 ${t("hints.flush")}`, `6px ${t("hints.gap")}`]}
          onReset={() => resetColor(["inputFocusRingOffset"])}
        />
      </Section>

      {/* ── Typography ── */}
      <Section title={t("sections.typography")}>
        <SliderRow
          label={`${t("labels.inputText")} — ${fontSizePx}px`}
          min={10}
          max={20}
          step={0.5}
          value={fontSizePx}
          onChange={(v) => setTokens({ inputFontSize: `${v}px` })}
          hint={[`10px ${t("hints.small")}`, `20px ${t("hints.large")}`]}
          onReset={() => resetColor(["inputFontSize"])}
        />
        <SliderRow
          label={`${t("labels.labelSize")} — ${labelSizePx}px`}
          min={9}
          max={16}
          step={0.5}
          value={labelSizePx}
          onChange={(v) => setTokens({ inputLabelSize: `${v}px` })}
          hint={[`9px ${t("hints.tiny")}`, `16px ${t("hints.prominent")}`]}
          onReset={() => resetColor(["inputLabelSize"])}
        />
        <FontWeightRow
          tokenKey="inputLabelWeight"
          label={t("labels.labelWeight")}
        />
        <Row
          label={t("labels.textAlign")}
          onReset={() => resetColor(["inputTextAlign"])}
        >
          {[
            { label: t("labels.left"), value: "left" },
            { label: t("labels.center"), value: "center" },
            { label: t("labels.right"), value: "right" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.inputTextAlign === o.value}
              onClick={() => setTokens({ inputTextAlign: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
        <SliderRow
          label={`${t("labels.placeholder")} — ${placeholderPct}%`}
          min={10}
          max={90}
          step={5}
          value={placeholderPct}
          onChange={(v) =>
            setTokens({ inputPlaceholderOpacity: (v / 100).toFixed(2) })
          }
          hint={[`10% ${t("hints.faded")}`, `90% ${t("hints.visible")}`]}
          onReset={() => resetColor(["inputPlaceholderOpacity"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title={t("sections.motion")}>
        <TransitionRow tokenKey="inputTransitionDuration" />
      </Section>
    </div>
  );
}
