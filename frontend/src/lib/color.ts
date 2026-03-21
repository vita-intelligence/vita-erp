/**
 * Resolves any valid CSS color string (hex, oklch, rgb, hsl, color-mix, etc.)
 * to a #rrggbb hex string that <input type="color"> can display.
 *
 * Uses a 1×1 canvas pixel — the browser's rasterizer converts any CSS color
 * to raw RGB bytes, which is more reliable than getComputedStyle (which can
 * return oklch as-is in Chrome 111+ / Safari 16.2+ instead of rgb()).
 *
 * Returns "#000000" as a fallback for SSR or invalid values.
 */
export function cssColorToHex(color: string): string {
  if (typeof window === "undefined") return "#000000";

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "#000000";

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
