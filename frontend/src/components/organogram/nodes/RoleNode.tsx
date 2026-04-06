"use client";

import { Handle, type NodeProps, NodeToolbar, Position } from "@xyflow/react";
import { Trash2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useCallback, useRef, useState } from "react";

import type { RoleNode as RoleNodeType } from "../types";

/**
 * Custom ReactFlow node for a role in the organogram.
 *
 * Renders a themed card with:
 * - Inline-editable name (double-click)
 * - Member count badge
 * - System role indicator
 * - Source/target handles for connections
 * - Toolbar with delete (hidden for system roles and in read-only mode)
 */
const RoleNode = memo(function RoleNode({
  data,
  selected,
}: NodeProps<RoleNodeType>) {
  const t = useTranslations("organogram");
  const { role, isReadOnly } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(role.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback(() => {
    if (isReadOnly || role.is_system) return;
    setEditName(role.name);
    setIsEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  }, [isReadOnly, role.is_system, role.name]);

  const handleNameBlur = useCallback(() => {
    setIsEditing(false);
    const trimmed = editName.trim();
    if (trimmed && trimmed !== role.name) {
      // Dispatch custom event for the canvas to handle
      window.dispatchEvent(
        new CustomEvent("organogram:rename-role", {
          detail: { roleId: role.id, name: trimmed },
        }),
      );
    }
  }, [editName, role.id, role.name]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleNameBlur();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setEditName(role.name);
      }
    },
    [handleNameBlur, role.name],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      window.dispatchEvent(
        new CustomEvent("organogram:delete-role", {
          detail: { roleId: role.id },
        }),
      );
    },
    [role.id],
  );

  return (
    <>
      {/* Toolbar — only in edit mode for non-system roles */}
      {!isReadOnly && !role.is_system && (
        <NodeToolbar isVisible={selected} position={Position.Top}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid var(--vita-border)",
              background: "var(--vita-surface)",
              color: "var(--vita-text-danger, #ef4444)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            <Trash2 size={14} />
          </button>
        </NodeToolbar>
      )}

      {/* Target handle — top */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: 14,
          height: 14,
          background: "var(--vita-primary)",
          border: "2px solid var(--vita-surface)",
          zIndex: 10,
        }}
        isConnectable={!isReadOnly}
      />

      {/* Card body */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: ReactFlow node with double-click rename */}
      <div
        onDoubleClick={handleDoubleClick}
        style={{
          minWidth: 220,
          padding: "12px 16px",
          borderRadius: 10,
          border: `2px solid ${selected ? "var(--vita-primary)" : "var(--vita-border)"}`,
          background: "var(--vita-surface)",
          boxShadow: selected
            ? "0 0 0 2px var(--vita-primary-light, rgba(99, 102, 241, 0.2))"
            : "0 1px 3px rgba(0,0,0,0.08)",
          cursor: isReadOnly ? "default" : "grab",
          transition: "border-color 150ms, box-shadow 150ms",
        }}
      >
        {/* System badge */}
        {role.is_system && (
          <span
            style={{
              display: "inline-block",
              marginBottom: 6,
              padding: "2px 8px",
              borderRadius: 4,
              background: "var(--vita-primary)",
              color: "var(--vita-primary-foreground, #fff)",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {t("systemBadge")}
          </span>
        )}

        {/* Name */}
        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "2px 4px",
              border: "1px solid var(--vita-primary)",
              borderRadius: 4,
              background: "transparent",
              color: "var(--vita-text-primary)",
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
            }}
          />
        ) : (
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--vita-text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {role.name}
          </div>
        )}

        {/* Description */}
        {role.description && (
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: "var(--vita-text-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {role.description}
          </div>
        )}

        {/* Member count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
            fontSize: 12,
            color: "var(--vita-text-muted)",
          }}
        >
          <Users size={14} />
          <span>{role.member_count}</span>
        </div>
      </div>

      {/* Source handle — bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: 14,
          height: 14,
          background: "var(--vita-primary)",
          border: "2px solid var(--vita-surface)",
          zIndex: 10,
        }}
        isConnectable={!isReadOnly}
      />
    </>
  );
});

export default RoleNode;
