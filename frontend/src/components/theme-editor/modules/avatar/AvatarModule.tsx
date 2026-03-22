"use client";

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

const RADIUS_PRESETS = [
  { label: "Square", value: "0px" },
  { label: "Soft", value: "8px" },
  { label: "Rounded", value: "16px" },
  { label: "Circle", value: "9999px" },
];

export function AvatarModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

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
        Controls the appearance of user avatars — profile pictures, fallback
        initials, status indicators, and grouped stacks.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title="Shape">
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
            label={`Radius — ${radiusPx}px`}
            min={0}
            max={32}
            step={1}
            value={Math.min(radiusPx, 32)}
            onChange={(v) => setTokens({ avatarRadius: `${v}px` })}
            hint={["0 square", "32px rounded"]}
          />
        )}
      </Section>

      {/* ── Sizes ── */}
      <Section title="Sizes">
        <SliderRow
          label={`Small — ${smPx}px`}
          min={20}
          max={48}
          step={2}
          value={smPx}
          onChange={(v) => setTokens({ avatarSizeSm: `${v}px` })}
          hint={["20px tiny", "48px large"]}
          onReset={() => resetColor(["avatarSizeSm"])}
        />
        <SliderRow
          label={`Medium — ${mdPx}px`}
          min={28}
          max={64}
          step={2}
          value={mdPx}
          onChange={(v) => setTokens({ avatarSizeMd: `${v}px` })}
          hint={["28px compact", "64px large"]}
          onReset={() => resetColor(["avatarSizeMd"])}
        />
        <SliderRow
          label={`Large — ${lgPx}px`}
          min={36}
          max={80}
          step={2}
          value={lgPx}
          onChange={(v) => setTokens({ avatarSizeLg: `${v}px` })}
          hint={["36px compact", "80px large"]}
          onReset={() => resetColor(["avatarSizeLg"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <BorderControls
          keys={{
            top: "avatarBorderTop",
            right: "avatarBorderRight",
            bottom: "avatarBorderBottom",
            left: "avatarBorderLeft",
          }}
          max={4}
          step={0.5}
          hintMax="4px heavy"
        />
        <BorderStyleRow tokenKey="avatarBorderStyle" />
      </Section>

      {/* ── Typography ── */}
      <Section title="Fallback text">
        <FontWeightRow tokenKey="avatarFallbackFontWeight" label="Weight" />
        <SliderRow
          label={`Size — ${fallbackFontPx}px`}
          min={9}
          max={24}
          step={1}
          value={fallbackFontPx}
          onChange={(v) => setTokens({ avatarFallbackFontSize: `${v}px` })}
          hint={["9px small", "24px large"]}
          onReset={() => resetColor(["avatarFallbackFontSize"])}
        />
      </Section>

      {/* ── Group ── */}
      <Section title="Group">
        <SliderRow
          label={`Overlap — ${groupPx}px`}
          min={0}
          max={20}
          step={1}
          value={groupPx}
          onChange={(v) => setTokens({ avatarGroupSpacing: `-${v}px` })}
          hint={["0 no overlap", "20px tight stack"]}
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

      {/* ── Cursor tracking ── */}
      <CursorTrackControls
        keys={{
          intensity: "avatarCursorTrack",
          restore: "avatarCursorTrackRestore",
        }}
      />
    </div>
  );
}
