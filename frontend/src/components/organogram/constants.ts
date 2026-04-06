/**
 * Available ERP module codes for permission assignment.
 * Kept in sync with backend/apps/rbac/constants.py.
 */
export const MODULE_CODES = [
  "company_settings",
  "company_theme",
  "organogram",
] as const;

export const ACTION_CODES = ["read", "write", "delete", "export"] as const;

export const DEFAULT_NODE_WIDTH = 260;
export const DEFAULT_NODE_HEIGHT = 120;

/** Spacing for auto-layout when no saved positions exist. */
export const AUTO_LAYOUT_SPACING = { x: 300, y: 200 };
