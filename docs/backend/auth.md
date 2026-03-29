# Authentication

## Overview

Cookie-based JWT with server-side session tracking. Tokens are never exposed to JavaScript — stored in httpOnly cookies only.

## How It Works

```
Register → account created → verification email sent → auto-login
                                                        ↓
Login → validate credentials → create session → set JWT cookies
                                                 ↓
API Request → browser sends cookies automatically
           → Django reads access token from cookie
           → TenantMiddleware checks org_id claim → sets DB context
           → validates signature + expiry (no DB hit)
           → attaches user to request

Token Expired → frontend gets 401
             → Axios interceptor calls /refresh/
             → Django rotates refresh token (old one invalidated)
             → org_id claim preserved in new tokens
             → sets new cookies → retries original request

Logout → session deactivated → cookies cleared
```

## Token Details

| Token | Lifetime | Cookie | Path | Purpose |
|---|---|---|---|---|
| Access | 15 minutes | `vita_access` | `/api` | Stateless auth — no DB hit |
| Refresh | 30 days | `vita_refresh` | `/api/v1/auth` | Rotation — tracked in DB |

### JWT Claims

| Claim | Always present | When added |
|---|---|---|
| `user_id` | Yes | On login |
| `org_id` | No | After org selection (`POST /organizations/{id}/select/`) |

The `org_id` claim is read by `TenantMiddleware` to set the database context. Tokens without `org_id` operate on the central DB only.

### Cookie Security

| Setting | Dev | Prod |
|---|---|---|
| `httpOnly` | Yes | Yes |
| `Secure` | No (HTTP) | Yes (HTTPS only) |
| `SameSite` | Lax | Lax |

## Email Verification

1. User registers → `is_verified = False` → verification email sent
2. User can only access: `me/`, `logout/`, `resend-verification/`
3. All other endpoints return `403 email_not_verified`
4. User clicks verification link → `is_verified = True` → full access

In dev, the email prints to the terminal (console email backend).

## Refresh Token Rotation

Each refresh invalidates the old token and issues a new one. The `org_id` claim is preserved across rotations.

**Theft detection:** if someone reuses an already-rotated token, ALL sessions for the user are revoked.

## Rate Limiting

Three layers of brute force protection (Redis-backed):

| Layer | Tracks by | Limit | Lockout | Stops |
|---|---|---|---|---|
| 1 | IP + email | 5 attempts | 15 min | Basic brute force |
| 2 | Email only | 10 attempts | 30 min | IP rotation attacks |
| 3 | IP only | 20 attempts | 15 min | Credential stuffing |

Also rate limited: registration (3/hour per IP), password reset (3/hour per IP).

## Session Management

Each login creates a `Session` record with hashed refresh token, device name, IP, and timestamps. Users can view and revoke sessions.

## Audit Log

Platform-level auth events are logged to `platform_audit.AuditLog` (central DB). Org-level actions are logged to `audit.AuditLog` (org DB).

Platform audit events: `login`, `login_failed`, `logout`, `register`, `email_verified`, `password_changed`, `email_changed`, `session_revoked`, `all_sessions_revoked`, `org_created`, `member_added`, `member_removed`, `subscription_created`.

## Error Codes

| Code | When |
|---|---|
| `email_taken` | Registration with existing email |
| `invalid_credentials` | Wrong email or password |
| `account_disabled` | Deactivated account |
| `email_not_verified` | Accessing verified-only endpoint |
| `rate_limited` | Too many attempts |
| `refresh_token_missing` | No refresh cookie |
| `refresh_token_invalid` | Expired or malformed token |
| `refresh_token_reused` | Theft detected — all sessions revoked |
| `no_org_selected` | Accessing org-scoped endpoint without org context |
| `not_a_member` | No active membership for the org |
| `org_not_accessible` | Org is suspended or deactivated |
| `max_orgs_reached` | User hit the org creation limit (3) |
| `slug_taken` | Organization slug already in use |
| `slug_reserved` | Slug is a reserved word |
