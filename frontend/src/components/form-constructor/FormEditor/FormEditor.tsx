"use client";

/**
 * FormEditor — the main form builder component.
 *
 * Manages the form schema as local state (no Zustand — schema is passed
 * out via onChange). Provides DnD context for reordering fields,
 * modals for adding/editing fields, and a live preview.
 *
 * Props:
 *   schema   — initial FormSchema (or undefined for blank)
 *   onChange — called with the updated schema on every change
 */

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormViewer } from "../FormViewer/FormViewer";
import {
  collectFields,
  createEmptySchema,
  createField,
  createGroup,
  duplicateElement,
} from "../shared/schema-utils";
import type {
  FieldElement,
  FieldType,
  FormElement,
  FormSchema,
  GroupElement,
  RepeatConfig,
} from "../types";
import { AddFieldModal } from "./AddFieldModal";
import { DropZone, parseDropZoneId } from "./DropZone";
import { EditorToolbar } from "./EditorToolbar";
import { FieldCard } from "./FieldCard";
import { FieldConfigModal } from "./FieldConfigModal";
import { FormSettingsModal } from "./FormSettingsModal";
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
  const [configGroup, setConfigGroup] = useState<GroupElement | null>(null);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  /** ID of the element that was just dropped — triggers highlight animation */
  const [justDroppedId, setJustDroppedId] = useState<string | null>(null);

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

    // Highlight and scroll to the new field
    setJustDroppedId(field.id);
    setTimeout(() => {
      document
        .querySelector(`[data-element-id="${field.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    setTimeout(() => setJustDroppedId(null), 1500);
  }

  function addGroup(label: string, repeat?: RepeatConfig) {
    const group = createGroup(label, repeat?.enabled ? { repeat } : undefined);
    updateElements((els) => [...els, group]);

    // Highlight and scroll to the new group
    setJustDroppedId(group.id);
    setTimeout(() => {
      document
        .querySelector(`[data-element-id="${group.id}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    setTimeout(() => setJustDroppedId(null), 1500);
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

  function updateGroup(updated: GroupElement) {
    updateElements((els) =>
      els.map((el) =>
        el.kind === "group" && el.id === updated.id ? updated : el,
      ),
    );
  }

  // ── DnD ────────────────────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    setIsDragActive(true);
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragActive(false);
    setActiveDragId(null);
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

        // Find the source position BEFORE removal
        const sourceContainer = dragResult.parentId ?? "root";
        let sourceIndex = -1;
        if (sourceContainer === "root") {
          sourceIndex = els.findIndex((e) => e.id === activeId);
        } else {
          const group = els.find(
            (e) => e.kind === "group" && e.id === sourceContainer,
          );
          if (group?.kind === "group") {
            sourceIndex = group.elements.findIndex((e) => e.id === activeId);
          }
        }

        let next = removeFromAllLists(els, activeId);

        // Adjust target index: if the element was removed from the same
        // container BEFORE the target position, indices shift down by 1
        let targetIndex = dropZone.index;
        if (
          sourceContainer === dropZone.container &&
          sourceIndex !== -1 &&
          sourceIndex < targetIndex
        ) {
          targetIndex--;
        }

        if (dropZone.container === "root") {
          next.splice(targetIndex, 0, draggedEl);
        } else {
          next = next.map((el) => {
            if (el.kind !== "group" || el.id !== dropZone.container) return el;
            const children = [...el.elements];
            children.splice(targetIndex, 0, draggedEl);
            return { ...el, elements: children };
          });
        }
        return next;
      });

      // Highlight the just-dropped element briefly
      setJustDroppedId(activeId);
      setTimeout(() => setJustDroppedId(null), 1200);
    }
  }

  // ── Drag source position (hide adjacent drop zones) ────────────────────
  const dragSourceRootIndex = activeDragId
    ? schema.elements.findIndex((e) => e.id === activeDragId)
    : -1;
  let _dragSourceGroupId: string | null = null;
  let _dragSourceChildIndex = -1;
  if (activeDragId && dragSourceRootIndex === -1) {
    for (const el of schema.elements) {
      if (el.kind === "group") {
        const ci = el.elements.findIndex((c) => c.id === activeDragId);
        if (ci !== -1) {
          _dragSourceGroupId = el.id;
          _dragSourceChildIndex = ci;
          break;
        }
      }
    }
  }

  function isRootZoneHidden(zoneIndex: number): boolean {
    if (dragSourceRootIndex === -1) return false;
    return (
      zoneIndex === dragSourceRootIndex || zoneIndex === dragSourceRootIndex + 1
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Canvas */}
      {!showPreview ? (
        <div className="space-y-2">
          {schema.elements.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 rounded-vita-lg border-2 border-dashed py-16"
              style={{
                borderColor: "var(--vita-neutral-300)",
                color: "var(--vita-text-muted)",
                background: "var(--vita-background)",
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background:
                    "color-mix(in oklch, var(--vita-primary) 10%, transparent)",
                  color: "var(--vita-primary)",
                }}
              >
                <Plus size={24} />
              </div>
              <p className="text-sm font-medium">{t("editor.addFirstField")}</p>
              <p
                className="max-w-xs text-center text-xs"
                style={{ color: "var(--vita-neutral-400)" }}
              >
                {t("editor.emptyHint")}
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {/* Drop zone before first element */}
              <DropZone
                id="drop:root:0"
                isDragActive={isDragActive}
                hidden={isRootZoneHidden(0)}
              />

              {schema.elements.map((element, index) => (
                <div key={element.id}>
                  {element.kind === "field" ? (
                    <FieldCard
                      field={element}
                      index={index}
                      total={schema.elements.length}
                      isDragActive={isDragActive}
                      isJustDropped={justDroppedId === element.id}
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
                      activeDragId={activeDragId}
                      justDroppedId={justDroppedId}
                      onEdit={(field) => setConfigField(field)}
                      onEditGroup={() => setConfigGroup(element)}
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
                    hidden={isRootZoneHidden(index + 1)}
                    isLast={index === schema.elements.length - 1}
                  />
                </div>
              ))}
              {/* Drag overlay — floating preview that stays on top */}
              <DragOverlay dropAnimation={null}>
                {activeDragId ? (
                  <DragOverlayContent
                    elementId={activeDragId}
                    elements={schema.elements}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      ) : (
        /* Live preview — renders the form as users will see it */
        <FormViewer schema={schema} />
      )}

      {/* Sticky action bar — always visible at bottom when in editor mode */}
      {!showPreview && (
        <div
          className="sticky bottom-0 z-10 flex items-center gap-2 rounded-vita-lg border px-4 py-2.5"
          style={{
            borderColor: "var(--vita-neutral-200)",
            background: "var(--vita-surface)",
            boxShadow: "0 -4px 12px oklch(0 0 0 / 0.05)",
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
          schema={schema}
          onClose={() => setAddGroupModalOpen(false)}
          onAdd={(label, repeat) => {
            addGroup(label, repeat);
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

      {/* Group config modal */}
      {configGroup && (
        <GroupConfigModal
          group={configGroup}
          schema={schema}
          onSave={(updated) => {
            updateGroup(updated);
            setConfigGroup(null);
          }}
          onClose={() => setConfigGroup(null)}
        />
      )}

      {/* Form settings modal */}
      {settingsOpen && (
        <FormSettingsModal
          settings={schema.settings ?? { layout: "single-page" }}
          onSave={(settings) => {
            setSchema({ ...schema, settings });
            setSettingsOpen(false);
          }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

// ── Group Config Modal ──────────────────────────────────────────────────────

function GroupConfigModal({
  group,
  schema,
  onSave,
  onClose,
}: {
  group: GroupElement;
  schema: FormSchema;
  onSave: (updated: GroupElement) => void;
  onClose: () => void;
}) {
  const t = useTranslations("formConstructor");
  const [label, setLabel] = useState(group.label);
  const [description, setDescription] = useState(group.description ?? "");
  const [repeatEnabled, setRepeatEnabled] = useState(
    group.repeat?.enabled ?? false,
  );
  const [repeatMode, setRepeatMode] = useState<"open" | "fixed">(
    group.repeat?.countFieldId ? "fixed" : "open",
  );
  const [countFieldId, setCountFieldId] = useState(
    group.repeat?.countFieldId ?? "",
  );
  const [minInstances, setMinInstances] = useState(
    String(group.repeat?.min ?? 1),
  );
  const [maxInstances, setMaxInstances] = useState(
    group.repeat?.max ? String(group.repeat.max) : "",
  );

  const integerFields = collectFields(schema.elements).filter(
    (f) => f.type === "integer" && !f.hidden,
  );

  function handleSave() {
    const repeat: RepeatConfig | undefined = repeatEnabled
      ? {
          enabled: true,
          countFieldId:
            repeatMode === "fixed" && countFieldId ? countFieldId : undefined,
          min: Number.parseInt(minInstances, 10) || 1,
          max: maxInstances
            ? Number.parseInt(maxInstances, 10) || undefined
            : undefined,
        }
      : undefined;

    onSave({
      ...group,
      label: label.trim() || group.label,
      description: description.trim() || undefined,
      repeat,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.4)" }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: modal content */}
      <div
        role="dialog"
        className="flex flex-col rounded-vita-xl shadow-lg"
        style={{
          background: "var(--vita-surface)",
          border: "1px solid var(--vita-neutral-200)",
          width: "min(480px, 90vw)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="shrink-0 border-b px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {t("config.title")}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          {/* Label */}
          <div>
            <p
              className="mb-1 text-xs font-medium"
              style={{ color: "var(--vita-text-secondary)" }}
            >
              {t("config.general.label")}
            </p>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t("addGroupModal.labelPlaceholder")}
            />
          </div>

          {/* Description */}
          <div>
            <p
              className="mb-1 text-xs font-medium"
              style={{ color: "var(--vita-text-secondary)" }}
            >
              {t("config.general.description")}
            </p>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("config.general.descriptionPlaceholder")}
            />
          </div>

          {/* Repeat config */}
          <div
            className="flex flex-col gap-3 rounded-vita-lg p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={repeatEnabled}
                onChange={(e) => setRepeatEnabled(e.target.checked)}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--vita-text-primary)" }}
              >
                {t("addGroupModal.repeatToggle")}
              </span>
            </label>

            {repeatEnabled && (
              <div className="flex flex-col gap-3 pt-1">
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="editRepeatMode"
                      checked={repeatMode === "open"}
                      onChange={() => setRepeatMode("open")}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--vita-text-primary)" }}
                    >
                      {t("addGroupModal.repeatOpenEnded")}
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="editRepeatMode"
                      checked={repeatMode === "fixed"}
                      onChange={() => setRepeatMode("fixed")}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--vita-text-primary)" }}
                    >
                      {t("addGroupModal.repeatFixedCount")}
                    </span>
                  </label>
                </div>

                {repeatMode === "fixed" ? (
                  <div>
                    <p
                      className="mb-1 text-xs"
                      style={{ color: "var(--vita-text-muted)" }}
                    >
                      {t("addGroupModal.repeatCountField")}
                    </p>
                    <select
                      className="w-full rounded-vita-md border px-2 py-1.5 text-xs"
                      style={{
                        borderColor: "var(--vita-neutral-200)",
                        background: "var(--vita-surface)",
                        color: "var(--vita-text-primary)",
                      }}
                      value={countFieldId}
                      onChange={(e) => setCountFieldId(e.target.value)}
                    >
                      <option value="">
                        {t("addGroupModal.repeatCountFieldPlaceholder")}
                      </option>
                      {integerFields.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label} ({f.id})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p
                        className="mb-1 text-xs"
                        style={{ color: "var(--vita-text-muted)" }}
                      >
                        {t("addGroupModal.repeatMin")}
                      </p>
                      <Input
                        type="number"
                        min={0}
                        value={minInstances}
                        onChange={(e) => setMinInstances(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="mb-1 text-xs"
                        style={{ color: "var(--vita-text-muted)" }}
                      >
                        {t("addGroupModal.repeatMax")}
                      </p>
                      <Input
                        type="number"
                        min={0}
                        placeholder={t("addGroupModal.repeatMaxPlaceholder")}
                        value={maxInstances}
                        onChange={(e) => setMaxInstances(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer — always visible */}
        <div
          className="flex shrink-0 justify-end gap-2 border-t px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <Button size="sm" variant="outline" onPress={onClose}>
            {t("config.cancel")}
          </Button>
          <Button size="sm" variant="primary" onPress={handleSave}>
            {t("config.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Add Group Inline Modal ───────────────────────────────────────────────────

function AddGroupInlineModal({
  schema,
  onClose,
  onAdd,
}: {
  schema: FormSchema;
  onClose: () => void;
  onAdd: (label: string, repeat?: RepeatConfig) => void;
}) {
  const t = useTranslations("formConstructor");
  const [label, setLabel] = useState("");
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"open" | "fixed">("open");
  const [countFieldId, setCountFieldId] = useState("");
  const [minInstances, setMinInstances] = useState("1");
  const [maxInstances, setMaxInstances] = useState("");

  // Collect integer fields for the fixed-count dropdown
  const integerFields = collectFields(schema.elements).filter(
    (f) => f.type === "integer" && !f.hidden,
  );

  function handleCreate() {
    if (!label.trim()) return;
    const repeat: RepeatConfig | undefined = repeatEnabled
      ? {
          enabled: true,
          countFieldId:
            repeatMode === "fixed" && countFieldId ? countFieldId : undefined,
          min: Number.parseInt(minInstances, 10) || 1,
          max: maxInstances
            ? Number.parseInt(maxInstances, 10) || undefined
            : undefined,
        }
      : undefined;
    onAdd(label.trim(), repeat);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0 0 0 / 0.4)" }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: modal content */}
      <div
        role="dialog"
        className="flex flex-col rounded-vita-xl shadow-lg"
        style={{
          background: "var(--vita-surface)",
          border: "1px solid var(--vita-neutral-200)",
          width: "min(480px, 90vw)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable body */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          {/* Group name */}
          <div>
            <p
              className="mb-2 text-sm font-semibold"
              style={{ color: "var(--vita-text-primary)" }}
            >
              {t("addGroupModal.labelPrompt")}
            </p>
            <Input
              placeholder={t("addGroupModal.labelPlaceholder")}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && label.trim()) handleCreate();
              }}
            />
          </div>

          {/* Repeat toggle */}
          <div
            className="flex flex-col gap-3 rounded-vita-lg p-3"
            style={{
              border: "1px solid var(--vita-neutral-200)",
              background: "var(--vita-background)",
            }}
          >
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={repeatEnabled}
                onChange={(e) => setRepeatEnabled(e.target.checked)}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "var(--vita-text-primary)" }}
              >
                {t("addGroupModal.repeatToggle")}
              </span>
            </label>
            <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
              {t("addGroupModal.repeatHint")}
            </p>

            {repeatEnabled && (
              <div className="flex flex-col gap-3 pt-1">
                {/* Repeat mode selector */}
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="repeatMode"
                      checked={repeatMode === "open"}
                      onChange={() => setRepeatMode("open")}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--vita-text-primary)" }}
                    >
                      {t("addGroupModal.repeatOpenEnded")}
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="repeatMode"
                      checked={repeatMode === "fixed"}
                      onChange={() => setRepeatMode("fixed")}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--vita-text-primary)" }}
                    >
                      {t("addGroupModal.repeatFixedCount")}
                    </span>
                  </label>
                </div>

                {repeatMode === "fixed" ? (
                  <div>
                    <p
                      className="mb-1 text-xs"
                      style={{ color: "var(--vita-text-muted)" }}
                    >
                      {t("addGroupModal.repeatCountField")}
                    </p>
                    <select
                      className="w-full rounded-vita-md border px-2 py-1.5 text-xs"
                      style={{
                        borderColor: "var(--vita-neutral-200)",
                        background: "var(--vita-surface)",
                        color: "var(--vita-text-primary)",
                      }}
                      value={countFieldId}
                      onChange={(e) => setCountFieldId(e.target.value)}
                    >
                      <option value="">
                        {t("addGroupModal.repeatCountFieldPlaceholder")}
                      </option>
                      {integerFields.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label} ({f.id})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p
                        className="mb-1 text-xs"
                        style={{ color: "var(--vita-text-muted)" }}
                      >
                        {t("addGroupModal.repeatMin")}
                      </p>
                      <Input
                        type="number"
                        min={0}
                        value={minInstances}
                        onChange={(e) => setMinInstances(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="mb-1 text-xs"
                        style={{ color: "var(--vita-text-muted)" }}
                      >
                        {t("addGroupModal.repeatMax")}
                      </p>
                      <Input
                        type="number"
                        min={0}
                        placeholder={t("addGroupModal.repeatMaxPlaceholder")}
                        value={maxInstances}
                        onChange={(e) => setMaxInstances(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer — always visible */}
        <div
          className="flex shrink-0 justify-end gap-2 border-t px-6 py-4"
          style={{ borderColor: "var(--vita-neutral-200)" }}
        >
          <Button size="sm" variant="outline" onPress={onClose}>
            {t("addGroupModal.cancel")}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onPress={handleCreate}
            isDisabled={!label.trim()}
          >
            {t("addGroupModal.create")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Drag Overlay Content ──────────────────────────────────────────────────────

function DragOverlayContent({
  elementId,
  elements,
}: {
  elementId: string;
  elements: FormElement[];
}) {
  // Find the element being dragged (root or inside a group)
  let el: FormElement | undefined;
  for (const e of elements) {
    if (e.id === elementId) {
      el = e;
      break;
    }
    if (e.kind === "group") {
      const child = e.elements.find((c) => c.id === elementId);
      if (child) {
        el = child;
        break;
      }
    }
  }
  if (!el) return null;

  const label = el.kind === "field" ? el.label : el.label;
  const typeLabel = el.kind === "group" ? "Group" : el.type;

  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        background: "var(--vita-surface)",
        border: "2px solid var(--vita-primary)",
        boxShadow: "0 8px 24px oklch(0 0 0 / 0.15)",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--vita-text-primary)",
        maxWidth: 300,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "grabbing",
      }}
    >
      {label || typeLabel}
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
