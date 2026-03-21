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
| Axios | HTTP client |
| next-intl | Internationalisation |
| Biome | Linting and formatting |

---

## Directory structure

```
frontend/
├── messages/                  ← translation files
│   ├── en/
│   │   ├── common.json
│   │   └── auth.json
│   └── {locale}/              ← same structure per language
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← minimal root shell
│   │   ├── providers.tsx      ← TanStack Query provider
│   │   ├── globals.css        ← Tailwind + HeroUI styles
│   │   └── [locale]/
│   │       ├── layout.tsx     ← locale-aware shell (NextIntlClientProvider)
│   │       └── page.tsx       ← home page
│   ├── components/
│   │   └── ui/                ← HeroUI component wrappers (one folder per component)
│   ├── config/                ← all app constants in one place
│   │   ├── app.ts             ← APP (name, theme, currency, timezone)
│   │   ├── api.ts             ← API (baseUrl)
│   │   ├── i18n.ts            ← I18N (locales, defaultLocale, namespaces)
│   │   └── index.ts           ← barrel export
│   ├── hooks/                 ← custom React hooks
│   ├── i18n/
│   │   ├── routing.ts         ← next-intl routing (reads from config/i18n.ts)
│   │   └── request.ts         ← next-intl request config (merges namespace files)
│   ├── stores/                ← Zustand stores
│   └── types/
│       └── api.ts             ← ApiResponse, PaginatedResponse, ApiError
```

---

## Config

All constants live in `src/config/`. Import from anywhere:

```ts
import { APP, API, I18N } from "@/config";
```

| Export | Contents |
|---|---|
| `APP` | `name`, `defaultTheme`, `defaultCurrency`, `defaultTimezone` |
| `API` | `baseUrl` |
| `I18N` | `locales`, `defaultLocale`, `namespaces` |

---

## Internationalisation

14 supported languages: English, Chinese, Spanish, Hindi, Arabic, French, Portuguese, Russian, German, Japanese, Korean, Italian, Turkish, Indonesian.

The URL carries the locale: `/en/dashboard`, `/zh/dashboard`, etc. The middleware (`src/proxy.ts`) handles detection and redirects.

### Using translations

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("common");
t("save") // → "Save" / "保存" / "Guardar" ...
```

### Adding a new namespace

1. Add the namespace to `I18N.namespaces` in `src/config/i18n.ts`
2. Create `messages/{locale}/{namespace}.json` for every language
3. Use it: `useTranslations("yourNamespace")`

### Adding a new language

1. Add the locale code to `I18N.locales` in `src/config/i18n.ts`
2. Create `messages/{locale}/` with all namespace files translated

---

## UI components

HeroUI components are wrapped in `src/components/ui/`. Each folder re-exports the HeroUI component and is the place to add theme/style customization logic.

```tsx
// Always import from the wrapper, not directly from @heroui/react
import { Button } from "@/components/ui/button";
```
