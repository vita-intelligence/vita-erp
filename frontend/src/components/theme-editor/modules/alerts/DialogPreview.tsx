"use client";

/**
 * Live alert dialog preview — simulated confirmation dialog with backdrop.
 */

import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { useThemeStore } from "@/stores/theme";

export function DialogPreview() {
  const t = useTranslations("themeEditor");
  const { tokens } = useThemeStore();

  const px = tokens.alertDialogPaddingX ?? "24px";
  const py = tokens.alertDialogPaddingY ?? "20px";

  return (
    <div className="space-y-3 overflow-hidden rounded-vita-md border border-vita-neutral-200 bg-vita-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-vita-text-muted">
        {t("preview.dialogPreview")}
      </p>

      {/* Simulated page + backdrop + dialog */}
      <div
        className="relative rounded-vita-md overflow-hidden"
        style={{ minHeight: "16rem" }}
      >
        {/* Fake page content behind the backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--vita-background)", padding: "0.75rem" }}
        >
          {/* Mini nav bar */}
          <div
            style={{
              background: "var(--vita-surface)",
              borderRadius: "var(--vita-card-radius)",
              border: "1px solid var(--vita-neutral-200)",
              padding: "0.5rem 0.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--vita-text-primary)",
                fontFamily: "var(--vita-font-heading)",
              }}
            >
              {t("preview.alerts.navTitle")}
            </span>
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {(["navDashboard", "navOrders", "navInventory"] as const).map(
                (key) => (
                  <span
                    key={key}
                    style={{
                      fontSize: "0.625rem",
                      color: "var(--vita-text-muted)",
                      padding: "0.15rem 0.4rem",
                    }}
                  >
                    {t(`preview.alerts.${key}`)}
                  </span>
                ),
              )}
            </div>
          </div>
          {/* Mini table rows */}
          <div
            style={{
              background: "var(--vita-surface)",
              borderRadius: "var(--vita-card-radius)",
              border: "1px solid var(--vita-neutral-200)",
              overflow: "hidden",
            }}
          >
            {[
              {
                id: "ORD-00842",
                product: "Steel Frame A-14",
                status: "Active",
              },
              { id: "ORD-00841", product: "Bolt Assembly B2", status: "Done" },
              { id: "ORD-00840", product: "Weld Joint C6", status: "Review" },
              { id: "ORD-00839", product: "Cover Plate D1", status: "Draft" },
            ].map((row) => (
              <div
                key={row.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.35rem 0.625rem",
                  borderBottom: "1px solid var(--vita-neutral-100)",
                  fontSize: "0.625rem",
                }}
              >
                <span
                  style={{
                    color: "var(--vita-text-primary)",
                    fontFamily: "var(--vita-font-mono)",
                  }}
                >
                  {row.id}
                </span>
                <span style={{ color: "var(--vita-text-secondary)" }}>
                  {row.product}
                </span>
                <span style={{ color: "var(--vita-text-muted)" }}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Backdrop blur layer — must be separate from color for blur to work */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${tokens.alertDialogBackdropBlur ?? "0px"})`,
            WebkitBackdropFilter: `blur(${tokens.alertDialogBackdropBlur ?? "0px"})`,
          }}
        />
        {/* Backdrop color layer */}
        <div
          className="absolute inset-0"
          style={{
            background: tokens.alertDialogBackdropColor ?? "oklch(0 0 0 / 0.4)",
            opacity: tokens.alertDialogBackdropOpacity ?? "1",
          }}
        />

        {/* Dialog panel — centered over the page */}
        <div
          className="relative mx-auto"
          style={{
            width: "90%",
            maxWidth: "22rem",
            marginTop: "1.5rem",
            borderRadius: tokens.alertDialogRadius ?? "0px",
            boxShadow: tokens.alertDialogShadow ?? "none",
            background: "var(--vita-surface)",
            border: "1px solid var(--vita-neutral-200)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              paddingLeft: px,
              paddingRight: px,
              paddingTop: py,
              paddingBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "9999px",
                background: "var(--vita-error-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TriangleAlert
                size={16}
                style={{ color: "var(--vita-error-dark)" }}
              />
            </div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--vita-text-primary)",
                fontFamily: "var(--vita-font-heading)",
              }}
            >
              {t("preview.alerts.dialogTitle")}
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              paddingLeft: px,
              paddingRight: px,
              paddingTop: "0.25rem",
              paddingBottom: "0.75rem",
            }}
          >
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--vita-text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {t("preview.alerts.dialogBody", { orderNumber: "#00842" })}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              paddingLeft: px,
              paddingRight: px,
              paddingBottom: py,
              paddingTop: "0.25rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            {[
              { key: "dialogCancel", danger: false },
              { key: "dialogDelete", danger: true },
            ].map(({ key, danger }) => (
              <button
                key={key}
                type="button"
                style={{
                  borderRadius: "var(--vita-btn-radius)",
                  fontWeight:
                    "var(--vita-btn-font-weight)" as React.CSSProperties["fontWeight"],
                  fontSize: "0.8125rem",
                  padding: "0.4rem 0.875rem",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  cursor: "default",
                  background: danger
                    ? "var(--vita-error)"
                    : "var(--vita-surface)",
                  color: danger
                    ? "var(--vita-text-on-danger)"
                    : "var(--vita-text-secondary)",
                  borderColor: danger
                    ? "var(--vita-error)"
                    : "var(--vita-neutral-200)",
                }}
              >
                {t(`preview.alerts.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
