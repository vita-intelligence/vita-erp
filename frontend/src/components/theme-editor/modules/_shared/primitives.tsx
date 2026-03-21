"use client";

/**
 * Low-level UI primitives shared across all theme editor modules.
 */

import { RotateCcw } from "lucide-react";

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
              color: "var(--vita-text-secondary)",
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
        <span className="w-28 text-xs text-vita-text-secondary">{label}</span>
        {onReset && (
          <button
            type="button"
            title="Reset"
            className="p-0.5 text-vita-text-muted hover:text-vita-text-secondary"
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
        <span className="flex-1 text-xs text-vita-text-secondary">{label}</span>
        {onReset && (
          <button
            type="button"
            title="Reset"
            className="p-0.5 text-vita-text-muted hover:text-vita-text-secondary"
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
          <div className="flex justify-between text-xs text-vita-text-muted">
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
      <p className="text-xs font-semibold uppercase tracking-widest text-vita-text-muted">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
