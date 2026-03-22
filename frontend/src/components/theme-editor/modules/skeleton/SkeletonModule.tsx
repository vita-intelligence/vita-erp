"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import { Chip, Row, Section, SliderRow, usePreviewExternal } from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "presets.sharp", value: "0px" },
  { label: "presets.soft", value: "4px" },
  { label: "presets.rounded", value: "8px" },
  { label: "presets.pill", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function SkeletonModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const radiusPx = parseFloat(tokens.skeletonRadius ?? "8");
  const animDuration = parseFloat(tokens.skeletonAnimationDuration ?? "1.5");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.skeleton.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <Row
          label={t("labels.radiusPreset")}
          onReset={() => resetColor(["skeletonRadius"])}
        >
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? radiusPx >= 100
                  : tokens.skeletonRadius === p.value
              }
              onClick={() => setTokens({ skeletonRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>

        {radiusPx < 100 && (
          <SliderRow
            label={`Radius — ${radiusPx}px`}
            min={0}
            max={20}
            step={1}
            value={radiusPx}
            onChange={(v) => setTokens({ skeletonRadius: `${v}px` })}
            hint={["0 sharp", "20px round"]}
          />
        )}
      </Section>

      {/* ── Animation ── */}
      <Section title={t("sections.animation")}>
        <SliderRow
          label={`Duration — ${animDuration.toFixed(1)}s`}
          min={0.5}
          max={4}
          step={0.1}
          value={animDuration}
          onChange={(v) =>
            setTokens({ skeletonAnimationDuration: `${v.toFixed(1)}s` })
          }
          hint={["0.5s fast", "4.0s slow"]}
          onReset={() => resetColor(["skeletonAnimationDuration"])}
        />
      </Section>
    </div>
  );
}
