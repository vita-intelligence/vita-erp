/**
 * Field Registry — single source of truth for all field type metadata.
 *
 * To add a new field type:
 *   1. Add an entry here with icon, i18n key, category, and defaults
 *   2. Add the type to the FieldType union in types.ts
 *   3. Add a renderer component in FormViewer/renderers/
 *
 * The registry is consumed by:
 *   - AddFieldModal (shows available types in a grid)
 *   - FieldCard (displays type icon and translated label)
 *   - FieldRenderer (routes to the correct renderer)
 */

import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  Calendar,
  CalendarClock,
  CheckSquare,
  CircleDot,
  Clock,
  ClockArrowDown,
  ClockArrowUp,
  Hash,
  Image,
  MessageSquare,
  Paperclip,
  PenTool,
  Type,
  User,
} from "lucide-react";

import type {
  FieldAppearance,
  FieldElement,
  FieldType,
  SelectOption,
} from "../types";

// ── Field Category ───────────────────────────────────────────────────────────

export type FieldCategory =
  | "input"
  | "choice"
  | "datetime"
  | "media"
  | "advanced";

/** CSS color per category for visual coding in the editor. */
export const CATEGORY_COLORS: Record<FieldCategory, string> = {
  input: "var(--vita-primary, #3b82f6)",
  choice: "#8b5cf6",
  datetime: "#10b981",
  media: "#f59e0b",
  advanced: "var(--vita-neutral-400, #9ca3af)",
};

// ── Registry Entry ───────────────────────────────────────────────────────────

export type FieldMeta = {
  /** Field type identifier */
  type: FieldType;
  /** Lucide icon component */
  icon: LucideIcon;
  /** i18n key under formConstructor.fields.{key} */
  i18nKey: string;
  /** Category for grouping in the field palette */
  category: FieldCategory;
  /** Whether this type supports select options */
  hasOptions: boolean;
  /** Whether this type supports calculate expressions */
  hasCalculate: boolean;
  /** Whether this type accepts user input (false for note, calculate) */
  isInput: boolean;
  /** Default field values when creating a new field of this type */
  defaults: Partial<FieldElement>;
  /** Available appearance modes for this field type */
  appearances: FieldAppearance[];
};

// ── Registry ─────────────────────────────────────────────────────────────────

const defaultOptions: SelectOption[] = [
  { value: "option_1", label: "Option 1" },
  { value: "option_2", label: "Option 2" },
];

export const FIELD_REGISTRY: FieldMeta[] = [
  // ── Input fields ──
  {
    type: "text",
    icon: Type,
    i18nKey: "text",
    category: "input",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default", "multiline"],
  },
  {
    type: "integer",
    icon: Hash,
    i18nKey: "integer",
    category: "input",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },
  {
    type: "decimal",
    icon: Hash,
    i18nKey: "decimal",
    category: "input",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },

  // ── Choice fields ──
  {
    type: "select_one",
    icon: CircleDot,
    i18nKey: "selectOne",
    category: "choice",
    hasOptions: true,
    hasCalculate: false,
    isInput: true,
    defaults: { options: [...defaultOptions] },
    appearances: ["default", "minimal", "compact", "likert"],
  },
  {
    type: "select_multiple",
    icon: CheckSquare,
    i18nKey: "selectMultiple",
    category: "choice",
    hasOptions: true,
    hasCalculate: false,
    isInput: true,
    defaults: { options: [...defaultOptions] },
    appearances: ["default", "minimal", "compact"],
  },

  // ── Date/time fields ──
  {
    type: "date",
    icon: Calendar,
    i18nKey: "date",
    category: "datetime",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },
  {
    type: "datetime",
    icon: CalendarClock,
    i18nKey: "datetime",
    category: "datetime",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },
  {
    type: "time",
    icon: Clock,
    i18nKey: "time",
    category: "datetime",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },

  // ── Media fields ──
  {
    type: "file",
    icon: Paperclip,
    i18nKey: "file",
    category: "media",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },
  {
    type: "image",
    icon: Image,
    i18nKey: "image",
    category: "media",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },
  {
    type: "signature",
    icon: PenTool,
    i18nKey: "signature",
    category: "media",
    hasOptions: false,
    hasCalculate: false,
    isInput: true,
    defaults: {},
    appearances: ["default"],
  },

  // ── Advanced fields ──
  {
    type: "note",
    icon: MessageSquare,
    i18nKey: "note",
    category: "advanced",
    hasOptions: false,
    hasCalculate: false,
    isInput: false,
    defaults: {},
    appearances: ["default"],
  },
  {
    type: "calculate",
    icon: Calculator,
    i18nKey: "calculate",
    category: "advanced",
    hasOptions: false,
    hasCalculate: true,
    isInput: false,
    defaults: { calculate: "" },
    appearances: ["default"],
  },

  // ── Metadata fields (auto-captured, hidden by default) ──
  {
    type: "start_timestamp",
    icon: ClockArrowUp,
    i18nKey: "startTimestamp",
    category: "advanced",
    hasOptions: false,
    hasCalculate: false,
    isInput: false,
    defaults: { hidden: true },
    appearances: ["default"],
  },
  {
    type: "end_timestamp",
    icon: ClockArrowDown,
    i18nKey: "endTimestamp",
    category: "advanced",
    hasOptions: false,
    hasCalculate: false,
    isInput: false,
    defaults: { hidden: true },
    appearances: ["default"],
  },
  {
    type: "username",
    icon: User,
    i18nKey: "username",
    category: "advanced",
    hasOptions: false,
    hasCalculate: false,
    isInput: false,
    defaults: { hidden: true },
    appearances: ["default"],
  },
];

// ── Lookup Helpers ───────────────────────────────────────────────────────────

const registryMap = new Map(FIELD_REGISTRY.map((m) => [m.type, m]));

/** Get metadata for a specific field type. Throws if type is unknown. */
export function getFieldMeta(type: FieldType): FieldMeta {
  const meta = registryMap.get(type);
  if (!meta) throw new Error(`Unknown field type: ${type}`);
  return meta;
}

/** Get all field types in a specific category. */
export function getFieldsByCategory(category: FieldCategory): FieldMeta[] {
  return FIELD_REGISTRY.filter((m) => m.category === category);
}

/** All categories in display order. */
export const FIELD_CATEGORIES: FieldCategory[] = [
  "input",
  "choice",
  "datetime",
  "media",
  "advanced",
];
