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

  const trackR = parseFloat(tokens.switchTrackRadius ?? "9999");
  const thumbR = parseFloat(tokens.switchThumbRadius ?? "9999");
  const gapPx = parseFloat(tokens.switchGap ?? "8");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.switch.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* Shape */}
      <Section title={t("sections.shape")}>
        <Row
          label={`${t("sections.track")} ${t("labels.radius").toLowerCase()}`}
          onReset={() => resetColor(["switchTrackRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={`track-${p.value}`}
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

        <Row
          label={`${t("sections.thumb")} ${t("labels.radius").toLowerCase()}`}
          onReset={() => resetColor(["switchThumbRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={`thumb-${p.value}`}
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

      {/* Label */}
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
