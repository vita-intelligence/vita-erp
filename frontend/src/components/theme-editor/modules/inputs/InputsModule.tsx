"use client";

import { useThemeStore } from "@/stores/theme";

import {
  BorderControls,
  BorderStyleRow,
  Chip,
  FontWeightRow,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  TransitionRow,
} from "../_shared";
import { Preview } from "./Preview";

// ── Module ────────────────────────────────────────────────────────────────────

export function InputsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();

  const radiusPx = parseFloat(tokens.inputRadius ?? "0");
  const paddingXPx = parseFloat(tokens.inputPaddingX ?? "12");
  const paddingYPx = parseFloat(tokens.inputPaddingY ?? "8");
  const fontSizePx = parseFloat(tokens.inputFontSize ?? "14");
  const labelSizePx = parseFloat(tokens.inputLabelSize ?? "12");
  const placeholderPct = Math.round(
    parseFloat(tokens.inputPlaceholderOpacity ?? "0.45") * 100,
  );
  const focusRingPx = parseFloat(tokens.inputFocusRingWidth ?? "2");
  const focusOffsetPx = parseFloat(tokens.inputFocusRingOffset ?? "0");

  return (
    <div className="space-y-6">
      <p className="text-xs" style={{ color: "var(--vita-neutral-500)" }}>
        Click any field in the preview to see the focus ring live. Use the label
        placement and error controls to explore layout options.
      </p>

      <Preview />

      {/* ── Shape ── */}
      <Section title="Shape">
        <SliderRow
          label={`Radius — ${radiusPx}px`}
          min={0}
          max={20}
          step={0.5}
          value={radiusPx}
          onChange={(v) => setTokens({ inputRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["inputRadius"])}
        />
        <SliderRow
          label={`Padding X — ${paddingXPx}px`}
          min={4}
          max={32}
          step={1}
          value={paddingXPx}
          onChange={(v) => setTokens({ inputPaddingX: `${v}px` })}
          hint={["4px tight", "32px spacious"]}
          onReset={() => resetColor(["inputPaddingX"])}
        />
        <SliderRow
          label={`Padding Y — ${paddingYPx}px`}
          min={2}
          max={20}
          step={1}
          value={paddingYPx}
          onChange={(v) => setTokens({ inputPaddingY: `${v}px` })}
          hint={["2px compact", "20px tall"]}
          onReset={() => resetColor(["inputPaddingY"])}
        />
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <BorderControls
          keys={{
            top: "inputBorderTop",
            right: "inputBorderRight",
            bottom: "inputBorderBottom",
            left: "inputBorderLeft",
          }}
        />
        <BorderStyleRow tokenKey="inputBorderStyle" />
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.inputShadow ?? "none"}
          onChange={(v) => setTokens({ inputShadow: v })}
          onReset={() => resetColor(["inputShadow"])}
          defaults={{ y: 2, blur: 4, opacity: 8 }}
        />
      </Section>

      {/* ── Focus ring ── */}
      <Section title="Focus ring">
        <SliderRow
          label={`Ring width — ${focusRingPx}px`}
          min={0}
          max={6}
          step={0.5}
          value={focusRingPx}
          onChange={(v) => setTokens({ inputFocusRingWidth: `${v}px` })}
          hint={["0 none", "6px bold"]}
          onReset={() => resetColor(["inputFocusRingWidth"])}
        />
        <SliderRow
          label={`Ring offset — ${focusOffsetPx}px`}
          min={0}
          max={6}
          step={0.5}
          value={focusOffsetPx}
          onChange={(v) => setTokens({ inputFocusRingOffset: `${v}px` })}
          hint={["0 flush", "6px gap"]}
          onReset={() => resetColor(["inputFocusRingOffset"])}
        />
      </Section>

      {/* ── Typography ── */}
      <Section title="Typography">
        <SliderRow
          label={`Input text — ${fontSizePx}px`}
          min={10}
          max={20}
          step={0.5}
          value={fontSizePx}
          onChange={(v) => setTokens({ inputFontSize: `${v}px` })}
          hint={["10px small", "20px large"]}
          onReset={() => resetColor(["inputFontSize"])}
        />
        <SliderRow
          label={`Label size — ${labelSizePx}px`}
          min={9}
          max={16}
          step={0.5}
          value={labelSizePx}
          onChange={(v) => setTokens({ inputLabelSize: `${v}px` })}
          hint={["9px tiny", "16px prominent"]}
          onReset={() => resetColor(["inputLabelSize"])}
        />
        <FontWeightRow tokenKey="inputLabelWeight" label="Label weight" />
        <Row label="Text align" onReset={() => resetColor(["inputTextAlign"])}>
          {[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ].map((o) => (
            <Chip
              key={o.value}
              active={tokens.inputTextAlign === o.value}
              onClick={() => setTokens({ inputTextAlign: o.value })}
            >
              {o.label}
            </Chip>
          ))}
        </Row>
        <SliderRow
          label={`Placeholder — ${placeholderPct}%`}
          min={10}
          max={90}
          step={5}
          value={placeholderPct}
          onChange={(v) =>
            setTokens({ inputPlaceholderOpacity: (v / 100).toFixed(2) })
          }
          hint={["10% faded", "90% visible"]}
          onReset={() => resetColor(["inputPlaceholderOpacity"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title="Motion">
        <TransitionRow tokenKey="inputTransitionDuration" />
      </Section>
    </div>
  );
}
