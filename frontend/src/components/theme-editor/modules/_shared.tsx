"use client";

/**
 * Shared sub-components for theme editor modules.
 */

import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ── Chip ──────────────────────────────────────────────────────────────────────

export type ChipProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  wide?: boolean;
};

export function Chip({ active, onClick, children, wide }: ChipProps) {
  return (
    <button
      type="button"
      className={`rounded-vita-xs border px-2.5 py-0.5 text-xs transition-colors${wide ? " flex-1" : ""}`}
      style={
        active
          ? {
              background: "var(--vita-primary)",
              color: "var(--vita-text-on-primary)",
              borderColor: "var(--vita-primary)",
            }
          : {
              background: "var(--vita-surface)",
              color: "var(--vita-neutral-700)",
              borderColor: "var(--vita-neutral-200)",
            }
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────

export type RowProps = {
  label: string;
  onReset?: () => void;
  children: React.ReactNode;
};

export function Row({ label, onReset, children }: RowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex shrink-0 items-center gap-1 pt-0.5">
        <span className="w-28 text-xs text-vita-neutral-600">{label}</span>
        {onReset && (
          <button
            type="button"
            title="Reset"
            className="p-0.5 text-vita-neutral-300 hover:text-vita-neutral-500"
            onClick={onReset}
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// ── SliderRow ─────────────────────────────────────────────────────────────────

export type SliderRowProps = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  /** [left label, right label] shown below the track */
  hint?: [string, string];
  onReset?: () => void;
};

export function SliderRow({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  hint,
  onReset,
}: SliderRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex w-28 shrink-0 items-center gap-1 pt-0.5">
        <span className="flex-1 text-xs text-vita-neutral-600">{label}</span>
        {onReset && (
          <button
            type="button"
            title="Reset"
            className="p-0.5 text-vita-neutral-300 hover:text-vita-neutral-500"
            onClick={onReset}
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>
      <div className="flex-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className="w-full accent-vita-primary"
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {hint && (
          <div className="flex justify-between text-xs text-vita-neutral-400">
            <span>{hint[0]}</span>
            <span>{hint[1]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export type SectionProps = { title: string; children: React.ReactNode };

export function Section({ title, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-neutral-400">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// ── Shadow builder ────────────────────────────────────────────────────────────

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
  // Expect: Xpx Ypx Blurpx Spreadpx oklch(...)
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
