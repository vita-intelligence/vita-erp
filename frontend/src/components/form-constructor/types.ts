/**
 * Form Constructor — Type System
 *
 * Defines the JSON schema contract between FormEditor (producer) and
 * FormViewer (consumer). All types follow a discriminated union pattern
 * on the `kind` field for elements and `fieldType` for configs.
 *
 * Adding a new field type:
 *   1. Add to the FieldType union below
 *   2. Add a registry entry in shared/field-registry.ts
 *   3. Add a renderer in FormViewer/renderers/
 *   — No existing files need modification (Open/Closed Principle)
 */

// ── Schema Root ──────────────────────────────────────────────────────────────

export type FormSchema = {
  /** Schema format version for forward compatibility */
  version: 1;
  /** Human-readable form name */
  name: string;
  /** Optional form description */
  description?: string;
  /** Ordered list of top-level elements */
  elements: FormElement[];
};

// ── Elements (discriminated union on `kind`) ─────────────────────────────────

export type FormElement = FieldElement | GroupElement;

export type FieldElement = {
  kind: "field";
  /** Unique ID within the form — auto-generated, user-editable */
  id: string;
  /** Field type determines the renderer and config shape */
  type: FieldType;
  /** Question / label text */
  label: string;
  /** Help text displayed below the field */
  description?: string;
  /** Whether the field must be filled before submission */
  required: boolean;
  /** Hidden fields are part of the schema but not visible in FormViewer */
  hidden: boolean;
  /** Conditional visibility — show/hide based on another field's value */
  visibility?: VisibilityRule;
  /** Regex validation with hard (error) or soft (warning) mode */
  regex?: RegexRule;
  /** Options list — only used by select_one and select_multiple */
  options?: SelectOption[];
  /** Calculation expression — only used by calculate type */
  calculate?: string;
};

export type GroupElement = {
  kind: "group";
  /** Unique ID within the form */
  id: string;
  /** Group heading */
  label: string;
  /** Optional group description */
  description?: string;
  /** Nested elements within this group */
  elements: FormElement[];
};

// ── Field Types ──────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "integer"
  | "decimal"
  | "select_one"
  | "select_multiple"
  | "date"
  | "datetime"
  | "time"
  | "note"
  | "calculate"
  | "file"
  | "image"
  | "signature";

// ── Field Settings ───────────────────────────────────────────────────────────

export type SelectOption = {
  /** Machine-readable value */
  value: string;
  /** Human-readable display label */
  label: string;
};

export type VisibilityRule = {
  /** ID of the field whose value is checked */
  fieldId: string;
  /** Comparison operator */
  operator: VisibilityOperator;
  /** Value to compare against (unused for is_empty / is_not_empty) */
  value?: string;
};

export type VisibilityOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "is_empty"
  | "is_not_empty";

export type RegexRule = {
  /** Regular expression pattern (without delimiters) */
  pattern: string;
  /** Hard = blocks submission with error; Soft = shows warning only */
  mode: "hard" | "soft";
  /** Custom error or warning message shown to the user */
  message: string;
};

// ── Renderer Props Interface ─────────────────────────────────────────────────

/**
 * Common props passed to every field renderer.
 * Each renderer receives its field definition + react-hook-form bindings.
 */
export type FieldRendererProps = {
  field: FieldElement;
  /** Current field value from react-hook-form */
  value: unknown;
  /** react-hook-form onChange handler */
  onChange: (value: unknown) => void;
  /** react-hook-form onBlur handler */
  onBlur: () => void;
  /** Validation error message (from hard regex or required) */
  error?: string;
  /** Validation warning message (from soft regex) */
  warning?: string;
  /** Whether the form is in read-only mode */
  readOnly?: boolean;
};

/**
 * Common props for field config tabs in the editor.
 * Each tab receives the field being configured and an update callback.
 */
export type ConfigTabProps = {
  field: FieldElement;
  /** Partial update — merges with existing field */
  onUpdate: (patch: Partial<FieldElement>) => void;
  /** All elements in the form (for field references in conditions) */
  allElements: FormElement[];
};
