"use client";

import { RotateCcw } from "lucide-react";

import { useThemeStore } from "@/stores/theme";
import {
  Chip,
  Row,
  Section,
  ShadowBuilder,
  usePreviewExternal,
} from "../_shared";
import { Preview } from "./Preview";

export function CardsModule() {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const previewExternal = usePreviewExternal();
  const radiusPx = parseFloat(tokens.cardRadius);

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-neutral-500">
        Controls the appearance of all cards and panels — the primary content
        containers across the ERP interface.
      </p>

      {!previewExternal && <Preview />}

      {/* ── Shape ── */}
      <Section title="Shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vita-neutral-600">Corner radius</span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-vita-neutral-600">
                {radiusPx}px
              </span>
              <button
                type="button"
                title="Reset"
                className="p-0.5 text-vita-neutral-300 hover:text-vita-neutral-500"
                onClick={() => resetColor(["cardRadius"])}
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={radiusPx}
            className="w-full accent-vita-primary"
            onChange={(e) => setTokens({ cardRadius: `${e.target.value}px` })}
          />
          <div className="flex justify-between text-xs text-vita-neutral-400">
            <span>0 — sharp</span>
            <span>24px — rounded</span>
          </div>
        </div>
      </Section>

      {/* ── Border ── */}
      <Section title="Border">
        <Row label="Width" onReset={() => resetColor(["cardBorderWidth"])}>
          {["1px", "2px", "3px"].map((v) => (
            <Chip
              key={v}
              active={tokens.cardBorderWidth === v}
              onClick={() => setTokens({ cardBorderWidth: v })}
            >
              {v}
            </Chip>
          ))}
        </Row>
      </Section>

      {/* ── Shadow ── */}
      <Section title="Shadow">
        <ShadowBuilder
          value={tokens.cardShadow}
          onChange={(v) => setTokens({ cardShadow: v })}
          onReset={() => resetColor(["cardShadow"])}
          defaults={{ y: 6, blur: 10, opacity: 8 }}
        />
      </Section>
    </div>
  );
}
