/**
 * Rich Text Editor — public API.
 *
 * Usage:
 *   import { RichTextEditor } from "@/components/rich-text-editor";
 *
 *   // Inline (embedded)
 *   <RichTextEditor content={json} onChange={setJson} />
 *
 *   // Fullscreen overlay
 *   <RichTextEditor
 *     content={json}
 *     onChange={setJson}
 *     fullscreen
 *     title="Document Title"
 *     onSave={handleSave}
 *     onClose={() => setOpen(false)}
 *   />
 */

export { RichTextEditor } from "./RichTextEditor";
export type { EditorMode, RichTextEditorProps } from "./types";
