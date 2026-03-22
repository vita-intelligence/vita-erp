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

const TRIGGER_RADIUS_PRESETS = [
  { label: "Sharp", value: "0px" },
  { label: "Soft", value: "6px" },
  { label: "Rounded", value: "12px" },
  { label: "Pill", value: "9999px" },
];

// ── Module ───────────────────────────────────────────────────────────────────

export function DatePickerModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();

  const triggerRadius = parseFloat(tokens.datePickerTriggerRadius ?? "0");
  const triggerBorderWidth = parseFloat(
    tokens.datePickerTriggerBorderWidth ?? "1",
  );
  const triggerPaddingX = parseFloat(tokens.datePickerTriggerPaddingX ?? "12");
  const triggerPaddingY = parseFloat(tokens.datePickerTriggerPaddingY ?? "8");
  const popoverRadius = parseFloat(tokens.datePickerPopoverRadius ?? "0");
  const popoverPadding = parseFloat(tokens.datePickerPopoverPadding ?? "12");
  const indicatorSize = parseFloat(tokens.datePickerIndicatorSize ?? "18");

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls the trigger, popover, and indicator of date picker fields.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Trigger ── */}
      <Section title="Trigger">
        <Row
          label="Radius"
          onReset={() => resetColor(["datePickerTriggerRadius"])}
        >
          {TRIGGER_RADIUS_PRESETS.map((p) => (
            <Chip
              key={p.value}
              active={tokens.datePickerTriggerRadius === p.value}
              onClick={() => setTokens({ datePickerTriggerRadius: p.value })}
            >
              {p.label}
            </Chip>
          ))}
        </Row>

        <SliderRow
          label={`Radius — ${triggerRadius > 100 ? "pill" : `${triggerRadius}px`}`}
          min={0}
          max={20}
          step={1}
          value={Math.min(triggerRadius, 20)}
          onChange={(v) => setTokens({ datePickerTriggerRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
        />

        <SliderRow
          label={`Border — ${triggerBorderWidth}px`}
          min={0}
          max={3}
          step={0.5}
          value={triggerBorderWidth}
          onChange={(v) =>
            setTokens({ datePickerTriggerBorderWidth: `${v}px` })
          }
          hint={["0 none", "3px heavy"]}
          onReset={() => resetColor(["datePickerTriggerBorderWidth"])}
        />

        {triggerBorderWidth > 0 && (
          <BorderStyleRow tokenKey="datePickerTriggerBorderStyle" />
        )}

        <SliderRow
          label={`Padding X — ${triggerPaddingX}px`}
          min={4}
          max={20}
          step={1}
          value={triggerPaddingX}
          onChange={(v) => setTokens({ datePickerTriggerPaddingX: `${v}px` })}
          hint={["4px tight", "20px spacious"]}
          onReset={() => resetColor(["datePickerTriggerPaddingX"])}
        />

        <SliderRow
          label={`Padding Y — ${triggerPaddingY}px`}
          min={4}
          max={14}
          step={1}
          value={triggerPaddingY}
          onChange={(v) => setTokens({ datePickerTriggerPaddingY: `${v}px` })}
          hint={["4px compact", "14px tall"]}
          onReset={() => resetColor(["datePickerTriggerPaddingY"])}
        />
      </Section>

      {/* ── Trigger shadow ── */}
      <Section title="Trigger shadow">
        <ShadowBuilder
          value={tokens.datePickerTriggerShadow ?? "none"}
          onChange={(v) => setTokens({ datePickerTriggerShadow: v })}
          onReset={() => resetColor(["datePickerTriggerShadow"])}
          defaults={{ y: 1, blur: 3, opacity: 6 }}
        />
      </Section>

      {/* ── Popover ── */}
      <Section title="Popover">
        <SliderRow
          label={`Radius — ${popoverRadius}px`}
          min={0}
          max={20}
          step={1}
          value={popoverRadius}
          onChange={(v) => setTokens({ datePickerPopoverRadius: `${v}px` })}
          hint={["0 sharp", "20px rounded"]}
          onReset={() => resetColor(["datePickerPopoverRadius"])}
        />

        <SliderRow
          label={`Padding — ${popoverPadding}px`}
          min={4}
          max={24}
          step={2}
          value={popoverPadding}
          onChange={(v) => setTokens({ datePickerPopoverPadding: `${v}px` })}
          hint={["4px tight", "24px spacious"]}
          onReset={() => resetColor(["datePickerPopoverPadding"])}
        />
      </Section>

      {/* ── Popover shadow ── */}
      <Section title="Popover shadow">
        <ShadowBuilder
          value={tokens.datePickerPopoverShadow ?? "none"}
          onChange={(v) => setTokens({ datePickerPopoverShadow: v })}
          onReset={() => resetColor(["datePickerPopoverShadow"])}
          defaults={{ y: 4, blur: 12, opacity: 10 }}
        />
      </Section>

      {/* ── Indicator ── */}
      <Section title="Indicator">
        <SliderRow
          label={`Size — ${indicatorSize}px`}
          min={12}
          max={28}
          step={1}
          value={indicatorSize}
          onChange={(v) => setTokens({ datePickerIndicatorSize: `${v}px` })}
          hint={["12px small", "28px large"]}
          onReset={() => resetColor(["datePickerIndicatorSize"])}
        />
      </Section>

      {/* ── Motion ── */}
      <Section title="Motion">
        <TransitionRow tokenKey="datePickerTransitionDuration" />
      </Section>
    </div>
  );
}
