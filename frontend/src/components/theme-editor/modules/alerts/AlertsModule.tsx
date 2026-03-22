"use client";

/**
 * AlertsModule — composes inline alert and alert dialog controls.
 */

import { useTranslations } from "next-intl";

import { usePreviewExternal } from "../_shared";

import { AlertControls } from "./AlertControls";
import { AlertPreview } from "./AlertPreview";
import { DialogControls } from "./DialogControls";
import { DialogPreview } from "./DialogPreview";

export function AlertsModule() {
  const t = useTranslations("themeEditor");
  const previewExternal = usePreviewExternal();

  return (
    <div className="space-y-6">
      <p className="text-xs text-vita-text-muted">
        {t("modules.alerts.allControls")}
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
          {t("modules.alerts.inlineAlerts")}
        </h4>
        <p className="text-xs text-vita-text-muted">
          {t("modules.alerts.inlineAlertsDescription")}
        </p>
      </div>
      <AlertControls />

      {/* ── Alert dialog ── */}
      <div className="space-y-1 pt-2">
        <h4 className="text-xs font-semibold font-vita-heading text-vita-text-primary uppercase tracking-widest">
          {t("modules.alerts.alertDialog")}
        </h4>
        <p className="text-xs text-vita-text-muted">
          {t("modules.alerts.alertDialogDescription")}
        </p>
      </div>
      <DialogControls />
    </div>
  );
}
