"use client";

/**
 * Generic per-side border width controls — reused by Buttons and Inputs modules.
 *
 * Supports a "sync all" mode (single slider) and an "individual" mode
 * (one slider per side), with an unlink toggle and reset button.
 */

import { RotateCcw, Unlink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { ThemeTokens } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

import { SliderRow } from "./primitives";

// ── Types ────────────────────────────────────────────────────────────────────

type SideKeys = {
  top: keyof ThemeTokens;
  right: keyof ThemeTokens;
  bottom: keyof ThemeTokens;
  left: keyof ThemeTokens;
};

export type BorderControlsProps = {
  keys: SideKeys;
  /** Maximum slider value (default 6). */
  max?: number;
  /** Slider step (default 0.5). */
  step?: number;
  /** Right-side hint text for the "all" slider (default "6px heavy"). */
  hintMax?: string;
};

// ── Component ────────────────────────────────────────────────────────────────

const SIDES: (keyof SideKeys)[] = ["top", "right", "bottom", "left"];

const SIDE_TRANSLATION_KEYS = {
  top: "controls.borderTop",
  right: "controls.borderRight",
  bottom: "controls.borderBottom",
  left: "controls.borderLeft",
} as const;

export function BorderControls({
  keys,
  max = 6,
  step = 0.5,
  hintMax = "6px heavy",
}: BorderControlsProps) {
  const t = useTranslations("themeEditor");
  const { tokens, setTokens, resetColor } = useThemeStore();
  const [individual, setIndividual] = useState(false);

  const allVal = parseFloat(tokens[keys.top] ?? "1");

  function setAll(v: number) {
    const px = `${v}px`;
    setTokens({
      [keys.top]: px,
      [keys.right]: px,
      [keys.bottom]: px,
      [keys.left]: px,
    } as Partial<ThemeTokens>);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="text-xs"
          style={{ color: "var(--vita-text-secondary)" }}
        >
          Width
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title={
              individual
                ? t("controls.borderSync")
                : t("controls.borderIndividual")
            }
            className="p-0.5 transition-colors"
            style={{
              color: individual
                ? "var(--vita-primary)"
                : "var(--vita-text-muted)",
            }}
            onClick={() => setIndividual((v) => !v)}
          >
            <Unlink size={11} />
          </button>
          <button
            type="button"
            title="Reset borders"
            className="p-0.5 transition-colors"
            style={{ color: "var(--vita-text-muted)" }}
            onClick={() =>
              resetColor([keys.top, keys.right, keys.bottom, keys.left])
            }
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {!individual ? (
        <SliderRow
          label={`${t("controls.borderAll")} — ${allVal}px`}
          min={0}
          max={max}
          step={step}
          value={allVal}
          onChange={setAll}
          hint={["0 none", hintMax]}
        />
      ) : (
        <div className="space-y-2">
          {SIDES.map((side) => {
            const key = keys[side];
            return (
              <SliderRow
                key={key}
                label={`${t(SIDE_TRANSLATION_KEYS[side])} — ${parseFloat(tokens[key] ?? "1")}px`}
                min={0}
                max={max}
                step={step}
                value={parseFloat(tokens[key] ?? "1")}
                onChange={(v) =>
                  setTokens({ [key]: `${v}px` } as Partial<ThemeTokens>)
                }
                hint={["0", `${max}px`]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
