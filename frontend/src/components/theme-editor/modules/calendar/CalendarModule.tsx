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

const RADIUS_PRESETS = [
  { label: "presets.square", value: "0px" },
  { label: "presets.soft", value: "6px" },
  { label: "presets.rounded", value: "12px" },
  { label: "presets.large", value: "20px" },
];

export function CalendarModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const radiusPx = parseFloat(tokens.calendarRadius ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.calendar.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <SliderRow
          label={`Radius — ${radiusPx}px`}
          min={0}
          max={24}
          step={1}
          value={Math.min(radiusPx, 24)}
          onChange={(v) => setTokens({ calendarRadius: `${v}px` })}
          hint={["0 square", "24px rounded"]}
          onReset={() => resetColor(["calendarRadius"])}
        />
        <Row label={t("labels.quickPresets")}>
          {RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.calendarRadius === p.value}
              onClick={() => setTokens({ calendarRadius: p.value })}
            >
              {t(p.label)}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <BorderControls
          keys={{
            top: "calendarBorderTop",
            right: "calendarBorderRight",
            bottom: "calendarBorderBottom",
            left: "calendarBorderLeft",
          }}
          max={3}
          step={0.5}
          hintMax="3px heavy"
        />
        <BorderStyleRow tokenKey="calendarBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title={t("sections.shadow")}>
        <ShadowBuilder
          value={tokens.calendarShadow ?? "none"}
          onChange={(v) => setTokens({ calendarShadow: v })}
          onReset={() => resetColor(["calendarShadow"])}
          defaults={{ y: 2, blur: 6, opacity: 8 }}
        />
      </Section>

      {/* ── 3D Transform ── */}
      <Transform3DControls
        keys={{
          rotateX: "calendarRotateX",
          rotateY: "calendarRotateY",
          rotateZ: "calendarRotateZ",
        }}
      />

      {/* ── Hover animation ── */}
      <Hover3DControls
        keys={{
          hoverRotateX: "calendarHoverRotateX",
          hoverRotateY: "calendarHoverRotateY",
          hoverRotateZ: "calendarHoverRotateZ",
          hoverTranslateY: "calendarHoverTranslateY",
          hoverScale: "calendarHoverScale",
          transitionDuration: "calendarTransitionDuration",
        }}
      />

      {/* ── Cursor tracking ── */}
      <CursorTrackControls
        keys={{
          intensity: "calendarCursorTrack",
          restore: "calendarCursorTrackRestore",
        }}
      />
    </div>
  );
}
