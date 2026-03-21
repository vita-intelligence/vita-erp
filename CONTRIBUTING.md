# Contributing to Vita ERP

## Branch Naming

Every branch must be prefixed with its type:

| Prefix | Use for |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `improve/` | Enhancement to existing functionality |
| `task/` | Technical work — setup, refactoring, tooling, migrations |
| `docs/` | Documentation only |
| `hotfix/` | Urgent production fix |

**Format:** `<prefix>/<short-description-in-kebab-case>`

```
feat/user-authentication
fix/invoice-total-calculation
task/setup-docker-compose
improve/stock-list-performance
```

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:**
```
<type>(<scope>): <short description>

[optional body]

[optional footer — e.g. Closes #123]
```

### Types

| Type | Use for |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `improve` | An improvement to existing functionality |
| `task` | Technical work with no user-facing change |
| `docs` | Documentation changes only |
| `test` | Adding or updating tests |
| `refactor` | Code restructure without behavior change |
| `chore` | Dependency updates, config changes |
| `revert` | Reverting a previous commit |

### Scope

The scope is optional but recommended — use the area of the app affected:

```
feat(auth): add TOTP two-factor authentication
fix(invoices): correct tax rounding on line items
task(docker): add redis service to compose file
improve(stock): optimize lot availability query
```

### Rules

- Use **imperative mood** in the description: `add`, `fix`, `update` — not `added`, `fixed`, `updated`
- Keep the first line **under 72 characters**
- Reference issues in the footer: `Closes #42`, `Related to #17`
- One logical change per commit — do not mix unrelated changes

### Examples

```
feat(auth): add JWT refresh token rotation

Implements silent token refresh using httpOnly cookies.
Access token expires in 15m, refresh token in 7d.

Closes #12
```

```
fix(production): prevent double-booking of stock lots

select_for_update() was missing on the booking query,
causing race conditions under concurrent requests.

Closes #38
```

```
task(ci): add GitHub Actions pipeline for linting and tests
```

---

## Pull Requests

- One PR per logical concern — do not mix features, fixes, and refactors
- Fill out the PR template completely
- Link every related issue with `Closes #<number>`
- Keep PRs small and focused — easier to review, faster to merge
- Do not merge your own PR without review (unless working solo and explicitly noted)

---

## Issues

Use the correct issue template:
- **Bug** — something is broken
- **Feature** — new capability
- **Improvement** — making something better
- **Task** — technical work

Apply labels and link to the appropriate GitHub Project board column.
