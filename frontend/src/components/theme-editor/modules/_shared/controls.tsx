"use client";

/**
 * Reusable token-bound control rows — eliminate duplication across modules.
 *
 * Each component reads/writes a single ThemeTokens key via useThemeStore,
 * rendering a Row of Chips with preset options and a reset button.
 */

import { useTranslations } from "next-intl";

import type { ThemeTokens } from "@/config/themes";
import { useThemeStore } from "@/stores/theme";

import { Chip, Row } from "./primitives";

// ── Font weight ──────────────────────────────────────────────────────────────

const WEIGHT_KEYS = ["regular", "medium", "semibold", "bold"] as const;
const WEIGHT_VALUES: Record<(typeof WEIGHT_KEYS)[number], string> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export function FontWeightRow({
  tokenKey,
  label,
}: {
  tokenKey: keyof ThemeTokens;
  label?: string;
}) {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const t = useTranslations("themeEditor");
  return (
    <Row
      label={label ?? t("controls.fontWeight")}
      onReset={() => resetColor([tokenKey])}
    >
      {WEIGHT_KEYS.map((k) => (
        <Chip
          key={k}
          active={tokens[tokenKey] === WEIGHT_VALUES[k]}
          onClick={() =>
            setTokens({ [tokenKey]: WEIGHT_VALUES[k] } as Partial<ThemeTokens>)
          }
        >
          {t(`controls.${k}`)}
        </Chip>
      ))}
    </Row>
  );
}

// ── Transition duration ──────────────────────────────────────────────────────

const TRANSITION_KEYS = [
  "instant",
  "fast",
  "normal",
  "smooth",
  "slow",
] as const;
const TRANSITION_VALUES: Record<(typeof TRANSITION_KEYS)[number], string> = {
  instant: "0ms",
  fast: "100ms",
  normal: "150ms",
  smooth: "250ms",
  slow: "400ms",
};

export function TransitionRow({ tokenKey }: { tokenKey: keyof ThemeTokens }) {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const t = useTranslations("themeEditor");
  return (
    <Row
      label={t("controls.transition")}
      onReset={() => resetColor([tokenKey])}
    >
      {TRANSITION_KEYS.map((k) => (
        <Chip
          key={k}
          active={tokens[tokenKey] === TRANSITION_VALUES[k]}
          onClick={() =>
            setTokens({
              [tokenKey]: TRANSITION_VALUES[k],
            } as Partial<ThemeTokens>)
          }
        >
          {t(`controls.${k}`)}
        </Chip>
      ))}
    </Row>
  );
}

// ── Border style ─────────────────────────────────────────────────────────────

const BORDER_STYLE_KEYS = ["solid", "dashed", "dotted"] as const;
const BORDER_STYLE_VALUES: Record<(typeof BORDER_STYLE_KEYS)[number], string> =
  {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted",
  };

export function BorderStyleRow({ tokenKey }: { tokenKey: keyof ThemeTokens }) {
  const { tokens, setTokens, resetColor } = useThemeStore();
  const t = useTranslations("themeEditor");
  return (
    <Row
      label={t("controls.borderStyle")}
      onReset={() => resetColor([tokenKey])}
    >
      {BORDER_STYLE_KEYS.map((k) => (
        <Chip
          key={k}
          active={tokens[tokenKey] === BORDER_STYLE_VALUES[k]}
          onClick={() =>
            setTokens({
              [tokenKey]: BORDER_STYLE_VALUES[k],
            } as Partial<ThemeTokens>)
          }
        >
          {t(`controls.${k}`)}
        </Chip>
      ))}
    </Row>
  );
}
