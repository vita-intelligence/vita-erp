"use client";

/**
 * EditorMount — renders the floating palette trigger and the windowed
 * theme editor when enabled.
 *
 * Two independent toggles live in useThemeStore:
 *  - isTriggerVisible: the draggable palette icon (persisted, survives reloads)
 *  - isEditorOpen: the windowed editor itself (transient)
 *
 * The palette stays visible whenever the editor is open so users can always
 * close/reopen it from anywhere — even if they toggled the trigger off.
 * Both are gated by the `company_theme:write` permission.
 */

import { usePermission } from "@/hooks/usePermission";
import { useThemeStore } from "@/stores/theme";

import { FloatingTrigger } from "./FloatingTrigger";
import { ThemeEditor } from "./ThemeEditor";

export function EditorMount() {
  const isEditorOpen = useThemeStore((s) => s.isEditorOpen);
  const isTriggerVisible = useThemeStore((s) => s.isTriggerVisible);
  const toggleEditor = useThemeStore((s) => s.toggleEditor);
  const canEdit = usePermission("company_theme", "write");

  if (!canEdit) return null;

  // Show palette when user pinned it OR when editor is currently open
  // (so it can always be closed from the palette).
  const showTrigger = isTriggerVisible || isEditorOpen;

  return (
    <>
      {showTrigger && <FloatingTrigger />}
      <ThemeEditor
        mode="window"
        open={isEditorOpen}
        onClose={() => toggleEditor(false)}
      />
    </>
  );
}
