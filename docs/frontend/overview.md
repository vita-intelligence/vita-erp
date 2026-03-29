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
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← minimal root shell
│   │   ├── providers.tsx      ← TanStack Query + Theme provider
│   │   └── [locale]/
│   │       ├── layout.tsx     ← locale-aware shell (NextIntlClientProvider)
│   │       ├── (auth)/        ← public routes (login, register, etc.)
│   │       └── (app)/         ← protected routes
│   │           ├── layout.tsx             ← AuthGuard
│   │           ├── create-organization/   ← org creation wizard (planned)
│   │           ├── select-organization/   ← org picker (planned)
│   │           └── (org)/                 ← org-scoped routes (planned)
│   │               ├── layout.tsx         ← OrgGuard
│   │               └── dashboard/
│   ├── components/
│   │   ├── ui/                ← HeroUI component wrappers (45+ components)
│   │   ├── form-constructor/  ← form schema builder + viewer
│   │   ├── rich-text-editor/  ← BlockNote WYSIWYG + Markdown code editor
│   │   ├── theme-editor/      ← live theme customization UI
│   │   └── HydrationGuard.tsx
│   ├── config/                ← all app constants (APP, API, I18N, THEME)
│   ├── stores/
│   │   ├── auth.ts            ← user state (fetched from /auth/me/)
│   │   ├── theme.ts           ← theme state (persisted to localStorage)
│   │   └── organization.ts   ← org state (planned)
│   ├── lib/
│   │   └── api.ts             ← Axios client (cookie auth, silent refresh)
│   └── types/
│       └── api.ts             ← API response types
```

---

## Auth Guard Chain (planned)

```
AuthGuard: not auth → /login | unverified → blocker | ✓ → children
  └─ OrgGuard: no orgs → /create-organization | multi → /select-organization | ✓ → children
```

---

## Stores

### Auth Store (`stores/auth.ts`)
- `user` — current user + organizations list (from `/auth/me/`)
- `isLoading`, `isAuthenticated`
- `fetchUser()`, `clearUser()`

### Organization Store (`stores/organization.ts`) — planned
- `currentOrg` — selected organization
- `selectOrganization(orgId)` — calls `/organizations/{id}/select/`, updates JWT cookies
- `clearOrganization()`

---

## Theme System

8 built-in presets. 180+ CSS custom property tokens (`--vita-*`). Theme overrides in `src/components/ui/` wrappers **must use inline styles** — HeroUI's Tailwind classes cannot be reliably overridden via CSS.

Always import UI components from `@/components/ui/`, never from `@heroui/react` directly.

**Exception:** Platform pages (auth, landing) use raw HTML + Tailwind — not org-themed.

---

## Form Constructor

Drag-and-drop form builder + live viewer. 16 field types, repeat groups, expression engine, visibility conditions, cascading selects.

---

## Rich Text Editor

BlockNote WYSIWYG + Markdown code editor. Inline or fullscreen mode.
