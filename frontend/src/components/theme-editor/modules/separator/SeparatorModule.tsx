"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import { Chip, Row, Section, SliderRow, usePreviewExternal } from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.rounded", value: "3px" },
  { label: "presets.pill", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function SeparatorModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const thicknessPx = parseFloat(tokens.separatorThickness ?? "1");
  const radiusPx = parseFloat(tokens.separatorRadius ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.separator.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Thickness ── */}
      <Section title={t("sections.thickness")}>
        <SliderRow
          label={`${t("sections.thickness")} — ${thicknessPx}px`}
          min={1}
          max={6}
          step={1}
          value={thicknessPx}
          onChange={(v) => setTokens({ separatorThickness: `${v}px` })}
          hint={[`1px ${t("hints.thin")}`, `6px ${t("hints.heavy")}`]}
          onReset={() => resetColor(["separatorThickness"])}
        />
      </Section>

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <Row
          label={t("labels.radiusPreset")}
          onReset={() => resetColor(["separatorRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? radiusPx >= 100
                  : tokens.separatorRadius === p.value
              }
              onClick={() => setTokens({ separatorRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        {radiusPx < 100 && (
          <SliderRow
            label={`${t("labels.radius")} — ${radiusPx}px`}
            min={0}
            max={6}
            step={1}
            value={radiusPx}
            onChange={(v) => setTokens({ separatorRadius: `${v}px` })}
            hint={[`0 ${t("hints.sharp")}`, `6px ${t("hints.round")}`]}
          />
        )}
      </Section>
    </div>
  );
}
