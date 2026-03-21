"use client";

import { ButtonRoot } from "@/components/ui/button";
import { CardContent, CardHeader, CardRoot } from "@/components/ui/card";
import { ChipRoot } from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
import { BRAND_COLOR_META, THEME } from "@/config";
import { useThemeStore } from "@/stores/theme";

const neutralShades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export default function DesignSystemPage() {
  const { mode, setMode, setTokens } = useThemeStore();

  return (
    <main className="min-h-screen bg-vita-neutral-50 p-8 font-vita-sans">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header + mode switcher */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-vita-neutral-900">
              Brand & Theme
            </h1>
            <p className="mt-1 text-vita-neutral-500">
              Customise the look of your Vita ERP to match your company brand.
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
          </div>
        </div>

        <Separator />

        {/* Brand color constructor */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-vita-neutral-800">
              Brand colors
            </h2>
            <p className="text-sm text-vita-neutral-500">
              Editing <span className="font-medium capitalize">{mode}</span>{" "}
              mode. Switch modes above to set different colors for light and
              dark.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {BRAND_COLOR_META.map(({ key, label, description }) => (
              <label
                key={key}
                className="group flex cursor-pointer flex-col gap-2 rounded-vita-lg border border-vita-neutral-200 bg-vita-neutral-50 p-4 transition-shadow hover:shadow-vita-sm"
              >
                {/* Live swatch */}
                <div
                  className="h-14 w-full rounded-vita-md shadow-vita-xs"
                  style={{ background: `var(--vita-${key})` }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-vita-neutral-800">
                      {label}
                    </p>
                    <p className="text-xs text-vita-neutral-400">
                      {description}
                    </p>
                  </div>
                  {/* Color picker */}
                  <input
                    type="color"
                    title={`Change ${label} color`}
                    className="h-8 w-8 cursor-pointer rounded-vita-sm border border-vita-neutral-200"
                    onChange={(e) =>
                      setTokens({ [key]: e.target.value } as Parameters<
                        typeof setTokens
                      >[0])
                    }
                  />
                </div>
              </label>
            ))}
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

        {/* Component preview */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-vita-neutral-800">
            Component preview
          </h2>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Buttons
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonRoot variant="primary">Primary</ButtonRoot>
              <ButtonRoot variant="secondary">Secondary</ButtonRoot>
              <ButtonRoot variant="tertiary">Tertiary</ButtonRoot>
              <ButtonRoot variant="outline">Outline</ButtonRoot>
              <ButtonRoot variant="ghost">Ghost</ButtonRoot>
              <ButtonRoot variant="danger">Error</ButtonRoot>
              <ButtonRoot variant="danger-soft">Error Soft</ButtonRoot>
              <ButtonRoot isDisabled>Disabled</ButtonRoot>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Status chips
            </p>
            <div className="flex flex-wrap gap-3">
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
                Accent Soft
              </ChipRoot>
              <ChipRoot color="success" variant="soft">
                Success Soft
              </ChipRoot>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-vita-neutral-400">
              Cards
            </p>
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
          <p className="text-base text-vita-neutral-600">Body — base size</p>
          <p className="text-sm text-vita-neutral-500">Small — neutral 500</p>
          <p className="text-xs text-vita-neutral-400">
            Extra small — neutral 400
          </p>
        </section>

        {/* Radii */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-vita-neutral-800">
            Border radii
          </h2>
          <div className="flex flex-wrap gap-4">
            {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((r) => (
              <div
                key={r}
                className="flex h-14 w-14 items-center justify-center bg-vita-primary text-xs text-white shadow-vita-md"
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
