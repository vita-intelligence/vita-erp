# Frontend

## Stack

| Package | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework |
| React 19 | UI runtime |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| HeroUI v3 | UI component library |
| GSAP + `@gsap/react` | Animations |
| Zustand | Client-side state |
| TanStack Query | Server state / data fetching |
| React Hook Form + Zod | Form validation |
| @dnd-kit | Drag and drop |
| BlockNote | Rich text editor (WYSIWYG) |
| Axios | HTTP client |
| next-intl | Internationalisation |
| Biome | Linting and formatting |

---

## Directory structure

```
frontend/
├── messages/                  ← translation files (14 languages)
│   ├── en/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── themeEditor.json
│   │   └── formConstructor.json
│   └── {locale}/              ← same structure per language
├── tests/
│   └── form-schemas/          ← 25 JSON test schemas for form constructor
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← minimal root shell
│   │   ├── providers.tsx      ← TanStack Query + Theme provider
│   │   ├── globals.css        ← Tailwind + HeroUI + Vita token styles
│   │   └── [locale]/
│   │       ├── layout.tsx     ← locale-aware shell (NextIntlClientProvider + HydrationGuard)
│   │       ├── loading.tsx    ← route-level loading spinner
│   │       └── page.tsx       ← design system demo page
│   ├── components/
│   │   ├── ui/                ← HeroUI component wrappers (45+ components)
│   │   ├── form-constructor/  ← form schema builder + viewer
│   │   ├── rich-text-editor/  ← BlockNote WYSIWYG + Markdown code editor
│   │   ├── theme-editor/      ← live theme customization UI (25 modules, 8 presets)
│   │   └── HydrationGuard.tsx ← prevents dead clicks before JS hydrates
│   ├── config/                ← all app constants
│   │   ├── app.ts             ← APP (name, theme, currency, timezone)
│   │   ├── api.ts             ← API (baseUrl)
│   │   ├── i18n.ts            ← I18N (locales, defaultLocale, namespaces)
│   │   ├── fonts.ts           ← 50+ font options (Google Fonts metadata)
│   │   ├── theme.ts           ← THEME (radii, shadows, zIndex, duration)
│   │   ├── themes/            ← theme token system (8 presets, 180+ tokens)
│   │   └── index.ts           ← barrel export
│   ├── hooks/
│   │   └── useHydrated.ts     ← detects when React has hydrated
│   ├── i18n/
│   │   ├── routing.ts         ← next-intl routing
│   │   └── request.ts         ← next-intl request config
│   ├── stores/
│   │   └── theme.ts           ← Zustand theme store (8 presets, per-mode persistence)
│   ├── styles/
│   │   ├── tokens.css         ← --vita-* CSS variables + hydration indicator
│   │   ├── heroui.css         ← HeroUI semantic token mappings
│   │   └── components/        ← per-component CSS token overrides
│   └── types/
│       └── api.ts             ← ApiResponse, PaginatedResponse, ApiError
```

---

## Config

All constants live in `src/config/`. Import from anywhere:

```ts
import { APP, API, I18N, THEME } from "@/config";
```

| Export | Contents |
|---|---|
| `APP` | `name`, `defaultTheme`, `defaultCurrency`, `defaultTimezone` |
| `API` | `baseUrl` |
| `I18N` | `locales`, `defaultLocale`, `namespaces` |
| `THEME` | `radii`, `shadows`, `zIndex`, `duration` |

---

## Theme System

8 built-in presets: Light (brutalist B&W), Dark, Ocean Blue, Forest Green, Sunset Warm, Midnight Purple, Minimal Gray, Corporate Blue.

180+ CSS custom property tokens (`--vita-*`). Managed by Zustand store, applied at runtime via inline styles. Theme editor window persists position/size to localStorage.

Theme overrides in `src/components/ui/` wrappers **must use inline styles** — HeroUI's Tailwind-generated atomic classes cannot be reliably overridden via CSS selectors.

---

## UI Components

Always import from `@/components/ui/`, never from `@heroui/react` directly.

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/input/NativeSelect";
```

`NativeSelect` — themed `<select>` matching Input styling (appearance:none + SVG chevron + `--vita-input-*` tokens).

---

## Form Constructor

`src/components/form-constructor/` — drag-and-drop form builder + live viewer.

16 field types, repeat groups, 18-function expression engine, visibility conditions (AND/OR), cascading selects, text interpolation (`${field_id}`), per-field styling/gradients, per-field translations, rich text in labels, field appearances, form-level settings (3 layout modes), metadata fields, advanced constraints, default values.

25 test schemas in `tests/form-schemas/`.

---

## Rich Text Editor

`src/components/rich-text-editor/` — BlockNote WYSIWYG + Markdown code editor.

Inline or fullscreen mode. Content stored as BlockNote JSON. Light/dark theme support.

---

## Hydration Guard

Prevents dead clicks before JavaScript loads:

1. CSS progress bar at top (no JS needed, visible immediately)
2. HydrationGuard overlay (transparent, blocks clicks until React mounts)
3. `loading.tsx` (route-level spinner during navigation)
4. `useHydrated()` hook (component-level hydration detection)
