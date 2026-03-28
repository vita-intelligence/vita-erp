/**
 * Rich Text Editor — shared types.
 */

export type EditorMode = "rich" | "code";

export type RichTextEditorProps = {
  /** Initial content — BlockNote JSON string or empty for new document */
  content?: string;
  /** Called with updated content (BlockNote JSON string) on every change */
  onChange?: (content: string) => void;
  /** Read-only mode — disables editing */
  readOnly?: boolean;
  /** Show in fullscreen overlay */
  fullscreen?: boolean;
  /** Called when fullscreen overlay is closed */
  onClose?: () => void;
  /** Title shown in fullscreen header */
  title?: string;
  /** Save handler for fullscreen mode (shows Save button) */
  onSave?: (content: string) => void;
  /** Whether save is in progress */
  isSaving?: boolean;
  /** Minimum height for inline (non-fullscreen) mode */
  minHeight?: string;
  /** Placeholder text when editor is empty */
  placeholder?: string;
};
