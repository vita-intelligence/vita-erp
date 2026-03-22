"use client";

import { useThemeStore } from "@/stores/theme";

import {
  BorderStyleRow,
  Chip,
  Row,
  Section,
  ShadowBuilder,
  SliderRow,
  TransitionRow,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

// ── Presets ──────────────────────────────────────────────────────────────────

const POPOVER_RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "Soft", value: "8px" },
  { label: "Rounded", value: "14px" },
  { label: "Large", value: "20px" },
];

const SWATCH_RADIUS_PRESETS = [
  { label: "Square", value: "0px" },
  { label: "Soft", value: "4px" },
  { label: "Rounded", value: "8px" },
  { label: "Circle", value: "9999px" },
];

const SWATCH_SIZE_PRESETS = [
  { label: "Small", value: "20px" },
  { label: "Medium", value: "28px" },
  { label: "Large", value: "36px" },
  { label: "XL", value: "44px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function ColorPickerModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const popoverRadius = parseFloat(tokens.colorPickerPopoverRadius ?? "8");
  const popoverPadding = parseFloat(tokens.colorPickerPopoverPadding ?? "16");
  const popoverBorder = parseFloat(tokens.colorPickerPopoverBorderWidth ?? "1");
  const swatchRadius = parseFloat(tokens.colorPickerSwatchRadius ?? "6");
  const swatchSize = parseFloat(tokens.colorPickerSwatchSize ?? "28");
  const swatchGap = parseFloat(tokens.colorPickerSwatchGap ?? "6");
  const swatchBorder = parseFloat(tokens.colorPickerSwatchBorderWidth ?? "2");
  const sliderRadius = parseFloat(tokens.colorPickerSliderRadius ?? "9999");
  const sliderHeight = parseFloat(tokens.colorPickerSliderHeight ?? "12");
  const thumbSize = parseFloat(tokens.colorPickerThumbSize ?? "18");
  const thumbBorder = parseFloat(tokens.colorPickerThumbBorderWidth ?? "2");
  const areaRadius = parseFloat(tokens.colorPickerAreaRadius ?? "8");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the appearance of color picker popover, color area, sliders,
        thumbs, and preset swatches across the interface.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Popover ── */}
      <Section title="Popover">
        <Row
          label="Radius"
          onReset={() => resetColor(["colorPickerPopoverRadius"])}
        >
          {POPOVER_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.colorPickerPopoverRadius === p.value}
              onClick={() => setTokens({ colorPickerPopoverRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`Radius — ${popoverRadius}px`}
          min={0}
          max={24}
          step={1}
          value={popoverRadius}
          onChange={(v) => setTokens({ colorPickerPopoverRadius: `${v}px` })}
          hint={["0 sharp", "24px rounded"]}
        />

        <SliderRow
          label={`Padding — ${popoverPadding}px`}
          min={4}
          max={32}
          step={2}
          value={popoverPadding}
          onChange={(v) => setTokens({ colorPickerPopoverPadding: `${v}px` })}
          hint={["4px tight", "32px spacious"]}
          onReset={() => resetColor(["colorPickerPopoverPadding"])}
        />

        <SliderRow
          label={`Border — ${popoverBorder}px`}
          min={0}
          max={3}
          step={0.5}
          value={popoverBorder}
          onChange={(v) =>
            setTokens({ colorPickerPopoverBorderWidth: `${v}px` })
          }
          hint={["0 none", "3px heavy"]}
          onReset={() => resetColor(["colorPickerPopoverBorderWidth"])}
        />

        {popoverBorder > 0 && (
          <BorderStyleRow tokenKey="colorPickerPopoverBorderStyle" />
        )}
      </Section>

      {/* ── Popover shadow ── */}
      <Section title="Popover shadow">
        <ShadowBuilder
          value={tokens.colorPickerPopoverShadow}
          onChange={(v) => setTokens({ colorPickerPopoverShadow: v })}
          onReset={() => resetColor(["colorPickerPopoverShadow"])}
          defaults={{ y: 4, blur: 14, opacity: 10 }}
        />
      </Section>

      {/* ── Color area ── */}
      <Section title="Color area">
        <SliderRow
          label={`Radius — ${areaRadius}px`}
          min={0}
          max={20}
          step={1}
          value={areaRadius}
          onChange={(v) => setTokens({ colorPickerAreaRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["colorPickerAreaRadius"])}
        />
      </Section>

      {/* ── Sliders ── */}
      <Section title="Sliders">
        <SliderRow
          label={`Track height — ${sliderHeight}px`}
          min={6}
          max={24}
          step={1}
          value={sliderHeight}
          onChange={(v) => setTokens({ colorPickerSliderHeight: `${v}px` })}
          hint={["6px thin", "24px thick"]}
          onReset={() => resetColor(["colorPickerSliderHeight"])}
        />

        <SliderRow
          label={`Track radius — ${sliderRadius > 100 ? "pill" : `${sliderRadius}px`}`}
          min={0}
          max={12}
          step={1}
          value={Math.min(sliderRadius, 12)}
          onChange={(v) => setTokens({ colorPickerSliderRadius: `${v}px` })}
          hint={["0 sharp", "12px rounded"]}
          onReset={() => resetColor(["colorPickerSliderRadius"])}
        />

        <Row label="Track shape">
          {[
            { label: "Sharp", value: "0px" },
            { label: "Rounded", value: "6px" },
            { label: "Pill", value: "9999px" },
          ].map((p) => (
            <Chip
              key={p.value}
              active={tokens.colorPickerSliderRadius === p.value}
              onClick={() => setTokens({ colorPickerSliderRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Thumbs ── */}
      <Section title="Thumbs">
        <SliderRow
          label={`Size — ${thumbSize}px`}
          min={12}
          max={28}
          step={1}
          value={thumbSize}
          onChange={(v) => setTokens({ colorPickerThumbSize: `${v}px` })}
          hint={["12px small", "28px large"]}
          onReset={() => resetColor(["colorPickerThumbSize"])}
        />

        <SliderRow
          label={`Border — ${thumbBorder}px`}
          min={1}
          max={4}
          step={0.5}
          value={thumbBorder}
          onChange={(v) => setTokens({ colorPickerThumbBorderWidth: `${v}px` })}
          hint={["1px thin", "4px heavy"]}
          onReset={() => resetColor(["colorPickerThumbBorderWidth"])}
        />
      </Section>

      {/* ── Swatches ── */}
      <Section title="Swatches">
        <Row label="Size" onReset={() => resetColor(["colorPickerSwatchSize"])}>
          {SWATCH_SIZE_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.colorPickerSwatchSize === p.value}
              onClick={() => setTokens({ colorPickerSwatchSize: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`Size — ${swatchSize}px`}
          min={16}
          max={48}
          step={2}
          value={swatchSize}
          onChange={(v) => setTokens({ colorPickerSwatchSize: `${v}px` })}
          hint={["16px tiny", "48px large"]}
        />

        <Row
          label="Shape"
          onReset={() => resetColor(["colorPickerSwatchRadius"])}
        >
          {SWATCH_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={
                p.value === "9999px"
                  ? swatchRadius >= 100
                  : tokens.colorPickerSwatchRadius === p.value
              }
              onClick={() => setTokens({ colorPickerSwatchRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`Gap — ${swatchGap}px`}
          min={2}
          max={14}
          step={1}
          value={swatchGap}
          onChange={(v) => setTokens({ colorPickerSwatchGap: `${v}px` })}
          hint={["2px tight", "14px spaced"]}
          onReset={() => resetColor(["colorPickerSwatchGap"])}
        />

        <SliderRow
          label={`Border — ${swatchBorder}px`}
          min={0}
          max={4}
          step={0.5}
          value={swatchBorder}
          onChange={(v) =>
            setTokens({ colorPickerSwatchBorderWidth: `${v}px` })
          }
          hint={["0 none", "4px heavy"]}
          onReset={() => resetColor(["colorPickerSwatchBorderWidth"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title="Motion">
        <TransitionRow tokenKey="colorPickerTransitionDuration" />
      </Section>
    </div>
  );
}
