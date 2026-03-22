"use client";

import { useThemeStore } from "@/stores/theme";

import {
  Chip,
  Hover3DControls,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  Transform3DControls,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const TRACK_RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "Rounded", value: "8px" },
  { label: "Pill", value: "9999px" },
];

const THUMB_RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "Rounded", value: "8px" },
  { label: "Pill", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function SliderModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const trackHeightPx = parseFloat(tokens.sliderTrackHeight ?? "6");
  const trackRadiusPx = parseFloat(tokens.sliderTrackRadius ?? "9999");
  const thumbSizePx = parseFloat(tokens.sliderThumbSize ?? "20");
  const thumbDotSizePx = parseFloat(tokens.sliderThumbDotSize ?? "16");
  const thumbRadiusPx = parseFloat(tokens.sliderThumbRadius ?? "9999");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the track, thumb, and animation of range sliders.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Track ── */}
      <Section title="Track">
        <SliderRow
          label={`Height — ${trackHeightPx}px`}
          min={2}
          max={16}
          step={1}
          value={trackHeightPx}
          onChange={(v) => setTokens({ sliderTrackHeight: `${v}px` })}
          hint={["2px thin", "16px thick"]}
          onReset={() => resetColor(["sliderTrackHeight"])}
        />

        <Row
          label="Radius preset"
          onReset={() => resetColor(["sliderTrackRadius"])}
        >
          {TRACK_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? trackRadiusPx >= 100
                  : tokens.sliderTrackRadius === p.value
              }
              onClick={() => setTokens({ sliderTrackRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Thumb ── */}
      <Section title="Thumb">
        <SliderRow
          label={`Size — ${thumbSizePx}px`}
          min={12}
          max={32}
          step={1}
          value={thumbSizePx}
          onChange={(v) => setTokens({ sliderThumbSize: `${v}px` })}
          hint={["12px small", "32px large"]}
          onReset={() => resetColor(["sliderThumbSize"])}
        />

        <SliderRow
          label={`Dot size — ${thumbDotSizePx}px`}
          min={8}
          max={24}
          step={1}
          value={thumbDotSizePx}
          onChange={(v) => setTokens({ sliderThumbDotSize: `${v}px` })}
          hint={["8px small", "24px large"]}
          onReset={() => resetColor(["sliderThumbDotSize"])}
        />

        <Row
          label="Radius preset"
          onReset={() => resetColor(["sliderThumbRadius"])}
        >
          {THUMB_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? thumbRadiusPx >= 100
                  : tokens.sliderThumbRadius === p.value
              }
              onClick={() => setTokens({ sliderThumbRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        <ShadowBuilder
          value={tokens.sliderThumbShadow}
          onChange={(v) => setTokens({ sliderThumbShadow: v })}
          onReset={() => resetColor(["sliderThumbShadow"])}
          defaults={{ y: 1, blur: 3, opacity: 15 }}
        />
      </Section>

      {/* ── 3D Transform ── */}
      <Transform3DControls
        keys={{
          rotateX: "sliderRotateX",
          rotateY: "sliderRotateY",
          rotateZ: "sliderRotateZ",
        }}
      />

      {/* ── Hover animation ── */}
      <Hover3DControls
        keys={{
          hoverRotateX: "sliderHoverRotateX",
          hoverRotateY: "sliderHoverRotateY",
          hoverRotateZ: "sliderHoverRotateZ",
          hoverTranslateY: "sliderHoverTranslateY",
          hoverScale: "sliderHoverScale",
          transitionDuration: "sliderTransitionDuration",
        }}
      />
    </div>
  );
}
