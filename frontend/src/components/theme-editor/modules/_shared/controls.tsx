"use client";

/**
 * Reusable token-bound control rows — eliminate duplication across modules.
 *
 * Each component reads/writes a single ThemeTokens key via useThemeStore,
 * rendering a Row of Chips with preset options and a reset button.
 */

import type { ThemeTokens } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

import { Chip, Row } from "./primitives";

// ── Font weight ──────────────────────────────────────────────────────────────

const WEIGHT_OPTIONS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
];

export function FontWeightRow({
  tokenKey,
  label = "Font weight",
}: {
  tokenKey: keyof ThemeTokens;
  label?: string;
}) {
  const { tokens, setTokens, resetColor } = useThemeStore();
  return (
    <Row label={label} onReset={() => resetColor([tokenKey])}>
      {WEIGHT_OPTIONS.map((o) => (
        <Chip
          key={o.value}
          active={tokens[tokenKey] === o.value}
          onClick={() =>
            setTokens({ [tokenKey]: o.value } as Partial<ThemeTokens>)
          }
        >
          {o.label}
        </Chip>
      ))}
    </Row>
  );
}

// ── Transition duration ──────────────────────────────────────────────────────

const TRANSITION_OPTIONS = [
  { label: "Instant", value: "0ms" },
  { label: "Fast", value: "100ms" },
  { label: "Normal", value: "150ms" },
  { label: "Smooth", value: "250ms" },
  { label: "Slow", value: "400ms" },
];

export function TransitionRow({ tokenKey }: { tokenKey: keyof ThemeTokens }) {
  const { tokens, setTokens, resetColor } = useThemeStore();
  return (
    <Row label="Transition" onReset={() => resetColor([tokenKey])}>
      {TRANSITION_OPTIONS.map((o) => (
        <Chip
          key={o.value}
          active={tokens[tokenKey] === o.value}
          onClick={() =>
            setTokens({ [tokenKey]: o.value } as Partial<ThemeTokens>)
          }
        >
          {o.label}
        </Chip>
      ))}
    </Row>
  );
}

// ── Border style ─────────────────────────────────────────────────────────────

const BORDER_STYLE_OPTIONS = [
  { label: "— Solid", value: "solid" },
  { label: "- - Dashed", value: "dashed" },
  { label: "··· Dotted", value: "dotted" },
];

export function BorderStyleRow({ tokenKey }: { tokenKey: keyof ThemeTokens }) {
  const { tokens, setTokens, resetColor } = useThemeStore();
  return (
    <Row label="Style" onReset={() => resetColor([tokenKey])}>
      {BORDER_STYLE_OPTIONS.map((o) => (
        <Chip
          key={o.value}
          active={tokens[tokenKey] === o.value}
          onClick={() =>
            setTokens({ [tokenKey]: o.value } as Partial<ThemeTokens>)
          }
        >
          {o.label}
        </Chip>
      ))}
    </Row>
  );
}
