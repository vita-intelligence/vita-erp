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

export function isGradient(value: string): boolean {
  return value.includes("gradient(");
}
