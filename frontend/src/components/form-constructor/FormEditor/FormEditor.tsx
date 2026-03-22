"use client";

/**
 * FormEditor — the main form builder component.
 *
 * Manages the form schema as local state (no Zustand — schema is passed
 * out via onChange). Provides DnD context for reordering fields,
 * SurveyCTO-style modals for adding/editing fields, and a live preview.
 *
 * Props:
 *   schema   — initial FormSchema (or undefined for blank)
 *   onChange — called with the updated schema on every change
 */

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createEmptySchema,
  createField,
  createGroup,
  duplicateElement,
  findElementById,
} from "../shared/schema-utils";
import type {
  FieldElement,
  FieldType,
  FormElement,
  FormSchema,
} from "../types";
import { AddFieldModal } from "./AddFieldModal";
import { DropZone, parseDropZoneId } from "./DropZone";
import { EditorToolbar } from "./EditorToolbar";
import { FieldCard } from "./FieldCard";
import { FieldConfigModal } from "./FieldConfigModal";
import { GroupCard } from "./GroupCard";

// ── Props ────────────────────────────────────────────────────────────────────

type FormEditorProps = {
  /** Initial schema — pass undefined to start blank */
  schema?: FormSchema;
  /** Called with updated schema on every change */
  onChange?: (schema: FormSchema) => void;
};

// ── History for undo/redo ────────────────────────────────────────────────────

type HistoryState = {
  past: FormSchema[];
  future: FormSchema[];
};

const MAX_HISTORY = 50;

// ── Component ────────────────────────────────────────────────────────────────

