/**
 * When true, the module's inline preview is rendered externally (e.g. in
 * a sticky side pane) — modules should skip their own `<Preview />`.
 */

import { createContext, useContext } from "react";

const PreviewExternalContext = createContext(false);

export const PreviewExternalProvider = PreviewExternalContext.Provider;

export function usePreviewExternal(): boolean {
  return useContext(PreviewExternalContext);
}
