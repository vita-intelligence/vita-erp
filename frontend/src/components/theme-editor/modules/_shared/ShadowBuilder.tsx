"use client";

/**
 * Interactive shadow builder — used by Buttons, Inputs, and Cards modules.
 */

import { useCallback, useEffect, useState } from "react";
import { Chip, Row, SliderRow } from "./primitives";

// ── Types & helpers ──────────────────────────────────────────────────────────

type ShadowState = {
  x: number;
  y: number;
  blur: number;
  spread: number;
  opacity: number;
  inset: boolean;
};

export type ShadowBuilderDefaults = Partial<ShadowState>;

export type ShadowBuilderProps = {
  value: string;
  onChange: (v: string) => void;
  onReset: () => void;
  /** Override initial slider values when shadow is first enabled. */
  defaults?: ShadowBuilderDefaults;
};

const BASE_DEFAULTS: ShadowState = {
  x: 0,
  y: 4,
  blur: 8,
  spread: 0,
  opacity: 10,
  inset: false,
};

function computeShadow(s: ShadowState): string {
  const op = (s.opacity / 100).toFixed(2);
  const c = `oklch(0 0 0 / ${op})`;
  const insetStr = s.inset ? "inset " : "";
  return `${insetStr}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${c}`;
}

/** Try to parse a CSS shadow string we generated back into state. */
function parseShadow(css: string): ShadowState | null {
  if (!css || css === "none") return null;
  const inset = css.startsWith("inset ");
  const body = inset ? css.slice(6) : css;
  const match = body.match(
    /^(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s+(-?[\d.]+)px\s+oklch\(0 0 0 \/ ([\d.]+)\)/,
  );
  if (!match) return null;
  return {
    x: Number(match[1]),
    y: Number(match[2]),
    blur: Number(match[3]),
    spread: Number(match[4]),
    opacity: Math.round(Number(match[5]) * 100),
    inset,
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export function ShadowBuilder({
  value,
  onChange,
  onReset,
  defaults,
}: ShadowBuilderProps) {
  const initDefaults = { ...BASE_DEFAULTS, ...defaults };
  const parsed = parseShadow(value);

  const [enabled, setEnabled] = useState(() => value !== "none");
  const [state, setState] = useState<ShadowState>(() => parsed ?? initDefaults);

  // Sync enabled state when value is reset externally
  useEffect(() => {
    if (value === "none") setEnabled(false);
  }, [value]);

  const update = useCallback(
    (s: ShadowState) => onChange(computeShadow(s)),
    [onChange],
  );

  const patch = (partial: Partial<ShadowState>) => {
    const next = { ...state, ...partial };
    setState(next);
    update(next);
  };

  return (
    <div className="space-y-3">
      <Row label="Shadow" onReset={onReset}>
        <Chip
          active={!enabled}
          onClick={() => {
            setEnabled(false);
            onChange("none");
          }}
        >
          None
        </Chip>
        <Chip
          active={enabled}
          onClick={() => {
            setEnabled(true);
            update(state);
          }}
        >
          Custom
        </Chip>
      </Row>

      {enabled && (
        <>
          <SliderRow
            label={`X — ${state.x}px`}
            min={-20}
            max={20}
            value={state.x}
            onChange={(x) => patch({ x })}
            hint={["−20px left", "+20px right"]}
          />
          <SliderRow
            label={`Y — ${state.y}px`}
            min={-20}
            max={20}
            value={state.y}
            onChange={(y) => patch({ y })}
            hint={["−20px up", "+20px down"]}
          />
          <SliderRow
            label={`Blur — ${state.blur}px`}
            min={0}
            max={50}
            value={state.blur}
            onChange={(blur) => patch({ blur })}
            hint={["0 sharp", "50px soft"]}
          />
          <SliderRow
            label={`Spread — ${state.spread}px`}
            min={-10}
            max={20}
            value={state.spread}
            onChange={(spread) => patch({ spread })}
            hint={["−10 shrink", "+20 grow"]}
          />
          <SliderRow
            label={`Opacity — ${state.opacity}%`}
            min={1}
            max={50}
            value={state.opacity}
            onChange={(opacity) => patch({ opacity })}
            hint={["1% subtle", "50% strong"]}
          />
          <Row label="Type">
            <Chip active={!state.inset} onClick={() => patch({ inset: false })}>
              Outer
            </Chip>
            <Chip active={state.inset} onClick={() => patch({ inset: true })}>
              Inset
            </Chip>
          </Row>
        </>
      )}
    </div>
  );
}
