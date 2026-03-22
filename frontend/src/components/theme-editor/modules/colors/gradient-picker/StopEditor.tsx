"use client";

/**
 * Single color stop editor — color picker, position slider, remove button.
 */

import { Minus } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("themeEditor.modules.colors");

  return (
    <div className="flex items-center gap-2">
      <ColorInput
        value={stop.color}
        title={t("stopColor", { index: index + 1 })}
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
        title={t("stopPosition", { index: index + 1 })}
      />
      <span className="w-8 text-right text-xs font-vita-mono text-vita-text-muted">
        {stop.position}%
      </span>
      {canRemove && (
        <button
          type="button"
          title={t("removeStop")}
          className="p-0.5 text-vita-text-muted hover:text-vita-text-secondary"
          onClick={() => onRemove(index)}
        >
          <Minus size={10} />
        </button>
      )}
    </div>
  );
}
