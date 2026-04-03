"use client";

import { useTranslations } from "next-intl";

import { cssColorToHex } from "@/lib/color";
import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  FontWeightRow,
  Hover3DControls,
  Row,
  Section,
  SliderRow,
  Transform3DControls,
  usePreviewExternal,
} from "../_shared";
import { ColorInput } from "../colors/ColorInput";
import { Preview } from "./Preview";

const RADIUS_PRESETS_RAW = [
  { labelKey: "square", value: "0px" },
  { labelKey: "soft", value: "8px" },
  { labelKey: "rounded", value: "16px" },
  { labelKey: "circle", value: "9999px" },
];

export function AvatarModule() {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const RADIUS_PRESETS = RADIUS_PRESETS_RAW.map((p) => ({
    label: t(`presets.${p.labelKey}`),
    value: p.value,
  }));

  const radiusPx = parseFloat(tokens.avatarRadius ?? "9999");
  const isCircle = radiusPx >= 100;
  const smPx = parseFloat(tokens.avatarSizeSm ?? "32");
  const mdPx = parseFloat(tokens.avatarSizeMd ?? "40");
  const lgPx = parseFloat(tokens.avatarSizeLg ?? "48");
  const fallbackFontPx = parseFloat(tokens.avatarFallbackFontSize ?? "14");
  const groupPx = Math.abs(parseFloat(tokens.avatarGroupSpacing ?? "-8"));

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.avatar.allControls")}
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title={t("sections.shape")}>
        <Row label="Preset" onReset={() => resetColor(["avatarRadius"])}>
          {RADIUS_PRESETS.map((p) => {
            const active =
              p.value === "9999px" ? isCircle : tokens.avatarRadius === p.value;
            return (
              <Chip
                key={p.value}
                active={active}
                onClick={() => setTokens({ avatarRadius: p.value })}
              >
                {p.label}
              </Chip>
            );
          })}
        </Row>
        {!isCircle && (
          <SliderRow
            label={`${t("labels.radius")} — ${radiusPx}px`}
            min={0}
            max={32}
            step={1}
            value={Math.min(radiusPx, 32)}
            onChange={(v) => setTokens({ avatarRadius: `${v}px` })}
            hint={[`0 ${t("hints.square")}`, `32px ${t("hints.rounded")}`]}
          />
        )}
      </Section>

      {/* ── Sizes ── */}
      <Section title={t("sections.sizes")}>
        <SliderRow
          label={`${t("labels.small")} — ${smPx}px`}
          min={20}
          max={48}
          step={2}
          value={smPx}
          onChange={(v) => setTokens({ avatarSizeSm: `${v}px` })}
          hint={[`20px ${t("hints.tiny")}`, `48px ${t("hints.large")}`]}
          onReset={() => resetColor(["avatarSizeSm"])}
        />
        <SliderRow
          label={`${t("labels.medium")} — ${mdPx}px`}
          min={28}
          max={64}
          step={2}
          value={mdPx}
          onChange={(v) => setTokens({ avatarSizeMd: `${v}px` })}
          hint={[`28px ${t("hints.compact")}`, `64px ${t("hints.large")}`]}
          onReset={() => resetColor(["avatarSizeMd"])}
        />
        <SliderRow
          label={`${t("labels.large")} — ${lgPx}px`}
          min={36}
          max={80}
          step={2}
          value={lgPx}
          onChange={(v) => setTokens({ avatarSizeLg: `${v}px` })}
          hint={[`36px ${t("hints.compact")}`, `80px ${t("hints.large")}`]}
          onReset={() => resetColor(["avatarSizeLg"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title={t("sections.border")}>
        <BorderControls
          keys={{
            top: "avatarBorderTop",
            right: "avatarBorderRight",
            bottom: "avatarBorderBottom",
            left: "avatarBorderLeft",
          }}
          max={4}
          step={0.5}
          hintMax={`4px ${t("hints.heavy")}`}
        />
        <BorderStyleRow tokenKey="avatarBorderStyle" />
        <Row
          label={t("labels.borderColor")}
          onReset={() => resetColor(["avatarBorderColor"])}
        >
          <div className="flex items-center gap-2">
            <ColorInput
              value={cssColorToHex(tokens.avatarBorderColor)}
              onChange={(hex) => setTokens({ avatarBorderColor: hex })}
              title={t("labels.borderColor")}
            />
            <span
              className="text-xs font-vita-mono"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {tokens.avatarBorderColor}
            </span>
          </div>
        </Row>
      </Section>

      {/* ── Typography ── */}
      <Section title={t("sections.fallbackText")}>
        <FontWeightRow tokenKey="avatarFallbackFontWeight" label="Weight" />
        <SliderRow
          label={`${t("labels.size")} — ${fallbackFontPx}px`}
          min={9}
          max={24}
          step={1}
          value={fallbackFontPx}
          onChange={(v) => setTokens({ avatarFallbackFontSize: `${v}px` })}
          hint={[`9px ${t("hints.small")}`, `24px ${t("hints.large")}`]}
          onReset={() => resetColor(["avatarFallbackFontSize"])}
        />
      </Section>

      {/* ── Group ── */}
      <Section title={t("sections.group")}>
        <SliderRow
          label={`${t("labels.overlap")} — ${groupPx}px`}
          min={0}
          max={20}
          step={1}
          value={groupPx}
          onChange={(v) => setTokens({ avatarGroupSpacing: `-${v}px` })}
          hint={[`0 ${t("hints.noOverlap")}`, `20px ${t("hints.tightStack")}`]}
          onReset={() => resetColor(["avatarGroupSpacing"])}
        />
      </Section>

      {/* ── 3D Transform ── */}
      <Transform3DControls
        keys={{
          rotateX: "avatarRotateX",
          rotateY: "avatarRotateY",
          rotateZ: "avatarRotateZ",
        }}
      />

      {/* ── Hover animation ── */}
      <Hover3DControls
        keys={{
          hoverRotateX: "avatarHoverRotateX",
          hoverRotateY: "avatarHoverRotateY",
          hoverRotateZ: "avatarHoverRotateZ",
          hoverTranslateY: "avatarHoverTranslateY",
          hoverScale: "avatarHoverScale",
          transitionDuration: "avatarTransitionDuration",
        }}
      />
    </div>
  );
}