export function FormEditor({
  schema: initialSchema,
  onChange,
}: FormEditorProps) {
  const t = useTranslations("formConstructor");

  // ── State ──────────────────────────────────────────────────────────────────
  const [schema, setSchemaRaw] = useState<FormSchema>(
    () => initialSchema ?? createEmptySchema(),
  );
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    future: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addModalTarget, setAddModalTarget] = useState<{
    parentGroupId?: string;
    hidden?: boolean;
  }>({});
  const [configField, setConfigField] = useState<FieldElement | null>(null);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // ── Schema update with history ─────────────────────────────────────────────

  const setSchema = useCallback(
    (next: FormSchema) => {
      setSchemaRaw((prev) => {
        setHistory((h) => ({
          past: [...h.past.slice(-(MAX_HISTORY - 1)), prev],
          future: [],
        }));
        return next;
      });
      onChange?.(next);
    },
    [onChange],
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const prev = h.past[h.past.length - 1];
      setSchemaRaw((_current) => {
        onChange?.(prev);
        return prev;
      });
      return {
        past: h.past.slice(0, -1),
        future: [schema, ...h.future],
      };
    });
  }, [schema, onChange]);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const next = h.future[0];
      setSchemaRaw(() => {
        onChange?.(next);
        return next;
      });
      return {
        past: [...h.past, schema],
        future: h.future.slice(1),
      };
    });
  }, [schema, onChange]);

  // ── Element mutations ──────────────────────────────────────────────────────

  function updateElements(updater: (elements: FormElement[]) => FormElement[]) {
    setSchema({ ...schema, elements: updater(schema.elements) });
  }

  function addField(
    type: FieldType,
    label: string,
    hidden = false,
    parentGroupId?: string,
  ) {
    const field = createField(type, label, { hidden });

    if (parentGroupId) {
      updateElements((els) =>
        els.map((el) =>
          el.kind === "group" && el.id === parentGroupId
            ? { ...el, elements: [...el.elements, field] }
            : el,
        ),
      );
    } else {
      updateElements((els) => [...els, field]);
    }

    // Open config modal for the new field
    setConfigField(field);
  }

  function addGroup(label: string) {
    const group = createGroup(label);
    updateElements((els) => [...els, group]);
  }

  function removeElement(id: string) {
    updateElements((els) => removeFromList(els, id));
  }

  function duplicateEl(id: string) {
    updateElements((els) => duplicateInList(els, id));
  }

  function moveElement(id: string, direction: "up" | "down") {
    updateElements((els) => moveInList(els, id, direction));
  }

  function updateField(updated: FieldElement) {
    updateElements((els) => updateInList(els, updated));
  }

  // ── DnD ────────────────────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(_event: DragStartEvent) {
    setIsDragActive(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragActive(false);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a DropZone
    const dropZone = parseDropZoneId(overId);

    if (dropZone) {
      updateElements((els) => {
        const dragResult = findWithParent(els, activeId);
        if (!dragResult.element) return els;
        const draggedEl = dragResult.element;
        let next = removeFromAllLists(els, activeId);

        if (dropZone.container === "root") {
          next.splice(dropZone.index, 0, draggedEl);
        } else {
          next = next.map((el) => {
            if (el.kind !== "group" || el.id !== dropZone.container) return el;
            const children = [...el.elements];
            children.splice(dropZone.index, 0, draggedEl);
            return { ...el, elements: children };
          });
        }
        return next;
      });
    } else if (activeId !== overId) {
      // Simple same-level reorder
      updateElements((els) => {
        const oldIdx = els.findIndex((e) => e.id === activeId);
        const newIdx = els.findIndex((e) => e.id === overId);
        if (oldIdx !== -1 && newIdx !== -1) {
          const next = [...els];
          const [moved] = next.splice(oldIdx, 1);
          next.splice(newIdx, 0, moved);
          return next;
        }
        return els.map((el) => {
          if (el.kind !== "group") return el;
          const oI = el.elements.findIndex((c) => c.id === activeId);
          const nI = el.elements.findIndex((c) => c.id === overId);
          if (oI === -1 || nI === -1) return el;
          const children = [...el.elements];
          const [moved] = children.splice(oI, 1);
          children.splice(nI, 0, moved);
          return { ...el, elements: children };
        });
      });
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  // Collect ALL IDs (root + children inside groups) for cross-container DnD
  const elementIds: string[] = [];
  for (const el of schema.elements) {
    elementIds.push(el.id);
    if (el.kind === "group") {
      for (const child of el.elements) {
        elementIds.push(child.id);
      }
    }
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-vita-xl p-6"
      style={{
        background: "var(--vita-surface)",
        border: "1px solid var(--vita-neutral-200)",
      }}
    >
      {/* Toolbar */}
      <EditorToolbar
        schema={schema}
        showPreview={showPreview}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        onNameChange={(name) => setSchema({ ...schema, name })}
        onTogglePreview={() => setShowPreview((p) => !p)}
        onUndo={undo}
        onRedo={redo}
        onImport={(imported) => setSchema(imported)}
      />

      {/* Canvas */}
      {!showPreview ? (
        <div className="space-y-2">
          {schema.elements.length === 0 ? (
            <div
              className="flex items-center justify-center rounded-vita-lg border-2 border-dashed py-12"
              style={{
                borderColor: "var(--vita-neutral-300)",
                color: "var(--vita-text-muted)",
              }}
            >
              <p className="text-sm">{t("editor.addFirstField")}</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={elementIds}
                strategy={verticalListSortingStrategy}
              >
                {/* Drop zone before first element */}
                <DropZone id="drop:root:0" isDragActive={isDragActive} />

                {schema.elements.map((element, index) => (
                  <div key={element.id}>
                    {element.kind === "field" ? (
                      <FieldCard
                        field={element}
                        index={index}
                        total={schema.elements.length}
                        onEdit={() => setConfigField(element)}
                        onDuplicate={() => duplicateEl(element.id)}
                        onDelete={() => removeElement(element.id)}
                        onMove={(dir) => moveElement(element.id, dir)}
                      />
                    ) : (
                      <GroupCard
                        group={element}
                        index={index}
                        total={schema.elements.length}
                        allElements={schema.elements}
                        isDragActive={isDragActive}
                        onEdit={(field) => setConfigField(field)}
                        onDelete={() => removeElement(element.id)}
                        onMove={(dir) => moveElement(element.id, dir)}
                        onAddField={() => {
                          setAddModalTarget({ parentGroupId: element.id });
                          setAddModalOpen(true);
                        }}
                        onRemoveChild={(childId) =>
                          updateElements((els) =>
                            els.map((el) =>
                              el.kind === "group" && el.id === element.id
                                ? {
                                    ...el,
                                    elements: el.elements.filter(
                                      (c) => c.id !== childId,
                                    ),
                                  }
                                : el,
                            ),
                          )
                        }
                        onDuplicateChild={(childId) =>
                          updateElements((els) =>
                            els.map((el) =>
                              el.kind === "group" && el.id === element.id
                                ? {
                                    ...el,
                                    elements: duplicateInList(
                                      el.elements,
                                      childId,
                                    ),
                                  }
                                : el,
                            ),
                          )
                        }
                        onMoveChild={(childId, dir) =>
                          updateElements((els) =>
                            els.map((el) =>
                              el.kind === "group" && el.id === element.id
                                ? {
                                    ...el,
                                    elements: moveInList(
                                      el.elements,
                                      childId,
                                      dir,
                                    ),
                                  }
                                : el,
                            ),
                          )
                        }
                      />
                    )}
                    {/* Drop zone after each element */}
                    <DropZone
                      id={`drop:root:${index + 1}`}
                      isDragActive={isDragActive}
                    />
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          )}

          {/* Bottom action bar — SurveyCTO-style */}
          <div
            className="flex items-center gap-2 rounded-vita-lg border px-4 py-2.5"
            style={{
              borderColor: "var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-xs font-medium"
              style={{ color: "var(--vita-primary)" }}
              onPress={() => {
                setAddModalTarget({});
                setAddModalOpen(true);
              }}
            >
              + {t("editor.addVisibleField")}
            </Button>
            <span style={{ color: "var(--vita-neutral-300)" }}>|</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs font-medium"
              style={{ color: "var(--vita-primary)" }}
              onPress={() => setAddGroupModalOpen(true)}
            >
              {t("editor.addGroup")}
            </Button>
            <span style={{ color: "var(--vita-neutral-300)" }}>|</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs font-medium"
              style={{ color: "var(--vita-primary)" }}
              onPress={() => {
                setAddModalTarget({ hidden: true });
                setAddModalOpen(true);
              }}
            >
              + {t("editor.addHiddenField")}
            </Button>
          </div>
        </div>
      ) : (
        /* Preview pane — placeholder, FormViewer will be added in Phase 4 */
        <div
          className="flex items-center justify-center rounded-vita-lg border py-20"
          style={{
            borderColor: "var(--vita-neutral-200)",
            color: "var(--vita-text-muted)",
          }}
        >
          <p className="text-sm">{t("editor.preview")}</p>
        </div>
      )}

      {/* Add field modal */}
      <AddFieldModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={(type, label) => {
          addField(
            type,
            label,
            addModalTarget.hidden,
            addModalTarget.parentGroupId,
          );
          setAddModalOpen(false);
        }}
      />

      {/* Add group modal — simple inline prompt */}
      {addGroupModalOpen && (
        <AddGroupInlineModal
          onClose={() => setAddGroupModalOpen(false)}
          onAdd={(label) => {
            addGroup(label);
            setAddGroupModalOpen(false);
          }}
        />
      )}

      {/* Field config modal */}
      {configField && (
        <FieldConfigModal
          field={configField}
          allElements={schema.elements}
          onSave={(updated) => {
            updateField(updated);
            setConfigField(null);
          }}
          onClose={() => setConfigField(null)}
        />
      )}
    </div>
  );
}

// ── Add Group Inline Modal ───────────────────────────────────────────────────

function AddGroupInlineModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (label: string) => void;
}) {
  const t = useTranslations("formConstructor");
  const [label, setLabel] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.4)" }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: modal content */}
      <div
        role="dialog"
        className="rounded-vita-xl p-6 shadow-lg"
        style={{
          background: "var(--vita-surface)",
          border: "1px solid var(--vita-neutral-200)",
          width: "min(420px, 90vw)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--vita-text-primary)" }}
        >
          {t("addGroupModal.labelPrompt")}
        </p>
        <Input
          className="mb-4"
          placeholder={t("addGroupModal.labelPlaceholder")}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && label.trim()) onAdd(label.trim());
          }}
        />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onPress={onClose}>
            {t("addGroupModal.cancel")}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onPress={() => label.trim() && onAdd(label.trim())}
            isDisabled={!label.trim()}
          >
            {t("addGroupModal.create")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── List Helpers (pure, no side effects) ─────────────────────────────────────

function removeFromList(elements: FormElement[], id: string): FormElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) =>
      el.kind === "group"
        ? { ...el, elements: removeFromList(el.elements, id) }
        : el,
    );
}

