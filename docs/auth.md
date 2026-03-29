# Authentication

## Overview

Vita ERP uses **cookie-based JWT** with server-side session tracking. Tokens are never exposed to JavaScript — stored in httpOnly cookies only.

## How It Works

```
Register → account created → verification email sent → auto-login
                                                        ↓
Login → validate credentials → create session → set JWT cookies
                                                 ↓
API Request → browser sends cookies automatically
           → Django reads access token from cookie
           → validates signature + expiry (no DB hit)
           → attaches user to request

Token Expired → frontend gets 401
             → Axios interceptor calls /refresh/
             → Django rotates refresh token (old one invalidated)
             → sets new cookies
             → retries original request

Logout → session deactivated → cookies cleared
```

## Token Details

| Token | Lifetime | Cookie | Path | Purpose |
|---|---|---|---|---|
| Access | 15 minutes | `vita_access` | `/api` | Stateless auth — no DB hit |
| Refresh | 30 days | `vita_refresh` | `/api/v1/auth` | Rotation — tracked in DB |

### Cookie Security

| Setting | Dev | Prod |
|---|---|---|
| `httpOnly` | Yes | Yes |
| `Secure` | No (HTTP) | Yes (HTTPS only) |
| `SameSite` | Lax | Lax |

`httpOnly` = JavaScript cannot read the cookies (prevents XSS token theft).

## Email Verification

1. User registers → `is_verified = False` → verification email sent
2. User can only access: `me/`, `logout/`, `resend-verification/`
3. All other endpoints return `403 email_not_verified`
4. User clicks verification link → `is_verified = True` → full access

In dev, the email prints to the terminal (console email backend).

## Refresh Token Rotation

Each refresh invalidates the old token and issues a new one:

```
Login        → refresh_token_v1
After 15min  → use v1 → get v2 (v1 is now dead)
After 15min  → use v2 → get v3 (v2 is now dead)
```

**Theft detection:** if someone reuses an already-rotated token:
```
Attacker uses v1 (already rotated to v2)
→ DB says v1 is already used
→ ALL sessions for this user revoked
→ user must re-login on all devices
```

## Rate Limiting

Three layers of brute force protection (Redis-backed):

| Layer | Tracks by | Limit | Lockout | Stops |
|---|---|---|---|---|
| 1 | IP + email | 5 attempts | 15 min | Basic brute force |
| 2 | Email only | 10 attempts | 30 min | IP rotation attacks |
| 3 | IP only | 20 attempts | 15 min | Credential stuffing |

Also rate limited: registration (3/hour per IP), password reset (3/hour per IP).

## Session Management

Each login creates a `Session` record with:
- Hashed refresh token (never plaintext)
- Device name (parsed from user agent)
- IP address
- Last used timestamp

Users can view and revoke sessions in security settings ("log out a specific device" or "log out everywhere").

## Audit Log

Every auth event is logged immutably:
- `login`, `login_failed`, `logout`
- `register`, `email_verified`
- `password_changed`, `email_changed`
- `session_revoked`, `all_sessions_revoked`

Each entry includes: user, action, IP, user agent, timestamp, metadata.

## 2FA (Planned)

Two-factor authentication is designed to live on the **org side** (not central DB) for GDPR compliance. Each org can configure:
- Built-in methods (TOTP, WebAuthn, recovery codes)
- Custom methods (org-defined integrations with external verification endpoints)

The org owns the 2FA secrets — the platform never sees them.

## Error Codes

The backend returns error **codes** (not human-readable messages). The frontend maps codes to translated strings.

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
| `token_required` | Missing verification token |
| `token_invalid_or_expired` | Bad or expired verification token |
| `invalid_current_password` | Wrong password on change/email update |
| `session_not_found` | Revoking non-existent session |
