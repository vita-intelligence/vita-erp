"use client";

import { ButtonRoot } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { ChipRoot } from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
import { THEME } from "@/config";
import { useThemeStore } from "@/stores/theme";

const neutralShades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export default function DesignSystemPage() {
  const { mode, setMode, setTokens } = useThemeStore();

  return (
    <main className="min-h-screen bg-vita-neutral-50 p-8 font-vita-sans">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header + Theme switcher */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-vita-neutral-900">
              Vita ERP — Design System
            </h1>
            <p className="mt-1 text-vita-neutral-500">
              Visual reference for tokens, components, and palette.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ButtonRoot
              variant={mode === "light" ? "primary" : "outline"}
              size="sm"
              onPress={() => setMode("light")}
            >
              Light
            </ButtonRoot>
            <ButtonRoot
              variant={mode === "dark" ? "primary" : "outline"}
              size="sm"
              onPress={() => setMode("dark")}
            >
              Dark
            </ButtonRoot>
            {/* Live token override — accent color picker for theme constructor demo */}
            <input
              type="color"
              title="Override accent color"
              className="h-8 w-8 cursor-pointer rounded-vita-sm border border-vita-neutral-200"
              onChange={(e) => {
                setTokens({ accent: e.target.value });
              }}
            />
          </div>
        </div>

        <Separator />

        {/* Brand colors */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-vita-neutral-800">
            Brand colors
          </h2>
          <div className="flex flex-wrap gap-3">
            {(["accent", "success", "warning", "danger", "info"] as const).map(
              (name) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div
                    className={`h-12 w-20 rounded-vita-md bg-vita-${name}`}
                  />
                  <span className="text-xs text-vita-neutral-500">{name}</span>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Neutral scale */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-vita-neutral-800">
            Neutral scale
          </h2>
          <div className="flex flex-wrap gap-2">
            {neutralShades.map((shade) => (
              <div key={shade} className="flex flex-col items-center gap-1">
                <div
                  className="h-10 w-12 rounded-vita-sm border border-vita-neutral-200"
                  style={{ background: `var(--vita-neutral-${shade})` }}
                />
                <span className="text-xs text-vita-neutral-500">{shade}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-vita-neutral-800">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-3">
            <ButtonRoot variant="primary">Primary</ButtonRoot>
            <ButtonRoot variant="secondary">Secondary</ButtonRoot>
            <ButtonRoot variant="tertiary">Tertiary</ButtonRoot>
            <ButtonRoot variant="outline">Outline</ButtonRoot>
            <ButtonRoot variant="ghost">Ghost</ButtonRoot>
            <ButtonRoot variant="danger">Danger</ButtonRoot>
            <ButtonRoot variant="danger-soft">Danger Soft</ButtonRoot>
            <ButtonRoot isDisabled>Disabled</ButtonRoot>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonRoot variant="primary" size="sm">
              Small
            </ButtonRoot>
            <ButtonRoot variant="primary" size="md">
              Medium
            </ButtonRoot>
            <ButtonRoot variant="primary" size="lg">
              Large
            </ButtonRoot>
          </div>
        </section>

        {/* Chips */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-vita-neutral-800">Chips</h2>
          <div className="flex flex-wrap gap-3">
            <ChipRoot color="accent" variant="primary">
              Accent
            </ChipRoot>
            <ChipRoot color="success" variant="primary">
              Success
            </ChipRoot>
            <ChipRoot color="warning" variant="primary">
              Warning
            </ChipRoot>
            <ChipRoot color="danger" variant="primary">
              Danger
            </ChipRoot>
            <ChipRoot color="default" variant="primary">
              Default
            </ChipRoot>
          </div>
          <div className="flex flex-wrap gap-3">
            <ChipRoot color="accent" variant="secondary">
              Secondary
            </ChipRoot>
            <ChipRoot color="accent" variant="soft">
              Soft
            </ChipRoot>
            <ChipRoot color="accent" variant="tertiary">
              Tertiary
            </ChipRoot>
          </div>
        </section>

        <Separator />

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-vita-neutral-800">Cards</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(["Orders", "Revenue", "Inventory"] as const).map((title, i) => (
              <CardRoot key={title} className="shadow-vita-sm">
                <CardHeader>
                  <span className="text-sm font-medium text-vita-neutral-500">
                    {title}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-vita-neutral-900">
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

        {/* Typography */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-vita-neutral-800">
            Typography
          </h2>
          <p className="text-4xl font-bold text-vita-neutral-900">
            Heading 4xl
          </p>
          <p className="text-2xl font-semibold text-vita-neutral-800">
            Heading 2xl
          </p>
          <p className="text-xl font-medium text-vita-neutral-700">
            Heading xl
          </p>
          <p className="text-base text-vita-neutral-600">
            Body — base size, neutral 600
          </p>
          <p className="text-sm text-vita-neutral-500">Small — neutral 500</p>
          <p className="text-xs text-vita-neutral-400">
            Extra small — neutral 400
          </p>
          <p className="font-vita-mono text-sm text-vita-neutral-700">
            Mono: const token = useThemeStore.getState().tokens.accent;
          </p>
        </section>

        {/* Radii */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-vita-neutral-800">Radii</h2>
          <div className="flex flex-wrap gap-4">
            {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((r) => (
              <div
                key={r}
                className="flex h-14 w-14 items-center justify-center bg-vita-accent text-xs text-white shadow-vita-md"
                style={{ borderRadius: THEME.radii[r] }}
              >
                {r}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
