"use client";

/**
 * AlertsModule — composes inline alert and alert dialog controls.
 */

import { usePreviewExternal } from "../_shared";

import { AlertControls } from "./AlertControls";
import { AlertPreview } from "./AlertPreview";
import { DialogControls } from "./DialogControls";
import { DialogPreview } from "./DialogPreview";

export function AlertsModule() {
  const previewExternal = usePreviewExternal();

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        Controls both inline alert banners and modal confirmation dialogs used
        for notifications, warnings, and destructive action confirmations.
      </p>

      {!previewExternal && (
        <>
          <AlertPreview />
          <DialogPreview />
        </>
      )}

      {/* ── Inline alerts ── */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold font-vita-heading text-vita-text-primary uppercase tracking-widest">
          Inline alerts
        </h4>
        <p className="text-xs text-vita-text-muted">
          Status banners for success, warning, error, and info messages.
        </p>
      </div>
      <AlertControls />

      {/* ── Alert dialog ── */}
      <div className="space-y-1 pt-2">
        <h4 className="text-xs font-semibold font-vita-heading text-vita-text-primary uppercase tracking-widest">
          Alert dialog
        </h4>
        <p className="text-xs text-vita-text-muted">
          Modal confirmation panels for destructive or critical actions.
        </p>
      </div>
      <DialogControls />
    </div>
  );
}
