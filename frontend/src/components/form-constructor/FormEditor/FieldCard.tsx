"use client";

/**
 * FieldCard — a single field row in the editor canvas.
 *
 * Features:
 * - Drag handle (via @dnd-kit/sortable)
 * - Up/down arrow buttons for keyboard-friendly reordering
 * - Type icon + label display
 * - Required / Hidden badges
 * - Edit, Duplicate, Delete action buttons
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getFieldMeta } from "../shared/field-registry";
import type { FieldElement } from "../types";

type FieldCardProps = {
  field: FieldElement;
  index: number;
  total: number;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  isDragActive?: boolean;
};

export function FieldCard({
  field,
  index,
  total,
  onEdit,
  isDragActive = false,
  onDuplicate,
  onDelete,
  onMove,
}: FieldCardProps) {
  const t = useTranslations("formConstructor");
  const meta = getFieldMeta(field.type);
  const Icon = meta.icon;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, disabled: isDragActive });

  const style: React.CSSProperties = {
    // Only apply transform when THIS field is being dragged
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-vita-md border px-3 py-2.5"
      {...attributes}
      data-dragging={isDragging}
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

      {/* Type icon */}
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-vita-sm"
        style={{
          background: "var(--vita-neutral-100)",
          color: "var(--vita-text-secondary)",
        }}
      >
        <Icon size={12} />
      </span>

      {/* Label + type */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium"
          style={{ color: "var(--vita-text-primary)" }}
        >
          {field.label || t(`fields.${meta.i18nKey}`)}
        </p>
        <p className="text-xs" style={{ color: "var(--vita-text-muted)" }}>
          {t(`fields.${meta.i18nKey}`)}
          {field.description && ` — ${field.description}`}
        </p>
      </div>

      {/* Badges */}
      {field.required && (
        <span
          className="shrink-0 rounded-vita-sm px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            background: "var(--vita-error-light)",
            color: "var(--vita-error-dark)",
          }}
        >
          {t("fieldCard.requiredBadge")}
        </span>
      )}
      {field.hidden && (
        <span
          className="shrink-0 rounded-vita-sm px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            background: "var(--vita-neutral-200)",
            color: "var(--vita-text-muted)",
          }}
        >
          {t("fieldCard.hiddenBadge")}
        </span>
      )}
      {field.visibility && (
        <span
          className="shrink-0 rounded-vita-sm px-1.5 py-0.5 text-[10px] font-semibold"
          style={{
            background: "var(--vita-info-light)",
            color: "var(--vita-info-dark)",
          }}
        >
          {t("fieldCard.hasCondition")}
        </span>
      )}

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        <IconBtn
          icon={ChevronUp}
          title={t("fieldCard.moveUp")}
          disabled={index === 0}
          onClick={() => onMove("up")}
        />
        <IconBtn
          icon={ChevronDown}
          title={t("fieldCard.moveDown")}
          disabled={index === total - 1}
          onClick={() => onMove("down")}
        />
        <IconBtn icon={Pencil} title={t("fieldCard.edit")} onClick={onEdit} />
        <IconBtn
          icon={Copy}
          title={t("fieldCard.duplicate")}
          onClick={onDuplicate}
        />
        <IconBtn
          icon={Trash2}
          title={t("fieldCard.delete")}
          onClick={onDelete}
          danger
        />
      </div>
    </div>
  );
}

// ── Small icon button helper ─────────────────────────────────────────────────

function IconBtn({
  icon: Icon,
  title,
  onClick,
  disabled,
  danger,
}: {
  icon: typeof Pencil;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      className="flex h-6 w-6 items-center justify-center rounded-vita-sm transition-colors"
      style={{
        color: disabled
          ? "var(--vita-neutral-300)"
          : danger
            ? "var(--vita-error)"
            : "var(--vita-text-muted)",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Icon size={12} />
    </button>
  );
}
