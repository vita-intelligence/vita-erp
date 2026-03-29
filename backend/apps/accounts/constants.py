"""
Accounts constants — single source of truth for fixed values.

Import from here everywhere (models, serializers, views, services).
Only central auth concerns here — org-specific constants live in the org app.
"""

# ── Audit Log Actions ────────────────────────────────────────────────────────
# Used as the `action` field in AuditLog. Plain strings, not an enum —
# new actions can be added without migrations.

AUDIT_LOGIN = "login"
AUDIT_LOGIN_FAILED = "login_failed"
AUDIT_LOGOUT = "logout"
AUDIT_REGISTER = "register"
AUDIT_PASSWORD_CHANGED = "password_changed"
AUDIT_PASSWORD_RESET_REQUESTED = "password_reset_requested"
AUDIT_PASSWORD_RESET_COMPLETED = "password_reset_completed"
AUDIT_EMAIL_CHANGED = "email_changed"
AUDIT_EMAIL_VERIFIED = "email_verified"
AUDIT_SESSION_REVOKED = "session_revoked"
AUDIT_ALL_SESSIONS_REVOKED = "all_sessions_revoked"
AUDIT_ACCOUNT_DEACTIVATED = "account_deactivated"