function duplicateInList(elements: FormElement[], id: string): FormElement[] {
  const result: FormElement[] = [];
  for (const el of elements) {
    result.push(el);
    if (el.id === id) {
      result.push(duplicateElement(el));
    } else if (el.kind === "group") {
      // Check children
      const idx = el.elements.findIndex((c) => c.id === id);
      if (idx !== -1) {
        const newChildren = [...el.elements];
        newChildren.splice(idx + 1, 0, duplicateElement(el.elements[idx]));
        result[result.length - 1] = { ...el, elements: newChildren };
      }
    }
  }
  return result;
}

function moveInList(
  elements: FormElement[],
  id: string,
  direction: "up" | "down",
): FormElement[] {
  const idx = elements.findIndex((e) => e.id === id);
  if (idx === -1) {
    // Try inside groups
    return elements.map((el) =>
      el.kind === "group"
        ? { ...el, elements: moveInList(el.elements, id, direction) }
        : el,
    );
  }
  const newIdx = direction === "up" ? idx - 1 : idx + 1;
  if (newIdx < 0 || newIdx >= elements.length) return elements;
  const next = [...elements];
  [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
  return next;
}

function updateInList(
  elements: FormElement[],
  updated: FieldElement,
): FormElement[] {
  return elements.map((el) => {
    if (el.kind === "field" && el.id === updated.id) return updated;
    if (el.kind === "group") {
      return { ...el, elements: updateInList(el.elements, updated) };
    }
    return el;
  });
}

/** Find an element and which group (if any) it belongs to. */
function findWithParent(
  elements: FormElement[],
  id: string,
): { element: FormElement | null; parentId: string | null } {
  for (const el of elements) {
    if (el.id === id) return { element: el, parentId: null };
    if (el.kind === "group") {
      for (const child of el.elements) {
        if (child.id === id) return { element: child, parentId: el.id };
      }
    }
  }
  return { element: null, parentId: null };
}

/** Remove an element from all levels (root + inside groups). */
function removeFromAllLists(
  elements: FormElement[],
  id: string,
): FormElement[] {
  return elements
    .filter((el) => el.id !== id)
    .map((el) =>
      el.kind === "group"
        ? { ...el, elements: el.elements.filter((c) => c.id !== id) }
        : el,
    );
}
