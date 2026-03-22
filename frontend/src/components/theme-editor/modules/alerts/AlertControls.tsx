"use client";

/**
 * Controls for inline alert banners — shape, border, spacing, typography, icon, shadow.
 */

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
} from "../_shared";

const RADIUS_PRESETS_RAW = [
  { labelKey: "sharp", value: "0px" },
  { label: "4px", value: "4px" },
  { label: "8px", value: "8px" },
  { label: "12px", value: "12px" },
  { label: "16px", value: "16px" },
];

export function AlertControls() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();

  const RADIUS_PRESETS = RADIUS_PRESETS_RAW.map((p) => ({
    label: "labelKey" in p ? t(`presets.${p.labelKey}`) : p.label,
    value: p.value,
  }));

  const radiusPx = parseFloat(tokens.alertRadius ?? "0");
  const borderPx = parseFloat(tokens.alertBorderWidth ?? "1");
  const pxX = parseFloat(tokens.alertPaddingX ?? "16");
  const pxY = parseFloat(tokens.alertPaddingY ?? "12");
  const titlePx = parseFloat(tokens.alertTitleFontSize ?? "14");
  const descPx = parseFloat(tokens.alertDescriptionFontSize ?? "13");
  const iconPx = parseFloat(tokens.alertIconSize ?? "20");

  return (
    <>
      <Section title={t("sections.shape")}>
        <SliderRow
          label={`Radius — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={radiusPx}
          onChange={(v) => setTokens({ alertRadius: `${v}px` })}
          hint={["0 sharp", "24px rounded"]}
          onReset={() => resetColor(["alertRadius"])}
        />
        <Row label="Quick presets">
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.alertRadius === p.value}
              onClick={() => setTokens({ alertRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      <Section title={t("sections.border")}>
        <SliderRow
          label={`Width — ${borderPx}px`}
          min={0}
          max={4}
          step={0.5}
          value={borderPx}
          onChange={(v) => setTokens({ alertBorderWidth: `${v}px` })}
          hint={["0 none", "4px heavy"]}
          onReset={() => resetColor(["alertBorderWidth"])}
        />
        <BorderStyleRow tokenKey="alertBorderStyle" />
      </Section>

      <Section title={t("sections.spacing")}>
        <SliderRow
          label={`Padding X — ${pxX}px`}
          min={8}
          max={32}
          step={1}
          value={pxX}
          onChange={(v) => setTokens({ alertPaddingX: `${v}px` })}
          hint={["8px tight", "32px spacious"]}
          onReset={() => resetColor(["alertPaddingX"])}
        />
        <SliderRow
          label={`Padding Y — ${pxY}px`}
          min={6}
          max={24}
          step={1}
          value={pxY}
          onChange={(v) => setTokens({ alertPaddingY: `${v}px` })}
          hint={["6px compact", "24px tall"]}
          onReset={() => resetColor(["alertPaddingY"])}
        />
      </Section>

      <Section title={t("sections.typography")}>
        <FontWeightRow tokenKey="alertTitleFontWeight" label="Title weight" />
        <SliderRow
          label={`Title size — ${titlePx}px`}
          min={11}
          max={20}
          step={0.5}
          value={titlePx}
          onChange={(v) => setTokens({ alertTitleFontSize: `${v}px` })}
          hint={["11px small", "20px large"]}
          onReset={() => resetColor(["alertTitleFontSize"])}
        />
        <SliderRow
          label={`Description — ${descPx}px`}
          min={10}
          max={16}
          step={0.5}
          value={descPx}
          onChange={(v) => setTokens({ alertDescriptionFontSize: `${v}px` })}
          hint={["10px small", "16px large"]}
          onReset={() => resetColor(["alertDescriptionFontSize"])}
        />
      </Section>

      <Section title={t("sections.icon")}>
        <SliderRow
          label={`Size — ${iconPx}px`}
          min={12}
          max={32}
          step={1}
          value={iconPx}
          onChange={(v) => setTokens({ alertIconSize: `${v}px` })}
          hint={["12px small", "32px large"]}
          onReset={() => resetColor(["alertIconSize"])}
        />
      </Section>

      <Section title={t("sections.shadow")}>
        <ShadowBuilder
          value={tokens.alertShadow ?? "none"}
          onChange={(v) => setTokens({ alertShadow: v })}
          onReset={() => resetColor(["alertShadow"])}
          defaults={{ y: 2, blur: 6, opacity: 8 }}
        />
      </Section>
    </>
  );
}
