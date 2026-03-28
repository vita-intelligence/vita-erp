/**
 * Form Constructor — public API.
 *
 * Two components:
 *   - FormEditor: drag-and-drop form builder (produces FormSchema JSON)
 *   - FormViewer: renders a form from a FormSchema (fillable or read-only)
 */

// Components
export { FormViewer } from "./FormViewer/FormViewer";

export {
  EXPRESSION_FUNCTIONS,
  evaluateExpression,
} from "./shared/expression-eval";
export type { FieldCategory, FieldMeta } from "./shared/field-registry";
// Shared utilities
export {
  FIELD_CATEGORIES,
  FIELD_REGISTRY,
  getFieldMeta,
  getFieldsByCategory,
} from "./shared/field-registry";
export { hasInterpolation, interpolateText } from "./shared/interpolate";
export {
  collectFieldIds,
  collectFields,
  createEmptySchema,
  createField,
  createGroup,
  duplicateElement,
  findElementById,
  generateId,
  isIdUnique,
} from "./shared/schema-utils";
export type { RegexResult } from "./shared/validation-utils";
export { buildZodSchema, validateRegex } from "./shared/validation-utils";
// Types
export type {
  ChoiceFilter,
  CompoundVisibility,
  ConfigTabProps,
  CustomConstraintRule,
  FieldAppearance,
  FieldConstraints,
  FieldElement,
  FieldRendererProps,
  FieldType,
  FormElement,
  FormSchema,
  GroupElement,
  RegexRule,
  RepeatConfig,
  SelectOption,
  VisibilityOperator,
  VisibilityRule,
} from "./types";
