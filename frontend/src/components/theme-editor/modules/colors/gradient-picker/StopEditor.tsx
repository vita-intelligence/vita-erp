"use client";

/**
 * Single color stop editor — color picker, position slider, remove button.
 */

import { Minus } from "lucide-react";

import { ColorInput } from "../ColorInput";
import type { ColorStop } from "./helpers";

type StopEditorProps = {
  stop: ColorStop;
  index: number;
  canRemove: boolean;
  onChange: (index: number, stop: ColorStop) => void;
  onRemove: (index: number) => void;
};

export function StopEditor({
  stop,
  index,
  canRemove,
  onChange,
  onRemove,
}: StopEditorProps) {
  return (
    <div className="flex items-center gap-2">
      <ColorInput
        value={stop.color}
        title={`Stop ${index + 1} color`}
        onChange={(hex) => onChange(index, { ...stop, color: hex })}
      />
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={stop.position}
        className="flex-1 accent-vita-primary"
        onChange={(e) =>
          onChange(index, { ...stop, position: Number(e.target.value) })
        }
        title={`Stop ${index + 1} position`}
      />
      <span className="w-8 text-right text-xs font-vita-mono text-vita-text-muted">
        {stop.position}%
      </span>
      {canRemove && (
        <button
          type="button"
          title="Remove stop"
          className="p-0.5 text-vita-text-muted hover:text-vita-text-secondary"
          onClick={() => onRemove(index)}
        >
          <Minus size={10} />
        </button>
      )}
    </div>
  );
}
