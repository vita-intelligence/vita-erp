"use client";

/**
 * Combined preview for the sticky pane — shows both alert and dialog previews.
 */

import { AlertPreview } from "./AlertPreview";
import { DialogPreview } from "./DialogPreview";

export function Preview() {
  return (
    <div className="space-y-4">
      <AlertPreview />
      <DialogPreview />
    </div>
  );
}
