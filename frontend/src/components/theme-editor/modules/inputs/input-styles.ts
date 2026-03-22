/**
 * Pure style builders for input preview — takes token values, returns CSSProperties.
 */

import type { ThemeTokens } from "@/config/themes";

export function buildWrapperBase(tokens: ThemeTokens): React.CSSProperties {
  return {
    borderTopWidth: tokens.inputBorderTop ?? "1px",
    borderRightWidth: tokens.inputBorderRight ?? "1px",
    borderBottomWidth: tokens.inputBorderBottom ?? "1px",
    borderLeftWidth: tokens.inputBorderLeft ?? "1px",
    borderStyle: (tokens.inputBorderStyle ??
      "solid") as React.CSSProperties["borderStyle"],
    borderColor: "var(--vita-neutral-300)",
    borderRadius: tokens.inputRadius ?? "0px",
    background: "var(--vita-surface)",
    boxShadow: tokens.inputShadow ?? "none",
    boxSizing: "border-box" as const,
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    paddingLeft: tokens.inputPaddingX ?? "12px",
    paddingRight: tokens.inputPaddingX ?? "12px",
    paddingTop: tokens.inputPaddingY ?? "8px",
    paddingBottom: tokens.inputPaddingY ?? "8px",
    transition: `border-color ${tokens.inputTransitionDuration ?? "150ms"} ease, outline ${tokens.inputTransitionDuration ?? "150ms"} ease`,
  };
}

export function buildWrapperStyle(
  base: React.CSSProperties,
  tokens: ThemeTokens,
  focused: boolean,
  error: boolean,
): React.CSSProperties {
  const ringW = tokens.inputFocusRingWidth ?? "2px";
  const ringO = tokens.inputFocusRingOffset ?? "0px";
  const hasRing = parseFloat(ringW) > 0;
  return {
    ...base,
    borderColor: error
      ? "var(--vita-error)"
      : focused
        ? "var(--vita-primary)"
        : "var(--vita-neutral-300)",
    ...(focused && hasRing
      ? {
          outlineStyle: "solid" as const,
          outlineWidth: ringW,
          outlineOffset: ringO,
          outlineColor: error ? "var(--vita-error)" : "var(--vita-primary)",
        }
      : {}),
  };
}

export function buildInputStyle(tokens: ThemeTokens): React.CSSProperties {
  return {
    background: "transparent",
    outline: "none",
    width: "100%",
    fontSize: tokens.inputFontSize ?? "14px",
    color: "var(--vita-text-primary)",
    textAlign: (tokens.inputTextAlign ??
      "left") as React.CSSProperties["textAlign"],
    border: "none",
    padding: 0,
  };
}

export function buildLabelStyle(tokens: ThemeTokens): React.CSSProperties {
  return {
    fontWeight: (tokens.inputLabelWeight ??
      "500") as React.CSSProperties["fontWeight"],
    fontSize: tokens.inputLabelSize ?? "12px",
    color: "var(--vita-text-secondary)",
    display: "block",
    lineHeight: 1.3,
  };
}
