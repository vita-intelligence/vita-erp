/**
 * Builds inline styles for input elements, merging per-field styling
 * overrides with error state.
 */

import type { FieldStyling } from "../../types";

export function buildInputStyle(
  styling?: FieldStyling,
  error?: string,
): React.CSSProperties | undefined {
  const s = styling;
  const hasOverrides =
    s?.inputBgColor || s?.inputTextColor || s?.inputBorderColor || error;

  if (!hasOverrides) return undefined;

  return {
    ...(s?.inputBgColor ? { background: s.inputBgColor } : {}),
    ...(s?.inputTextColor ? { color: s.inputTextColor } : {}),
    borderColor: error ? "var(--vita-error)" : s?.inputBorderColor || undefined,
  };
}
