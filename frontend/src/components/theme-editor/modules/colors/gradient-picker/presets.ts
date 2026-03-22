/**
 * Preset gradients for background and surface tokens.
 * Each preset is a full CSS `background` value.
 */

export type GradientPreset = {
  label: string;
  value: string;
  /** Small swatch CSS for the preset button. */
  swatch: string;
};

export const GRADIENT_PRESETS: GradientPreset[] = [
  // ── Warm ──
  {
    label: "Warm Cream",
    value:
      "linear-gradient(135deg, oklch(0.98 0.01 80) 0%, oklch(0.95 0.02 60) 100%)",
    swatch: "linear-gradient(135deg, oklch(0.98 0.01 80), oklch(0.95 0.02 60))",
  },
  {
    label: "Peach Glow",
    value:
      "linear-gradient(160deg, oklch(0.97 0.02 50) 0%, oklch(0.94 0.04 30) 100%)",
    swatch: "linear-gradient(160deg, oklch(0.97 0.02 50), oklch(0.94 0.04 30))",
  },
  {
    label: "Sunset Blush",
    value:
      "linear-gradient(135deg, oklch(0.96 0.03 15) 0%, oklch(0.93 0.05 45) 50%, oklch(0.97 0.02 70) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.96 0.03 15), oklch(0.93 0.05 45), oklch(0.97 0.02 70))",
  },
  // ── Cool ──
  {
    label: "Cool Mist",
    value:
      "linear-gradient(135deg, oklch(0.98 0.01 240) 0%, oklch(0.95 0.02 220) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.98 0.01 240), oklch(0.95 0.02 220))",
  },
  {
    label: "Arctic Haze",
    value:
      "linear-gradient(180deg, oklch(0.97 0.015 210) 0%, oklch(0.94 0.03 230) 100%)",
    swatch:
      "linear-gradient(180deg, oklch(0.97 0.015 210), oklch(0.94 0.03 230))",
  },
  {
    label: "Lavender Drift",
    value:
      "linear-gradient(135deg, oklch(0.97 0.02 290) 0%, oklch(0.94 0.04 270) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.97 0.02 290), oklch(0.94 0.04 270))",
  },
  // ── Nature ──
  {
    label: "Mint Fresh",
    value:
      "linear-gradient(160deg, oklch(0.97 0.02 160) 0%, oklch(0.94 0.03 145) 100%)",
    swatch:
      "linear-gradient(160deg, oklch(0.97 0.02 160), oklch(0.94 0.03 145))",
  },
  {
    label: "Forest Dew",
    value:
      "linear-gradient(135deg, oklch(0.96 0.02 140) 0%, oklch(0.93 0.03 170) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.96 0.02 140), oklch(0.93 0.03 170))",
  },
  // ── Radial ──
  {
    label: "Spotlight",
    value:
      "radial-gradient(ellipse at 50% 0%, oklch(0.99 0.01 60) 0%, oklch(0.95 0 0) 70%)",
    swatch: "radial-gradient(circle, oklch(0.99 0.01 60), oklch(0.95 0 0))",
  },
  {
    label: "Glow Center",
    value:
      "radial-gradient(circle at 50% 50%, oklch(0.98 0.02 250) 0%, oklch(0.94 0.01 240) 70%)",
    swatch:
      "radial-gradient(circle, oklch(0.98 0.02 250), oklch(0.94 0.01 240))",
  },
  {
    label: "Corner Light",
    value:
      "radial-gradient(ellipse at 0% 0%, oklch(0.99 0.015 45) 0%, oklch(0.95 0 0) 60%)",
    swatch:
      "radial-gradient(ellipse at 0% 0%, oklch(0.99 0.015 45), oklch(0.95 0 0))",
  },
  // ── Multi-stop ──
  {
    label: "Aurora",
    value:
      "linear-gradient(135deg, oklch(0.96 0.03 180) 0%, oklch(0.94 0.04 260) 50%, oklch(0.96 0.03 310) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.96 0.03 180), oklch(0.94 0.04 260), oklch(0.96 0.03 310))",
  },
  {
    label: "Horizon",
    value:
      "linear-gradient(180deg, oklch(0.97 0.02 220) 0%, oklch(0.96 0.01 200) 40%, oklch(0.98 0.015 50) 100%)",
    swatch:
      "linear-gradient(180deg, oklch(0.97 0.02 220), oklch(0.96 0.01 200), oklch(0.98 0.015 50))",
  },
  {
    label: "Prism",
    value:
      "linear-gradient(135deg, oklch(0.96 0.03 0) 0%, oklch(0.95 0.03 90) 33%, oklch(0.95 0.03 200) 66%, oklch(0.96 0.03 280) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.96 0.03 0), oklch(0.95 0.03 90), oklch(0.95 0.03 200), oklch(0.96 0.03 280))",
  },
];

/** Dark mode variants — deeper, more saturated */
export const DARK_GRADIENT_PRESETS: GradientPreset[] = [
  {
    label: "Deep Ember",
    value:
      "linear-gradient(135deg, oklch(0.12 0.02 30) 0%, oklch(0.09 0.01 50) 100%)",
    swatch: "linear-gradient(135deg, oklch(0.12 0.02 30), oklch(0.09 0.01 50))",
  },
  {
    label: "Midnight Blue",
    value:
      "linear-gradient(135deg, oklch(0.12 0.03 250) 0%, oklch(0.08 0.02 230) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.12 0.03 250), oklch(0.08 0.02 230))",
  },
  {
    label: "Dark Aurora",
    value:
      "linear-gradient(135deg, oklch(0.11 0.03 180) 0%, oklch(0.09 0.04 260) 50%, oklch(0.11 0.03 310) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.11 0.03 180), oklch(0.09 0.04 260), oklch(0.11 0.03 310))",
  },
  {
    label: "Deep Forest",
    value:
      "linear-gradient(160deg, oklch(0.11 0.02 150) 0%, oklch(0.08 0.03 170) 100%)",
    swatch:
      "linear-gradient(160deg, oklch(0.11 0.02 150), oklch(0.08 0.03 170))",
  },
  {
    label: "Obsidian",
    value:
      "radial-gradient(ellipse at 50% 0%, oklch(0.15 0.01 260) 0%, oklch(0.07 0 0) 70%)",
    swatch: "radial-gradient(circle, oklch(0.15 0.01 260), oklch(0.07 0 0))",
  },
  {
    label: "Charcoal Glow",
    value:
      "radial-gradient(circle at 50% 50%, oklch(0.16 0.02 45) 0%, oklch(0.08 0.01 40) 70%)",
    swatch: "radial-gradient(circle, oklch(0.16 0.02 45), oklch(0.08 0.01 40))",
  },
  {
    label: "Night Prism",
    value:
      "linear-gradient(135deg, oklch(0.11 0.03 0) 0%, oklch(0.10 0.03 120) 50%, oklch(0.11 0.03 240) 100%)",
    swatch:
      "linear-gradient(135deg, oklch(0.11 0.03 0), oklch(0.10 0.03 120), oklch(0.11 0.03 240))",
  },
];
