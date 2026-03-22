/**
 * Schema Utilities — factory functions for creating form elements.
 *
 * All element creation goes through these helpers to ensure consistent
 * defaults and valid IDs. The generateId() function produces short,
 * URL-safe identifiers that are user-editable.
 */

import { nanoid } from "nanoid";

import type {
  FieldElement,
  FieldType,
  FormElement,
  FormSchema,
  GroupElement,
} from "../types";
import { getFieldMeta } from "./field-registry";

// ── ID Generation ────────────────────────────────────────────────────────────

/** Generate a short, URL-safe unique ID (8 characters). */
export function generateId(): string {
  return nanoid(8);
}

// ── Schema Factory ───────────────────────────────────────────────────────────

/** Create a blank form schema with sensible defaults. */
export function createEmptySchema(name = ""): FormSchema {
  return {
    version: 1,
    name,
    description: undefined,
    elements: [],
  };
}

// ── Field Factory ────────────────────────────────────────────────────────────

/** Create a new field element with type-specific defaults from the registry. */
export function createField(
  type: FieldType,
  label: string,
  overrides?: Partial<FieldElement>,
): FieldElement {
  const meta = getFieldMeta(type);
  return {
    kind: "field",
    id: generateId(),
    type,
    label,
    description: undefined,
    required: false,
    hidden: false,
    visibility: undefined,
    regex: undefined,
    options: undefined,
    calculate: undefined,
    ...meta.defaults,
    ...overrides,
  };
}

// ── Group Factory ────────────────────────────────────────────────────────────

/** Create a new group element. */
export function createGroup(
  label: string,
  overrides?: Partial<GroupElement>,
): GroupElement {
  return {
    kind: "group",
    id: generateId(),
    label,
    description: undefined,
    elements: [],
    ...overrides,
  };
}

// ── Element Helpers ──────────────────────────────────────────────────────────

/** Collect all field IDs in a form (recursively, including inside groups). */
export function collectFieldIds(elements: FormElement[]): Set<string> {
  const ids = new Set<string>();
  for (const el of elements) {
    ids.add(el.id);
    if (el.kind === "group") {
      for (const childId of collectFieldIds(el.elements)) {
        ids.add(childId);
      }
    }
  }
  return ids;
}

/** Check if an ID is unique within the form. */
export function isIdUnique(
  id: string,
  elements: FormElement[],
  excludeId?: string,
): boolean {
  const ids = collectFieldIds(elements);
  if (excludeId) ids.delete(excludeId);
  return !ids.has(id);
}

/** Find an element by ID (recursively searches groups). */
export function findElementById(
  elements: FormElement[],
  id: string,
): FormElement | undefined {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.kind === "group") {
      const found = findElementById(el.elements, id);
      if (found) return found;
    }
  }
  return undefined;
}

/** Collect all FieldElements (not groups) for field references in conditions. */
export function collectFields(elements: FormElement[]): FieldElement[] {
  const fields: FieldElement[] = [];
  for (const el of elements) {
    if (el.kind === "field") fields.push(el);
    else if (el.kind === "group") fields.push(...collectFields(el.elements));
  }
  return fields;
}

/**
 * Deep clone a form element with a fresh ID.
 * Used for duplicating fields/groups.
 */
export function duplicateElement<T extends FormElement>(element: T): T {
  const clone = JSON.parse(JSON.stringify(element)) as T;
  clone.id = generateId();
  if (clone.kind === "group") {
    clone.elements = clone.elements.map((child) => duplicateElement(child));
  }
  return clone;
}
