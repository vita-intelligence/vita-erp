"use client";

/**
 * OnboardingForm — wraps the existing FormViewer with file-upload
 * extraction and a multipart submit.
 *
 * Why a wrapper?
 *
 * 1. **File extraction**: `FileRenderer` keeps `File` objects in the
 *    react-hook-form state. This wrapper walks the schema, pulls
 *    every file out into a separate `files` dict, and submits one
 *    multipart request. Files that the user selected but never
 *    submitted (closed the tab, refreshed) never reach the network.
 *
 * 2. **Pre-population**: when the user has existing responses (the
 *    re-onboarding case), this wrapper feeds them into the
 *    FormViewer's `defaultValue` per field so the user sees their
 *    previous answers and only has to touch new/changed required
 *    fields.
 *
 * Both backend and frontend key responses by element `id` (the
 * form constructor's canonical identifier). The admin sets `id` to
 * a human-readable string like `"first_name"` for queryable dataset
 * semantics — there is no separate `name` field on FieldElement.
 */

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { FormViewer } from "@/components/form-constructor/FormViewer/FormViewer";
import type {
  FieldElement,
  FormElement,
  FormSchema,
  GroupElement,
} from "@/components/form-constructor/types";
import { isMediaReference, useSubmitOnboarding } from "@/lib/accounts";

interface OnboardingFormProps {
  schema: FormSchema;
  /** Existing responses keyed by field id. */
  initialResponses: Record<string, unknown>;
  /** Called after a successful submission so the parent can drop blockers. */
  onSubmitted?: () => void;
}

export default function OnboardingForm({
  schema,
  initialResponses,
  onSubmitted,
}: OnboardingFormProps) {
  const t = useTranslations("accounts");
  const submit = useSubmitOnboarding();
  const [serverError, setServerError] = useState<string | null>(null);

  // Pre-populate the schema's element-level `defaultValue` with the
  // user's existing responses so FormViewer's defaults builder picks
  // them up. Media references are intentionally skipped — FileRenderer
  // can't pre-fill itself with an existing asset URL, so the user
  // sees an empty dropzone and the wrapper's submit logic preserves
  // the old reference if no new file is chosen.
  const populatedSchema = useMemo(
    () => attachDefaults(schema, initialResponses),
    [schema, initialResponses],
  );

  // Lookup of field id → meta so the submit handler can detect file
  // fields without re-walking the tree.
  const fieldsById = useMemo(
    () => buildFieldIndex(populatedSchema),
    [populatedSchema],
  );

  const handleFormSubmit = async (formState: Record<string, unknown>) => {
    setServerError(null);
    const responses: Record<string, unknown> = {};
    const files: Record<string, File> = {};

    for (const [fieldId, value] of Object.entries(formState)) {
      const field = fieldsById.get(fieldId);
      if (!field) continue;

      // File / image fields: extract File objects into the `files`
      // bucket so they ride the multipart body.
      if (value instanceof File) {
        files[fieldId] = value;
        continue;
      }
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        value[0] instanceof File
      ) {
        files[fieldId] = value[0] as File;
        continue;
      }

      // For empty file fields, preserve any existing media reference
      // so the user doesn't lose their old photo by submitting without
      // touching the field.
      const isFileField = ["file", "image", "signature"].includes(field.type);
      if (
        isFileField &&
        (value === undefined || value === null || value === "")
      ) {
        const existing = initialResponses[fieldId];
        if (isMediaReference(existing)) {
          responses[fieldId] = existing;
          continue;
        }
      }

      responses[fieldId] = value;
    }

    try {
      await submit.mutateAsync({ responses, files });
      onSubmitted?.();
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "submission_failed";
      setServerError(t(`errors.${detail}`));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormViewer schema={populatedSchema} onSubmit={handleFormSubmit} />

      {serverError && (
        <p
          className="text-sm font-medium"
          style={{ color: "var(--vita-error)" }}
        >
          {serverError}
        </p>
      )}

      {submit.isPending && (
        <div className="flex items-center justify-center gap-2 text-sm text-vita-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("onboarding.submitting")}
        </div>
      )}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildFieldIndex(schema: FormSchema): Map<string, FieldElement> {
  const map = new Map<string, FieldElement>();
  walkElements(schema.elements, (el) => {
    if (el.kind === "field") {
      map.set(el.id, el);
    }
  });
  return map;
}

function attachDefaults(
  schema: FormSchema,
  responsesById: Record<string, unknown>,
): FormSchema {
  if (!responsesById || Object.keys(responsesById).length === 0) {
    return schema;
  }
  return {
    ...schema,
    elements: schema.elements.map((el) =>
      mapElementWithDefaults(el, responsesById),
    ),
  };
}

function mapElementWithDefaults(
  element: FormElement,
  responsesById: Record<string, unknown>,
): FormElement {
  if (element.kind === "field") {
    return mapFieldWithDefault(element, responsesById);
  }
  return mapGroupWithDefaults(element, responsesById);
}

function mapFieldWithDefault(
  field: FieldElement,
  responsesById: Record<string, unknown>,
): FieldElement {
  const stored = responsesById[field.id];
  if (stored === undefined) return field;

  // Skip media references — the FileRenderer expects File or empty.
  if (isMediaReference(stored)) {
    return field;
  }

  // FieldElement.defaultValue only supports string | number.
  if (typeof stored !== "string" && typeof stored !== "number") {
    return field;
  }

  return {
    ...field,
    defaultValue: stored,
  };
}

function mapGroupWithDefaults(
  group: GroupElement,
  responsesById: Record<string, unknown>,
): GroupElement {
  return {
    ...group,
    elements: group.elements.map((child) => {
      if (child.kind === "field") {
        return mapFieldWithDefault(child, responsesById);
      }
      return child;
    }),
  };
}

function walkElements(
  elements: FormElement[],
  visit: (el: FormElement) => void,
): void {
  for (const el of elements) {
    visit(el);
    if (el.kind === "group") {
      walkElements(el.elements, visit);
    }
  }
}
