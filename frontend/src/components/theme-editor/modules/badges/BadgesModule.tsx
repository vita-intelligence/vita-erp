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

// ── Presets ──────────────────────────────────────────────────────────────────

const RADIUS_PRESETS = [
  { label: "Square", value: "0px" },
  { label: "Soft", value: "4px" },
  { label: "Rounded", value: "8px" },
  { label: "Large", value: "16px" },
  { label: "Pill", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function BadgesModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const isPill = parseFloat(tokens.badgeRadius) >= 100;
  const fontSizeRem = parseFloat(tokens.badgeFontSize ?? "0.6875");
  const paddingXRem = parseFloat(tokens.badgePaddingX ?? "0.55");
  const paddingYRem = parseFloat(tokens.badgePaddingY ?? "0.2");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the appearance of status badges, chips, and tags across the
        entire interface.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title="Shape">
        <Row label="Preset" onReset={() => resetColor(["badgeRadius"])}>
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
            label={`Radius — ${parseFloat(tokens.badgeRadius)}px`}
            min={0}
            max={32}
            step={1}
            value={Math.min(parseFloat(tokens.badgeRadius), 32)}
            onChange={(v) => setTokens({ badgeRadius: `${v}px` })}
            hint={["0 square", "32px rounded"]}
          />
        )}
      </Section>

      {/* ── Spacing ── */}
      <Section title="Spacing">
        <SliderRow
          label={`Padding X — ${paddingXRem}rem`}
          min={0.2}
          max={1.2}
          step={0.05}
          value={paddingXRem}
          onChange={(v) => setTokens({ badgePaddingX: `${v}rem` })}
          hint={["0.2 tight", "1.2 spacious"]}
          onReset={() => resetColor(["badgePaddingX"])}
        />
        <SliderRow
          label={`Padding Y — ${paddingYRem}rem`}
          min={0.05}
          max={0.6}
          step={0.05}
          value={paddingYRem}
          onChange={(v) => setTokens({ badgePaddingY: `${v}rem` })}
          hint={["0.05 compact", "0.6 tall"]}
          onReset={() => resetColor(["badgePaddingY"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <BorderControls
          keys={{
            top: "badgeBorderTop",
            right: "badgeBorderRight",
            bottom: "badgeBorderBottom",
            left: "badgeBorderLeft",
          }}
          max={3}
          step={0.5}
          hintMax="3px heavy"
        />
        <BorderStyleRow tokenKey="badgeBorderStyle" />
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <FontWeightRow tokenKey="badgeFontWeight" />

        <SliderRow
          label={`Font size — ${fontSizeRem}rem`}
          min={0.5}
          max={1}
          step={0.0625}
          value={fontSizeRem}
          onChange={(v) => setTokens({ badgeFontSize: `${v}rem` })}
          hint={["0.5 tiny", "1.0 large"]}
          onReset={() => resetColor(["badgeFontSize"])}
        />

        <Row
          label="Letter spacing"
          onReset={() => resetColor(["badgeLetterSpacing"])}
        >
          {[
            { label: "Default", value: "0em" },
            { label: "Snug", value: "0.02em" },
            { label: "Wide", value: "0.06em" },
            { label: "Widest", value: "0.12em" },
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
          label="Text case"
          onReset={() => resetColor(["badgeTextTransform"])}
        >
          {[
            { label: "Normal", value: "none" },
            { label: "UPPERCASE", value: "uppercase" },
            { label: "Capitalize", value: "capitalize" },
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
