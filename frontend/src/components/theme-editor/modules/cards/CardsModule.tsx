"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  CursorTrackControls,
  Hover3DControls,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  Transform3DControls,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Module ───────────────────────────────────────────────────────────────────

export function CardsModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const radiusPx = parseFloat(tokens.cardRadius);

  const RADIUS_PRESETS = [
    { label: t("presets.sharp"), value: "0px" },
    { label: "4px", value: "4px" },
    { label: "8px", value: "8px" },
    { label: "12px", value: "12px" },
    { label: "16px", value: "16px" },
  ];
  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.cards.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <SliderRow
          label={`${t("labels.radius")} — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={radiusPx}
          onChange={(v) => setTokens({ cardRadius: `${v}px` })}
          hint={["0 sharp", "24px rounded"]}
          onReset={() => resetColor(["cardRadius"])}
        />
        <Row label={t("labels.quickPresets")}>
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.cardRadius === p.value}
              onClick={() => setTokens({ cardRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <BorderControls
          keys={{
            top: "cardBorderTop",
            right: "cardBorderRight",
            bottom: "cardBorderBottom",
            left: "cardBorderLeft",
          }}
          max={5}
          step={0.5}
          hintMax="5px heavy"
        />
        <BorderStyleRow tokenKey="cardBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.shadow")}>
        <ShadowBuilder
          value={tokens.cardShadow}
          onChange={(v) => setTokens({ cardShadow: v })}
          onReset={() => resetColor(["cardShadow"])}
          defaults={{ y: 6, blur: 10, opacity: 8 }}
        />
      </Section>

      {/* ── 3D Transform ── */}
      <Transform3DControls
        keys={{
          rotateX: "cardRotateX",
          rotateY: "cardRotateY",
          rotateZ: "cardRotateZ",
        }}
      />

      {/* ── Hover animation ── */}
      <Hover3DControls
        keys={{
          hoverRotateX: "cardHoverRotateX",
          hoverRotateY: "cardHoverRotateY",
          hoverRotateZ: "cardHoverRotateZ",
          hoverTranslateY: "cardHoverTranslateY",
          hoverScale: "cardHoverScale",
          transitionDuration: "cardTransitionDuration",
        }}
      />

      {/* ── Cursor tracking ── */}
      <CursorTrackControls
        keys={{
          intensity: "cardCursorTrack",
          restore: "cardCursorTrackRestore",
        }}
      />
    </div>
  );
}
