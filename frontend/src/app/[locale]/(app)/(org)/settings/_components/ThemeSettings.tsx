"use client";

/**
 * ThemeSettings — content of the "Theme" tab on the Settings page.
 *
 * Two ways to edit the theme:
 *   1. Click "Open editor" to launch the fullscreen editor overlay right here.
 *   2. Toggle the palette switch to pin a floating palette icon across org
 *      pages; clicking the palette opens the same editor in a draggable
 *      window while navigating anywhere in the app.
 *
 * Pending changes are held in useThemeStore; Save/Discard reflect dirty
 * state against the last server snapshot. All editing is gated by the
 * `company_theme:write` RBAC permission.
 */

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { ThemeEditor } from "@/components/theme-editor/ThemeEditor";
import { ButtonRoot } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { usePermission } from "@/hooks/usePermission";
import { useThemeStore } from "@/stores/theme";

export default function ThemeSettings() {
  const t = useTranslations("companySettings");
  const canEdit = usePermission("company_theme", "write");

  const isTriggerVisible = useThemeStore((s) => s.isTriggerVisible);
  const toggleTrigger = useThemeStore((s) => s.toggleTrigger);
  const discardChanges = useThemeStore((s) => s.discardChanges);
  const saveToServer = useThemeStore((s) => s.saveToServer);
  // Re-render when mode or tokens change so the dirty check stays fresh.
  const mode = useThemeStore((s) => s.mode);
  const tokensByMode = useThemeStore((s) => s.tokensByMode);
  const savedSnapshot = useThemeStore((s) => s.savedSnapshot);

  const dirty =
    savedSnapshot !== null &&
    JSON.stringify({ mode, tokensByMode }) !== JSON.stringify(savedSnapshot);

  const [isSaving, setIsSaving] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await saveToServer();
    setIsSaving(false);
    if (ok) {
      toast.success(t("theme.save_success"));
    } else {
      toast.danger(t("theme.save_failed"));
    }
  };

  return (
    <div className="space-y-6">
      {!canEdit && (
        <output
          className="block rounded-vita-md border px-4 py-3 text-sm"
          style={{
            backgroundColor: "var(--vita-neutral-50)",
            borderColor: "var(--vita-neutral-200)",
            color: "var(--vita-text-secondary)",
          }}
        >
          {t("theme.read_only_notice")}
        </output>
      )}

      <div>
        <h2 className="text-sm font-semibold text-vita-text-primary">
          {t("theme.title")}
        </h2>
        <p className="text-xs text-vita-text-muted">{t("theme.description")}</p>
      </div>

      {/* Open fullscreen editor */}
      <section
        className="flex items-start justify-between gap-4 rounded-vita-md border p-4"
        style={{ borderColor: "var(--vita-neutral-200)" }}
      >
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-vita-text-primary">
            {t("theme.open_editor_label")}
          </span>
          <span className="block text-xs text-vita-text-muted">
            {t("theme.open_editor_description")}
          </span>
        </div>
        <div className="shrink-0">
          <ButtonRoot
            size="sm"
            onPress={() => setFullscreenOpen(true)}
            isDisabled={!canEdit}
          >
            {t("theme.open_editor")}
          </ButtonRoot>
        </div>
      </section>

      {/* Palette trigger toggle */}
      <section
        className="flex items-start justify-between gap-4 rounded-vita-md border p-4"
        style={{ borderColor: "var(--vita-neutral-200)" }}
      >
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-vita-text-primary">
            {t("theme.trigger_toggle_label")}
          </span>
          <span className="block text-xs text-vita-text-muted">
            {t("theme.trigger_toggle_description")}
          </span>
        </div>
        <div className="shrink-0 pt-0.5">
          <Switch
            isSelected={isTriggerVisible}
            onChange={(visible) => toggleTrigger(visible)}
            isDisabled={!canEdit}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
        </div>
      </section>

      {/* Pending changes */}
      {dirty && canEdit && (
        <section
          className="sticky bottom-0 flex flex-col gap-3 rounded-vita-md border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          style={{
            backgroundColor: "var(--vita-neutral-50)",
            borderColor: "var(--vita-neutral-200)",
          }}
        >
          <span className="text-sm text-vita-text-primary">
            {t("theme.unsaved_changes_title")}
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <ButtonRoot
              variant="ghost"
              size="sm"
              onPress={discardChanges}
              isDisabled={isSaving}
              className="flex-1 sm:flex-initial"
            >
              {t("theme.discard")}
            </ButtonRoot>
            <ButtonRoot
              size="sm"
              onPress={handleSave}
              isDisabled={isSaving}
              className="flex-1 sm:flex-initial"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("theme.saving")}
                </>
              ) : (
                t("theme.save")
              )}
            </ButtonRoot>
          </div>
        </section>
      )}

      {/* Fullscreen editor overlay — launched from the button above */}
      <ThemeEditor
        mode="fullscreen"
        open={fullscreenOpen}
        onClose={() => setFullscreenOpen(false)}
      />
    </div>
  );
}
