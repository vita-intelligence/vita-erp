/**
 * Gradient builder types and pure helpers.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type GradientType = "linear" | "radial";

export type ColorStop = {
  id: string;
  color: string;
  position: number; // 0–100
};

// ── Builders ─────────────────────────────────────────────────────────────────

function formatStops(stops: ColorStop[]): string {
  return [...stops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
}

export function buildLinearGradient(angle: number, stops: ColorStop[]): string {
  return `linear-gradient(${angle}deg, ${formatStops(stops)})`;
}

export function buildRadialGradient(stops: ColorStop[]): string {
  return `radial-gradient(circle at 50% 50%, ${formatStops(stops)})`;
}

export function buildGradient(
  type: GradientType,
  angle: number,
  stops: ColorStop[],
): string {
  return type === "linear"
    ? buildLinearGradient(angle, stops)
    : buildRadialGradient(stops);
}

// ── Factories ────────────────────────────────────────────────────────────────

export function createStop(color: string, position: number): ColorStop {
  return { id: crypto.randomUUID(), color, position };
}

export function defaultStops(isDark: boolean): ColorStop[] {
  return isDark
    ? [createStop("#1a1a2e", 0), createStop("#0f0f1a", 100)]
    : [createStop("#f8f9fa", 0), createStop("#e9ecef", 100)];
}

// ── Detection ────────────────────────────────────────────────────────────────

export function isGradient(value: string | undefined): boolean {
  return !!value && value.includes("gradient(");
}

// ── Parser ──────────────────────────────────────────────────────────────────

type ParsedGradient = {
  type: GradientType;
  angle: number;
  stops: ColorStop[];
};

/**
 * Parse a CSS gradient string back into structured data.
 * Handles both linear-gradient(Ndeg, ...) and radial-gradient(...).
 * Returns null if the string can't be parsed.
 */
export function parseGradient(css: string): ParsedGradient | null {
  if (!css || !css.includes("gradient(")) return null;

  const isLinear = css.startsWith("linear-gradient");
  const type: GradientType = isLinear ? "linear" : "radial";

  // Extract content inside gradient(...)
  const match = css.match(/gradient\((.+)\)$/s);
  if (!match) return null;
  const content = match[1];

  let angle = 135;
  let stopsStr = content;

  if (isLinear) {
    // First part before the first comma with a color is the angle
    const angleMatch = content.match(/^(\d+(?:\.\d+)?)deg\s*,\s*/);
    if (angleMatch) {
      angle = Number.parseFloat(angleMatch[1]);
      stopsStr = content.slice(angleMatch[0].length);
    }
  } else {
    // Radial: skip "circle at X% Y%," prefix
    const radialMatch = content.match(/^[^,]+,\s*/);
    if (radialMatch) {
      stopsStr = content.slice(radialMatch[0].length);
    }
  }

  // Parse color stops — split on commas that separate stops
  // Each stop is "color position%"
  const stopParts = stopsStr.split(/,\s*(?=[a-z#(])/i);
  const stops: ColorStop[] = [];

  for (const part of stopParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Extract position percentage from the end
    const posMatch = trimmed.match(/\s+(\d+(?:\.\d+)?)%$/);
    const position = posMatch
      ? Number.parseFloat(posMatch[1])
      : stops.length === 0
        ? 0
        : 100;
    const color = posMatch ? trimmed.slice(0, posMatch.index).trim() : trimmed;

    stops.push(createStop(color, Math.round(position)));
  }

  if (stops.length < 2) return null;

  return { type, angle, stops };
}
