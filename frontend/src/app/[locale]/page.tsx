"use client";

import { useState } from "react";
import { FormEditor } from "@/components/form-constructor/FormEditor/FormEditor";
import type { FormSchema } from "@/components/form-constructor/types";
import { ThemeEditor } from "@/components/theme-editor";
import { ButtonRoot } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { ChipRoot } from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
import { THEME } from "@/config";

export default function DesignSystemPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"fullscreen" | "window">(
    "window",
  );
  const [formSchema, setFormSchema] = useState<FormSchema | undefined>();

  const openEditor = (mode: "fullscreen" | "window") => {
    setEditorMode(mode);
    setEditorOpen(true);
  };

  return (
    <>
      <ThemeEditor
        mode={editorMode}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
      />

      <main className="min-h-screen bg-vita-background p-4 font-vita-sans md:p-8">
        <div className="mx-auto max-w-4xl space-y-8 md:space-y-10">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-vita-text-primary md:text-3xl">
                Design System
              </h1>
              <p className="mt-1 text-sm text-vita-text-muted">
                Live preview — open the theme editor to customise in real time.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ButtonRoot
                variant="outline"
                size="sm"
                onPress={() => openEditor("window")}
              >
                Open as window
              </ButtonRoot>
              <ButtonRoot
                variant="primary"
                size="sm"
                onPress={() => openEditor("fullscreen")}
              >
                Open fullscreen
              </ButtonRoot>
            </div>
          </div>

          <Separator />

          {/* Buttons */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Buttons
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <ButtonRoot variant="primary">Primary</ButtonRoot>
              <ButtonRoot variant="secondary">Secondary</ButtonRoot>
              <ButtonRoot variant="tertiary">Tertiary</ButtonRoot>
              <ButtonRoot variant="outline">Outline</ButtonRoot>
              <ButtonRoot variant="ghost">Ghost</ButtonRoot>
              <ButtonRoot variant="danger">Error</ButtonRoot>
              <ButtonRoot variant="danger-soft">Error Soft</ButtonRoot>
              <ButtonRoot isDisabled>Disabled</ButtonRoot>
            </div>
          </section>

          {/* Status chips */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Status chips
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <ChipRoot color="accent" variant="primary">
                Primary
              </ChipRoot>
              <ChipRoot color="success" variant="primary">
                Success
              </ChipRoot>
              <ChipRoot color="warning" variant="primary">
                Warning
              </ChipRoot>
              <ChipRoot color="danger" variant="primary">
                Error
              </ChipRoot>
              <ChipRoot color="accent" variant="soft">
                Primary Soft
              </ChipRoot>
              <ChipRoot color="success" variant="soft">
                Success Soft
              </ChipRoot>
            </div>
          </section>

          {/* Cards */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Cards
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
              {(["Orders", "Revenue", "Inventory"] as const).map((title, i) => (
                <CardRoot key={title} className="shadow-vita-sm">
                  <CardHeader>
                    <span className="text-sm font-medium text-vita-text-secondary">
                      {title}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-vita-text-primary">
                      {["1,240", "$84,200", "3,891"][i]}
                    </p>
                    <span className="text-xs text-vita-success">
                      ↑ {["12%", "8%", "3%"][i]} this month
                    </span>
                  </CardContent>
                </CardRoot>
              ))}
            </div>
          </section>

          <Separator />

          {/* Form Constructor */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Form Constructor
            </p>
            <FormEditor schema={formSchema} onChange={setFormSchema} />
          </section>

          <Separator />

          {/* Typography */}
          <section className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Typography
            </p>
            <p className="text-3xl font-bold text-vita-text-primary md:text-4xl">
              Heading 4xl
            </p>
            <p className="text-xl font-semibold text-vita-text-primary md:text-2xl">
              Heading 2xl
            </p>
            <p className="text-lg font-medium text-vita-text-primary md:text-xl">
              Heading xl
            </p>
            <p className="text-base text-vita-text-secondary">
              Body — base size
            </p>
            <p className="text-sm text-vita-text-secondary">
              Small — secondary
            </p>
            <p className="text-xs text-vita-text-muted">Extra small — muted</p>
          </section>

          {/* Border radii */}
          <section className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Border radii
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((r) => (
                <div
                  key={r}
                  className="flex h-12 w-12 items-center justify-center bg-vita-primary text-xs text-white shadow-vita-md md:h-14 md:w-14"
                  style={{ borderRadius: THEME.radii[r] }}
                >
                  {r}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
