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
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  GripVertical,
  Pencil,
  Plus,
  Repeat,
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
  onEditGroup: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  onAddField: () => void;
  onRemoveChild: (childId: string) => void;
  onDuplicateChild: (childId: string) => void;
  onMoveChild: (childId: string, direction: "up" | "down") => void;
  isDragActive?: boolean;
  /** ID of the element currently being dragged (to hide adjacent zones) */
  activeDragId?: string | null;
  /** ID of the element that was just dropped — triggers highlight */
  justDroppedId?: string | null;
};

export function GroupCard({
  group,
  index,
  total,
  onEdit,
  onEditGroup,
  onDelete,
  onMove,
  onAddField,
  onRemoveChild,
  onDuplicateChild,
  onMoveChild,
  isDragActive = false,
  activeDragId = null,
  justDroppedId = null,
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

  const isGroupJustDropped = justDroppedId === group.id;
  const style: React.CSSProperties = {
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...(isGroupJustDropped
      ? {
          boxShadow: "0 0 0 2px var(--vita-primary)",
          animation: "fade-ring 1.2s ease-out forwards",
        }
      : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderLeftWidth: "3px",
        borderLeftStyle: "solid",
        borderLeftColor: "var(--vita-primary)",
      }}
      className="group/groupcard overflow-hidden rounded-vita-lg border"
      {...attributes}
    >
      {/* Group header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{
          borderBottomWidth: collapsed ? "0px" : "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "var(--vita-neutral-200)",
          background: "var(--vita-neutral-50)",
        }}
      >
        {/* Drag handle */}
        <button
          type="button"
          className="shrink-0 cursor-grab touch-none rounded-vita-sm p-0.5 transition-colors hover:bg-[var(--vita-neutral-100)]"
          style={{ color: "var(--vita-neutral-400)" }}
          title={t("fieldCard.dragToReorder")}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        {/* Group icon — primary colored */}
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-vita-sm"
          style={{
            background:
              "color-mix(in oklch, var(--vita-primary) 15%, transparent)",
            color: "var(--vita-primary)",
          }}
        >
          <FolderOpen size={14} />
        </span>

        {/* Label */}
        <p
          className="min-w-0 flex-1 truncate text-sm font-semibold"
          style={{ color: "var(--vita-text-primary)" }}
        >
          {group.label}
        </p>

        {/* Repeat badge */}
        {group.repeat?.enabled && (
          <span
            className="flex shrink-0 items-center gap-1 rounded-vita-sm px-1.5 py-0.5 text-xs font-medium"
            style={{
              background: "var(--vita-info-light, var(--vita-neutral-100))",
              color: "var(--vita-info, var(--vita-primary))",
            }}
          >
            <Repeat size={10} />
            {t("repeat.badge")}
          </span>
        )}

        {/* Field count */}
        <span
          className="shrink-0 text-xs"
          style={{ color: "var(--vita-text-muted)" }}
        >
          {group.elements.length}
        </span>

        {/* Collapse / expand */}
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center rounded-vita-sm"
          style={{ color: "var(--vita-text-muted)" }}
          title={collapsed ? t("group.expand") : t("group.collapse")}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/groupcard:opacity-100">
          <span
            className="h-4"
            style={{
              borderLeftWidth: "1px",
              borderLeftStyle: "solid",
              borderLeftColor: "var(--vita-neutral-200)",
            }}
          />
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-vita-sm transition-colors hover:bg-[var(--vita-neutral-100)]"
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
            <ArrowUp size={13} />
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-vita-sm transition-colors hover:bg-[var(--vita-neutral-100)]"
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
            <ArrowDown size={13} />
          </button>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-vita-sm transition-colors hover:bg-[var(--vita-neutral-100)]"
            style={{ color: "var(--vita-primary)" }}
            title={t("fieldCard.edit")}
            onClick={onEditGroup}
          >
            <Pencil size={13} />
          </button>
        </div>

        {/* Delete group — always visible (destructive action) */}
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-vita-sm transition-colors hover:bg-[var(--vita-neutral-100)]"
          style={{ color: "var(--vita-error)" }}
          title={t("fieldCard.delete")}
          onClick={onDelete}
        >
          <Trash2 size={13} />
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
                    isJustDropped={justDroppedId === child.id}
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
