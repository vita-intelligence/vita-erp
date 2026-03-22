"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  Chip,
  Row,
  Section,
  SliderRow,
  TransitionRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

const RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.rounded", value: "8px" },
  { label: "presets.pill", value: "9999px" },
];

export function SwitchModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const trackW = parseFloat(tokens.switchTrackWidth ?? "40");
  const trackH = parseFloat(tokens.switchTrackHeight ?? "22");
  const trackR = parseFloat(tokens.switchTrackRadius ?? "9999");
  const thumbS = parseFloat(tokens.switchThumbSize ?? "18");
  const thumbR = parseFloat(tokens.switchThumbRadius ?? "9999");
  const gapPx = parseFloat(tokens.switchGap ?? "8");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.switch.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* Track */}
      <Section title={t("sections.track")}>
        <SliderRow
          label={`${t("labels.width")} — ${trackW}px`}
          min={28}
          max={60}
          step={2}
          value={trackW}
          onChange={(v) => setTokens({ switchTrackWidth: `${v}px` })}
          hint={[`28px ${t("hints.compact")}`, `60px ${t("hints.large")}`]}
          onReset={() => resetColor(["switchTrackWidth"])}
        />
        <SliderRow
          label={`${t("labels.height")} — ${trackH}px`}
          min={16}
          max={32}
          step={2}
          value={trackH}
          onChange={(v) => setTokens({ switchTrackHeight: `${v}px` })}
          hint={[`16px ${t("hints.compact")}`, `32px ${t("hints.large")}`]}
          onReset={() => resetColor(["switchTrackHeight"])}
        />
        <Row
          label={t("labels.radiusPreset")}
          onReset={() => resetColor(["switchTrackRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? trackR >= 100
                  : tokens.switchTrackRadius === p.value
              }
              onClick={() => setTokens({ switchTrackRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* Thumb */}
      <Section title={t("sections.thumb")}>
        <SliderRow
          label={`${t("labels.size")} — ${thumbS}px`}
          min={12}
          max={28}
          step={2}
          value={thumbS}
          onChange={(v) => setTokens({ switchThumbSize: `${v}px` })}
          hint={[`12px ${t("hints.small")}`, `28px ${t("hints.large")}`]}
          onReset={() => resetColor(["switchThumbSize"])}
        />
        <Row
          label={t("labels.radiusPreset")}
          onReset={() => resetColor(["switchThumbRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? thumbR >= 100
                  : tokens.switchThumbRadius === p.value
              }
              onClick={() => setTokens({ switchThumbRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* Label gap */}
      <Section title={t("sections.label")}>
        <SliderRow
          label={`${t("labels.gap")} — ${gapPx}px`}
          min={4}
          max={16}
          step={2}
          value={gapPx}
          onChange={(v) => setTokens({ switchGap: `${v}px` })}
          hint={[`4px ${t("hints.tight")}`, `16px ${t("hints.spacious")}`]}
          onReset={() => resetColor(["switchGap"])}
        />
      </Section>

      {/* Motion */}
      <Section title={t("sections.motion")}>
        <TransitionRow tokenKey="switchTransitionDuration" />
      </Section>
    </div>
  );
}
