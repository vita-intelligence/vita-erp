"use client";

/**
 * ColorsModule — composes neutral controls, brand colors, surfaces, and text.
 */

import { RotateCcw } from "lucide-react";

import { BRAND_COLOR_META, deriveVariants, SURFACE_COLOR_META } from "@/config";
import { cssColorToHex } from "@/lib/color";
import { useThemeStore } from "@/stores/theme";

import { NeutralControls } from "./NeutralControls";
import { TextSection } from "./TextSection";

export function ColorsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();

  return (
    <div className="space-y-8">
      {/* ── Neutrals ── */}
      <NeutralControls />

      {/* ── Brand colors ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-vita-neutral-800">
            Brand colors
          </h3>
          <p className="text-xs text-vita-neutral-500">
            Each color auto-generates light and dark variants from your base
            pick.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {BRAND_COLOR_META.map(
            ({ key, lightKey, darkKey, label, description }) => (
              <div
                key={key}
                className="flex flex-col gap-2 rounded-vita-lg border border-vita-neutral-200 bg-vita-surface p-3"
              >
                <div className="flex h-10 w-full overflow-hidden rounded-vita-md shadow-vita-xs">
                  <div
                    className="flex-1"
                    style={{ background: `var(--vita-${key}-dark)` }}
                  />
                  <div
                    className="flex-[2]"
                    style={{ background: `var(--vita-${key})` }}
                  />
                  <div
                    className="flex-1"
                    style={{ background: `var(--vita-${key}-light)` }}
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-vita-neutral-800">
                      {label}
                    </p>
                    <p className="text-xs text-vita-neutral-400 leading-tight">
                      {description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      title={`Reset ${label}`}
                      className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
                      onClick={() => resetColor([key, lightKey, darkKey])}
                    >
                      <RotateCcw size={12} />
                    </button>
                    <input
                      type="color"
                      title={`Change ${label}`}
                      className="h-7 w-7 cursor-pointer rounded-vita-sm border border-vita-neutral-200"
                      value={cssColorToHex(tokens[key])}
                      onChange={(e) => {
                        const { light, dark } = deriveVariants(e.target.value);
                        setTokens({
                          [key]: e.target.value,
                          [lightKey]: light,
                          [darkKey]: dark,
                        } as Parameters<typeof setTokens>[0]);
                      }}
                    />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ── Surfaces ── */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-vita-neutral-800">
            Surfaces
          </h3>
          <p className="text-xs text-vita-neutral-500">
            Page and card backgrounds — auto-linked to neutral tint, or pick
            custom values.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {SURFACE_COLOR_META.map(({ key, label, description }) => (
            <div
              key={key}
              className="flex flex-col gap-2 rounded-vita-lg border border-vita-neutral-200 bg-vita-surface p-3"
            >
              <div
                className="h-10 w-full rounded-vita-md border border-vita-neutral-200 shadow-vita-xs"
                style={{ background: `var(--vita-${key})` }}
              />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-vita-neutral-800">
                    {label}
                  </p>
                  <p className="text-xs text-vita-neutral-400 leading-tight">
                    {description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    title={`Reset ${label}`}
                    className="p-1 text-vita-neutral-400 hover:text-vita-neutral-600"
                    onClick={() => resetColor([key])}
                  >
                    <RotateCcw size={12} />
                  </button>
                  <input
                    type="color"
                    title={`Change ${label}`}
                    className="h-7 w-7 cursor-pointer rounded-vita-sm border border-vita-neutral-200"
                    value={cssColorToHex(tokens[key])}
                    onChange={(e) =>
                      setTokens({
                        [key]: e.target.value,
                      } as Parameters<typeof setTokens>[0])
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Text colors ── */}
      <TextSection />
    </div>
  );
}
