"""
Auth service — token creation, cookie management, refresh rotation.

All JWT/cookie logic is centralized here. Views call these functions
and never touch tokens or cookies directly.
"""

from __future__ import annotations

import hashlib
from typing import TYPE_CHECKING, Literal

from django.conf import settings
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.constants import AUDIT_LOGIN, AUDIT_LOGOUT
from apps.accounts.models import AuditLog, Session

if TYPE_CHECKING:
    from django.http import HttpRequest, HttpResponse

    from apps.accounts.models import User


def hash_token(token: str) -> str:
    """SHA-256 hash a token for safe storage. Never store tokens in plaintext."""
    return hashlib.sha256(token.encode()).hexdigest()


def parse_device_name(user_agent: str) -> str:
    """Extract a human-readable device name from a User-Agent string."""
    ua = user_agent.lower()

    # Browser detection
    browser = "Unknown"
    if "firefox" in ua:
        browser = "Firefox"
    elif "edg" in ua:
        browser = "Edge"
    elif "chrome" in ua:
        browser = "Chrome"
    elif "safari" in ua:
        browser = "Safari"

    # OS detection
    os_name = "Unknown"
    if "windows" in ua:
        os_name = "Windows"
    elif "macintosh" in ua or "mac os" in ua:
        os_name = "MacOS"
    elif "linux" in ua:
        os_name = "Linux"
    elif "android" in ua:
        os_name = "Android"
    elif "iphone" in ua or "ipad" in ua:
        os_name = "iOS"

    return f"{browser} on {os_name}"


def get_client_ip(request: HttpRequest) -> str | None:
    """Extract client IP from request, handling proxies."""
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return str(forwarded).split(",")[0].strip()
    addr = request.META.get("REMOTE_ADDR")
    return str(addr) if addr else None


def create_tokens(user: User) -> tuple[str, str]:
    """Generate a new access + refresh token pair for a user."""
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)


def set_auth_cookies(response: HttpResponse, access_token: str, refresh_token: str) -> None:
    """Set httpOnly JWT cookies on the response."""
    secure: bool = getattr(settings, "VITA_COOKIE_SECURE", True)
    samesite: Literal["Lax", "Strict", "None", False] = getattr(settings, "VITA_COOKIE_SAMESITE", "Lax")

    response.set_cookie(
        key=settings.VITA_ACCESS_COOKIE,
        value=access_token,
        max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/api",
    )
    response.set_cookie(
        key=settings.VITA_REFRESH_COOKIE,
        value=refresh_token,
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        httponly=True,
        secure=secure,
        samesite=samesite,
        path="/api/v1/auth",
    )


def clear_auth_cookies(response: HttpResponse) -> None:
    """Remove JWT cookies from the response."""
    response.delete_cookie(settings.VITA_ACCESS_COOKIE, path="/api")
    response.delete_cookie(settings.VITA_REFRESH_COOKIE, path="/api/v1/auth")


def create_session(user: User, request: HttpRequest) -> Session:
    """Create a new session record after successful login."""
    user_agent = request.META.get("HTTP_USER_AGENT", "")
    return Session.objects.create(
        user=user,
        refresh_token_hash="",  # set after token creation
        device_name=parse_device_name(user_agent),
        ip_address=get_client_ip(request),
        user_agent=user_agent,
    )


def login_user(user: User, request: HttpRequest, response: HttpResponse) -> Session:
    """
    Full login flow:
    1. Create access + refresh tokens
    2. Create session record with hashed refresh token
    3. Set httpOnly cookies on response
    4. Log the event
    """
    access_token, refresh_token = create_tokens(user)

    session = create_session(user, request)
    session.refresh_token_hash = hash_token(refresh_token)
    session.save(update_fields=["refresh_token_hash"])

    set_auth_cookies(response, access_token, refresh_token)

    log_auth_event(user, AUDIT_LOGIN, request)

    return session


def logout_user(user: User, request: HttpRequest, response: HttpResponse) -> None:
    """
    Full logout flow:
    1. Find and deactivate the current session
    2. Clear cookies
    3. Log the event
    """
    refresh_token = request.COOKIES.get(settings.VITA_REFRESH_COOKIE)
    if refresh_token:
        token_hash = hash_token(refresh_token)
        Session.objects.filter(
            user=user,
            refresh_token_hash=token_hash,
            is_active=True,
        ).update(is_active=False)

    clear_auth_cookies(response)

    log_auth_event(user, AUDIT_LOGOUT, request)


def rotate_refresh_token(
    user: User,
    old_refresh_token: str,
    request: HttpRequest,
    response: HttpResponse,
) -> bool:
    """
    Refresh token rotation:
    1. Find session by old token hash
    2. If not found or inactive → theft detected, revoke all sessions
    3. Generate new token pair
    4. Update session with new hash
    5. Set new cookies

    Returns True on success, False on theft detection.
    """
    old_hash = hash_token(old_refresh_token)

    session = Session.objects.filter(
        user=user,
        refresh_token_hash=old_hash,
    ).first()

    if not session or not session.is_active:
        # Potential token theft — revoke everything
        Session.objects.filter(user=user, is_active=True).update(is_active=False)
        clear_auth_cookies(response)
        return False

    # Generate new tokens
    access_token, new_refresh_token = create_tokens(user)

    # Update session with new hash
    session.refresh_token_hash = hash_token(new_refresh_token)
    session.last_used_at = timezone.now()
    session.save(update_fields=["refresh_token_hash", "last_used_at"])

    set_auth_cookies(response, access_token, new_refresh_token)

    return True


def log_auth_event(
    user: User,
    action: str,
    request: HttpRequest,
    metadata: dict | None = None,
) -> AuditLog:
    """Create an immutable audit log entry for an auth event."""
    return AuditLog.objects.create(
        user=user,
        action=action,
        ip_address=get_client_ip(request),
        user_agent=request.META.get("HTTP_USER_AGENT", ""),
        metadata=metadata or {},
    )
