"use client";

/**
 * GroupCard — a collapsible group container in the editor canvas.
 *
 * Displays a group header with nested field cards inside.
 * Supports adding fields to the group and managing children.
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  FolderOpen,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { FieldElement, FormElement, GroupElement } from "../types";
import { DropZone } from "./DropZone";
import { FieldCard } from "./FieldCard";

type GroupCardProps = {
  group: GroupElement;
  index: number;
  total: number;
  allElements: FormElement[];
  onEdit: (field: FieldElement) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  onAddField: () => void;
  onRemoveChild: (childId: string) => void;
  onDuplicateChild: (childId: string) => void;
  onMoveChild: (childId: string, direction: "up" | "down") => void;
  isDragActive?: boolean;
  /** ID of the element currently being dragged (to hide adjacent zones) */
  activeDragId?: string | null;
};

export function GroupCard({
  group,
  index,
  total,
  onEdit,
  onDelete,
  onMove,
  onAddField,
  onRemoveChild,
  onDuplicateChild,
  onMoveChild,
  isDragActive = false,
  activeDragId = null,
}: GroupCardProps) {
  const t = useTranslations("formConstructor");
  const [collapsed, setCollapsed] = useState(false);

  // Find dragged element's index inside this group (for hiding adjacent zones)
  const dragChildIndex = activeDragId
    ? group.elements.findIndex((c) => c.id === activeDragId)
    : -1;

  function isGroupZoneHidden(zoneIndex: number): boolean {
    if (dragChildIndex === -1) return false;
    return zoneIndex === dragChildIndex || zoneIndex === dragChildIndex + 1;
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id, disabled: isDragActive });

  const style: React.CSSProperties = {
    // Only apply transform when THIS group is being dragged, not when
    // something else is dragged over it (which causes the "escape" bug)
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-vita-lg border"
      {...attributes}
    >
      {/* Group header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{
          borderBottom: collapsed
            ? "none"
            : "1px solid var(--vita-neutral-200)",
          background: "var(--vita-neutral-50)",
          borderColor: "var(--vita-neutral-200)",
        }}
      >
        {/* Drag handle */}
        <button
          type="button"
          className="shrink-0 cursor-grab touch-none"
          style={{ color: "var(--vita-neutral-400)" }}
          title={t("fieldCard.dragToReorder")}
          {...listeners}
        >
          <GripVertical size={14} />
        </button>

        {/* Group icon */}
        <FolderOpen
          size={14}
          style={{ color: "var(--vita-primary)", flexShrink: 0 }}
        />

        {/* Label */}
        <p
          className="min-w-0 flex-1 truncate text-sm font-semibold"
          style={{ color: "var(--vita-text-primary)" }}
        >
          {group.label}
        </p>

        {/* Field count */}
        <span
          className="shrink-0 text-xs"
          style={{ color: "var(--vita-text-muted)" }}
        >
          {group.elements.length}
        </span>

        {/* Collapse toggle */}
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-vita-sm"
          style={{ color: "var(--vita-text-muted)" }}
          title={collapsed ? t("group.expand") : t("group.collapse")}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        {/* Move up/down */}
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-vita-sm"
          style={{
            color:
              index === 0
                ? "var(--vita-neutral-300)"
                : "var(--vita-text-muted)",
          }}
          disabled={index === 0}
          title={t("fieldCard.moveUp")}
          onClick={() => onMove("up")}
        >
          <ChevronUp size={12} />
        </button>
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-vita-sm"
          style={{
            color:
              index === total - 1
                ? "var(--vita-neutral-300)"
                : "var(--vita-text-muted)",
          }}
          disabled={index === total - 1}
          title={t("fieldCard.moveDown")}
          onClick={() => onMove("down")}
        >
          <ChevronDown size={12} />
        </button>

        {/* Delete group */}
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-vita-sm"
          style={{ color: "var(--vita-error)" }}
          title={t("fieldCard.delete")}
          onClick={onDelete}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Group body — children */}
      {!collapsed && (
        <div
          className="space-y-1.5 p-3"
          style={{ background: "var(--vita-background)" }}
        >
          {/* Drop zone at top of group */}
          <DropZone
            id={`drop:${group.id}:0`}
            isDragActive={isDragActive}
            hidden={isGroupZoneHidden(0)}
          />

          {group.elements.length === 0 && !isDragActive ? (
            <p
              className="py-4 text-center text-xs"
              style={{ color: "var(--vita-text-muted)" }}
            >
              {t("group.emptyGroup")}
            </p>
          ) : (
            group.elements.map((child, childIndex) => {
              if (child.kind !== "field") return null;
              return (
                <div key={child.id}>
                  <FieldCard
                    field={child}
                    index={childIndex}
                    total={group.elements.length}
                    isDragActive={isDragActive}
                    onEdit={() => onEdit(child)}
                    onDuplicate={() => onDuplicateChild(child.id)}
                    onDelete={() => onRemoveChild(child.id)}
                    onMove={(dir) => onMoveChild(child.id, dir)}
                  />
                  {/* Drop zone after each child */}
                  <DropZone
                    id={`drop:${group.id}:${childIndex + 1}`}
                    isDragActive={isDragActive}
                    hidden={isGroupZoneHidden(childIndex + 1)}
                    isLast={childIndex === group.elements.length - 1}
                  />
                </div>
              );
            })
          )}

          {/* Add field to group button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 rounded-vita-md border border-dashed py-2 text-xs font-medium transition-colors"
            style={{
              borderColor: "var(--vita-neutral-300)",
              color: "var(--vita-primary)",
            }}
            onClick={onAddField}
          >
            <Plus size={12} />
            {t("addField.addToGroup")}
          </button>
        </div>
      )}
    </div>
  );
}
