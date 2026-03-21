/**
 * Human-readable metadata for the theme editor UI.
 *
 * Shown to non-technical users (manufacturing company admins) inside the
 * Brand & Theme editor panel. Descriptions should be plain business language.
 */
import type { ThemeTokens } from "./types";

// ── Brand color metadata ────────────────────────────────────────────────────

export const BRAND_COLOR_META: {
  key: keyof Pick<
    ThemeTokens,
    "primary" | "secondary" | "success" | "warning" | "error" | "info"
  >;
  lightKey: keyof ThemeTokens;
  darkKey: keyof ThemeTokens;
  label: string;
  description: string;
}[] = [
  {
    key: "primary",
    lightKey: "primaryLight",
    darkKey: "primaryDark",
    label: "Primary",
    description: "Main brand color — buttons, active states, links",
  },
  {
    key: "secondary",
    lightKey: "secondaryLight",
    darkKey: "secondaryDark",
    label: "Secondary",
    description: "Complementary brand color — highlights, badges, accents",
  },
  {
    key: "success",
    lightKey: "successLight",
    darkKey: "successDark",
    label: "Success",
    description: "Positive outcomes — completed orders, approvals",
  },
  {
    key: "warning",
    lightKey: "warningLight",
    darkKey: "warningDark",
    label: "Warning",
    description: "Needs attention — low stock, pending reviews",
  },
  {
    key: "error",
    lightKey: "errorLight",
    darkKey: "errorDark",
    label: "Error",
    description: "Critical issues — failed operations, urgent alerts",
  },
  {
    key: "info",
    lightKey: "infoLight",
    darkKey: "infoDark",
    label: "Information",
    description: "General info — tips, neutral status updates",
  },
];

// ── Surface color metadata ──────────────────────────────────────────────────

export const SURFACE_COLOR_META: {
  key: keyof Pick<ThemeTokens, "background" | "surface">;
  label: string;
  description: string;
}[] = [
  {
    key: "background",
    label: "Background",
    description: "Page background — tint to match warm or cool brand feel",
  },
  {
    key: "surface",
    label: "Surface",
    description: "Cards and panels — slightly offset from background",
  },
];
