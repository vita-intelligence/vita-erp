"use client";

/**
 * FieldCard — a single field row in the editor canvas.
 *
 * Visual features:
 * - Color-coded left border by field category
 * - Type icon with colored background
 * - Type name chip
 * - Required / Hidden / Condition badges
 * - Action buttons visible on hover
 * - Drop highlight animation
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { CATEGORY_COLORS, getFieldMeta } from "../shared/field-registry";
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
  isJustDropped?: boolean;
};

export function FieldCard({
  field,
  index,
  total,
  onEdit,
  isDragActive = false,
  isJustDropped = false,
  onDuplicate,
  onDelete,
  onMove,
}: FieldCardProps) {
  const t = useTranslations("formConstructor");
  const meta = getFieldMeta(field.type);
  const Icon = meta.icon;
  const categoryColor = CATEGORY_COLORS[meta.category];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, disabled: isDragActive });

  const style: React.CSSProperties = {
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    // Color-coded left border
    borderLeftWidth: "3px",
    borderLeftStyle: "solid",
    borderLeftColor: categoryColor,
    ...(isJustDropped
      ? {
          boxShadow: "0 0 0 2px var(--vita-primary)",
          animation: "fade-ring 1.2s ease-out forwards",
        }
      : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/card flex items-center gap-2 rounded-vita-md border bg-[var(--vita-surface)] px-3 py-2"
      {...attributes}
      data-dragging={isDragging}
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

      {/* Type icon — colored by category */}
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-vita-sm"
        style={{
          background: `color-mix(in oklch, ${categoryColor} 15%, transparent)`,
          color: categoryColor,
        }}
      >
        <Icon size={14} />
      </span>

      {/* Label + type chip */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className="truncate text-sm font-medium"
            style={{ color: "var(--vita-text-primary)" }}
          >
            {field.label || t(`fields.${meta.i18nKey}`)}
          </p>
          {/* Type chip */}
          <span
            className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: `color-mix(in oklch, ${categoryColor} 10%, transparent)`,
              color: categoryColor,
            }}
          >
            {t(`fields.${meta.i18nKey}`)}
          </span>
        </div>
        {field.description && (
          <p
            className="mt-0.5 truncate text-xs"
            style={{ color: "var(--vita-text-muted)" }}
          >
            {field.description}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex shrink-0 items-center gap-1">
        {field.required && (
          <span
            className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold"
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
            className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold"
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
            className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold"
            style={{
              background: "var(--vita-info-light)",
              color: "var(--vita-info-dark)",
            }}
          >
            {t("fieldCard.hasCondition")}
          </span>
        )}
      </div>

      {/* Actions — visible on hover */}
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
        <IconBtn
          icon={ArrowUp}
          title={t("fieldCard.moveUp")}
          disabled={index === 0}
          onClick={() => onMove("up")}
        />
        <IconBtn
          icon={ArrowDown}
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
      className="flex h-7 w-7 items-center justify-center rounded-vita-sm transition-colors hover:bg-[var(--vita-neutral-100)]"
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
      <Icon size={13} />
    </button>
  );
}
