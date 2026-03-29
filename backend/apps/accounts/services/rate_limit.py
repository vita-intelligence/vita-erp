"""
Rate limiting — multi-layer brute force protection.

Layer 1: IP + email — stops basic brute force from a single IP
Layer 2: Email-only — stops distributed attacks (IP rotation) targeting one account
Layer 3: IP-only — stops credential stuffing (one IP, many emails)

Uses Django's cache framework (in-memory for dev, Redis for prod).
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from django.core.cache import cache

if TYPE_CHECKING:
    from django.http import HttpRequest

# ── Configuration ────────────────────────────────────────────────────────────

# Login: per IP+email (basic brute force)
MAX_LOGIN_ATTEMPTS_PER_IP_EMAIL = 5
LOCKOUT_SECONDS_IP_EMAIL = 15 * 60  # 15 minutes

# Login: per email regardless of IP (distributed attack on one account)
MAX_LOGIN_ATTEMPTS_PER_EMAIL = 10
LOCKOUT_SECONDS_EMAIL = 30 * 60  # 30 minutes

# Login: per IP regardless of email (credential stuffing)
MAX_LOGIN_ATTEMPTS_PER_IP = 20
LOCKOUT_SECONDS_IP = 15 * 60  # 15 minutes

# Registration: per IP
MAX_REGISTER_ATTEMPTS = 3
REGISTER_COOLDOWN_SECONDS = 60 * 60  # 1 hour

# Password reset: per IP
MAX_PASSWORD_RESET_ATTEMPTS = 3
PASSWORD_RESET_COOLDOWN_SECONDS = 60 * 60  # 1 hour


def _get_client_ip(request: HttpRequest) -> str:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


# ── Login Rate Limiting (3 layers) ───────────────────────────────────────────


def check_login_allowed(request: HttpRequest, email: str = "") -> bool:
    """
    Return True if login attempt is allowed.
    Checks all three layers — fails if ANY layer is exceeded.
    """
    ip = _get_client_ip(request)
    email_lower = email.lower()

    # Layer 1: IP + email
    key_ip_email = f"rate_limit:login:ip_email:{ip}:{email_lower}"
    if cache.get(key_ip_email, 0) >= MAX_LOGIN_ATTEMPTS_PER_IP_EMAIL:
        return False

    # Layer 2: email only (catches IP rotation)
    if email_lower:
        key_email = f"rate_limit:login:email:{email_lower}"
        if cache.get(key_email, 0) >= MAX_LOGIN_ATTEMPTS_PER_EMAIL:
            return False

    # Layer 3: IP only (catches credential stuffing)
    key_ip = f"rate_limit:login:ip:{ip}"
    return cache.get(key_ip, 0) < MAX_LOGIN_ATTEMPTS_PER_IP


def record_login_attempt(request: HttpRequest, email: str = "") -> None:
    """Record a failed login attempt across all three layers."""
    ip = _get_client_ip(request)
    email_lower = email.lower()

    # Layer 1: IP + email
    key_ip_email = f"rate_limit:login:ip_email:{ip}:{email_lower}"
    attempts = cache.get(key_ip_email, 0) + 1
    cache.set(key_ip_email, attempts, LOCKOUT_SECONDS_IP_EMAIL)

    # Layer 2: email only
    if email_lower:
        key_email = f"rate_limit:login:email:{email_lower}"
        attempts = cache.get(key_email, 0) + 1
        cache.set(key_email, attempts, LOCKOUT_SECONDS_EMAIL)

    # Layer 3: IP only
    key_ip = f"rate_limit:login:ip:{ip}"
    attempts = cache.get(key_ip, 0) + 1
    cache.set(key_ip, attempts, LOCKOUT_SECONDS_IP)


def clear_login_attempts(request: HttpRequest, email: str = "") -> None:
    """Clear login attempts after successful login."""
    ip = _get_client_ip(request)
    email_lower = email.lower()

    cache.delete(f"rate_limit:login:ip_email:{ip}:{email_lower}")
    # Don't clear email-only or IP-only — a successful login for one
    # account shouldn't reset the counter for attacks on other accounts


# ── Registration Rate Limiting ───────────────────────────────────────────────


def check_register_allowed(request: HttpRequest) -> bool:
    """Return True if registration is allowed from this IP."""
    ip = _get_client_ip(request)
    key = f"rate_limit:register:{ip}"
    return cache.get(key, 0) < MAX_REGISTER_ATTEMPTS


def record_register_attempt(request: HttpRequest) -> None:
    """Record a registration attempt."""
    ip = _get_client_ip(request)
    key = f"rate_limit:register:{ip}"
    attempts = cache.get(key, 0) + 1
    cache.set(key, attempts, REGISTER_COOLDOWN_SECONDS)


# ── Password Reset Rate Limiting ─────────────────────────────────────────────


def check_password_reset_allowed(request: HttpRequest) -> bool:
    """Return True if password reset request is allowed from this IP."""
    ip = _get_client_ip(request)
    key = f"rate_limit:password_reset:{ip}"
    return cache.get(key, 0) < MAX_PASSWORD_RESET_ATTEMPTS


def record_password_reset_attempt(request: HttpRequest) -> None:
    """Record a password reset attempt."""
    ip = _get_client_ip(request)
    key = f"rate_limit:password_reset:{ip}"
    attempts = cache.get(key, 0) + 1
    cache.set(key, attempts, PASSWORD_RESET_COOLDOWN_SECONDS)
