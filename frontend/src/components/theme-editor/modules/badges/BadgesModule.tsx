"use client";

import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  CursorTrackControls,
  FontWeightRow,
  Hover3DControls,
  Row,
  Section,
  SliderRow,
  Transform3DControls,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Module ───────────────────────────────────────────────────────────────────

export function BadgesModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const isPill = parseFloat(tokens.badgeRadius) >= 100;

  const RADIUS_PRESETS = [
    { label: t("presets.square"), value: "0px" },
    { label: t("presets.soft"), value: "4px" },
    { label: t("presets.rounded"), value: "8px" },
    { label: t("presets.large"), value: "16px" },
    { label: t("presets.pill"), value: "9999px" },
  ];
  const fontSizeRem = parseFloat(tokens.badgeFontSize ?? "0.6875");
  const paddingXRem = parseFloat(tokens.badgePaddingX ?? "0.55");
  const paddingYRem = parseFloat(tokens.badgePaddingY ?? "0.2");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.badges.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <Row
          label={t("labels.preset")}
          onReset={() => resetColor(["badgeRadius"])}
        >
          {RADIUS_PRESETS.map((p) => {
            const isActive =
              p.value === "9999px" ? isPill : tokens.badgeRadius === p.value;
            return (
              <Chip
                key={p.value}
                active={isActive}
                onClick={() => setTokens({ badgeRadius: p.value })}
              >
                {p.label}
              </Chip>
            );
          })}
        </Row>

        {!isPill && (
          <SliderRow
            label={`${t("labels.radius")} — ${parseFloat(tokens.badgeRadius)}px`}
            min={0}
            max={32}
            step={1}
            value={Math.min(parseFloat(tokens.badgeRadius), 32)}
            onChange={(v) => setTokens({ badgeRadius: `${v}px` })}
            hint={[`0 ${t("hints.square")}`, `32px ${t("hints.rounded")}`]}
          />
        )}
      </Section>

      {/* ── Spacing ── */}
      <Section title={t("sections.spacing")}>
        <SliderRow
          label={`${t("labels.paddingX")} — ${paddingXRem}rem`}
          min={0.2}
          max={1.2}
          step={0.05}
          value={paddingXRem}
          onChange={(v) => setTokens({ badgePaddingX: `${v}rem` })}
          hint={[`0.2 ${t("hints.tight")}`, `1.2 ${t("hints.spacious")}`]}
          onReset={() => resetColor(["badgePaddingX"])}
        />
        <SliderRow
          label={`${t("labels.paddingY")} — ${paddingYRem}rem`}
          min={0.05}
          max={0.6}
          step={0.05}
          value={paddingYRem}
          onChange={(v) => setTokens({ badgePaddingY: `${v}rem` })}
          hint={[`0.05 ${t("hints.compact")}`, `0.6 ${t("hints.tall")}`]}
          onReset={() => resetColor(["badgePaddingY"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <BorderControls
          keys={{
            top: "badgeBorderTop",
            right: "badgeBorderRight",
            bottom: "badgeBorderBottom",
            left: "badgeBorderLeft",
          }}
          max={3}
          step={0.5}
          hintMax={`3px ${t("hints.heavy")}`}
        />
        <BorderStyleRow tokenKey="badgeBorderStyle" />
      </Section>

      {/* ── Typography ── */}
      <Section title={t("sections.typography")}>
        <FontWeightRow tokenKey="badgeFontWeight" />

        <SliderRow
          label={`${t("labels.fontSize")} — ${fontSizeRem}rem`}
          min={0.5}
          max={1}
          step={0.0625}
          value={fontSizeRem}
          onChange={(v) => setTokens({ badgeFontSize: `${v}rem` })}
          hint={[`0.5 ${t("hints.tiny")}`, `1.0 ${t("hints.large")}`]}
          onReset={() => resetColor(["badgeFontSize"])}
        />

        <Row
          label={t("labels.letterSpacing")}
          onReset={() => resetColor(["badgeLetterSpacing"])}
        >
          {[
            { label: t("presets.default"), value: "0em" },
            { label: t("presets.snug"), value: "0.02em" },
            { label: t("presets.wide"), value: "0.06em" },
            { label: t("presets.widest"), value: "0.12em" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.badgeLetterSpacing === o.value}
              onClick={() => setTokens({ badgeLetterSpacing: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>

        <Row
          label={t("labels.textCase")}
          onReset={() => resetColor(["badgeTextTransform"])}
        >
          {[
            { label: t("labels.textNormal"), value: "none" },
            { label: t("labels.uppercase"), value: "uppercase" },
            { label: t("labels.capitalize"), value: "capitalize" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.badgeTextTransform === o.value}
              onClick={() => setTokens({ badgeTextTransform: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── 3D Transform ── */}
      <Transform3DControls
        keys={{
          rotateX: "badgeRotateX",
          rotateY: "badgeRotateY",
          rotateZ: "badgeRotateZ",
        }}
      />

      {/* ── Hover animation ── */}
      <Hover3DControls
        keys={{
          hoverRotateX: "badgeHoverRotateX",
          hoverRotateY: "badgeHoverRotateY",
          hoverRotateZ: "badgeHoverRotateZ",
          hoverTranslateY: "badgeHoverTranslateY",
          hoverScale: "badgeHoverScale",
          transitionDuration: "badgeTransitionDuration",
        }}
      />

      {/* ── Cursor tracking ── */}
      <CursorTrackControls
        keys={{
          intensity: "badgeCursorTrack",
          restore: "badgeCursorTrackRestore",
        }}
      />
    </div>
  );
}
