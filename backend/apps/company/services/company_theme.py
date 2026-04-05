"""
CompanyTheme service — orchestrates retrieval, creation, and updates.

All writes go through this service. Views are thin wrappers that validate
input and delegate here. Every mutation is logged to the org audit trail
with flattened <mode>.<token> keys so reviewers can see exactly which
tokens changed and what their previous values were.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any
from uuid import UUID

from django.core.cache import cache

from apps.audit.models import AuditLog
from apps.company.models import CompanyTheme
from apps.organizations.context import get_current_org_db

if TYPE_CHECKING:
    from django.http import HttpRequest

logger = logging.getLogger(__name__)

CACHE_KEY_PREFIX = "company_theme"
CACHE_TTL = 3600  # 1 hour

# Audit action constants
AUDIT_THEME_CREATED = "company_theme_created"
AUDIT_THEME_UPDATED = "company_theme_updated"

DEFAULT_ACTIVE_MODE = "light"


def _cache_key() -> str:
    db_alias = get_current_org_db() or "default"
    return f"{CACHE_KEY_PREFIX}:{db_alias}"


def _log_audit(
    user_id: UUID,
    action: str,
    theme: CompanyTheme,
    request: HttpRequest | None = None,
    metadata: dict[str, Any] | None = None,
) -> None:
    """Write an immutable entry to the org-level audit log."""
    AuditLog.objects.create(
        user_id=user_id,
        action=action,
        entity_type="CompanyTheme",
        entity_id=str(theme.pk),
        ip_address=_get_client_ip(request) if request else None,
        user_agent=request.META.get("HTTP_USER_AGENT", "") if request else "",
        metadata=metadata or {},
    )


def _get_client_ip(request: HttpRequest | None) -> str | None:
    if request is None:
        return None
    forwarded: str | None = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        ip: str = forwarded.split(",")[0].strip()
        return ip
    addr: str | None = request.META.get("REMOTE_ADDR")
    return addr


def _diff_tokens_by_mode(
    old: dict[str, dict[str, Any]],
    new: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Compute flattened <mode>.<token> diffs between old and new token maps.

    Returns {"<mode>.<token>": {"old": ..., "new": ...}, ...} for every
    token whose value changed, was added, or was removed. Modes only
    present in one side are fully enumerated.
    """
    changes: dict[str, dict[str, Any]] = {}

    all_modes = set(old.keys()) | set(new.keys())
    for mode in all_modes:
        old_mode = old.get(mode) or {}
        new_mode = new.get(mode) or {}
        all_keys = set(old_mode.keys()) | set(new_mode.keys())
        for key in all_keys:
            old_value = old_mode.get(key)
            new_value = new_mode.get(key)
            if old_value != new_value:
                changes[f"{mode}.{key}"] = {
                    "old": old_value,
                    "new": new_value,
                }
    return changes


def get_theme() -> CompanyTheme:
    """Retrieve the CompanyTheme singleton for the current org.

    Uses cache to avoid repeated DB hits. Falls back to DB on cache miss.

    Raises:
        CompanyTheme.DoesNotExist: If the theme row has not been created yet.
    """
    key = _cache_key()
    cached: CompanyTheme | None = cache.get(key)

    if cached is None:
        cached = CompanyTheme.objects.get()
        cache.set(key, cached, CACHE_TTL)

    return cached


def update_theme(
    data: dict[str, Any],
    user_id: UUID,
    request: HttpRequest | None = None,
) -> CompanyTheme:
    """Update the CompanyTheme singleton with the given values.

    Accepts partial updates: `active_mode` alone, `tokens_by_mode` alone,
    or both. `tokens_by_mode` is replaced wholesale (frontend sends the
    full map) since per-token deltas are recorded in the audit log.

    Args:
        data: Dict that may contain "active_mode" and/or "tokens_by_mode".
        user_id: UUID of the user performing the update.
        request: The current HTTP request (for audit IP/user-agent).

    Returns:
        Updated CompanyTheme instance.

    Raises:
        CompanyTheme.DoesNotExist: If the theme row has not been created yet.
        ValidationError: If the new values fail model validation.
    """
    theme = CompanyTheme.objects.get()

    metadata: dict[str, Any] = {}
    changed = False

    if "active_mode" in data:
        new_mode = data["active_mode"]
        if theme.active_mode != new_mode:
            metadata["active_mode"] = {
                "old": theme.active_mode,
                "new": new_mode,
            }
            theme.active_mode = new_mode
            changed = True

    if "tokens_by_mode" in data:
        new_tokens = data["tokens_by_mode"] or {}
        token_changes = _diff_tokens_by_mode(theme.tokens_by_mode or {}, new_tokens)
        if token_changes:
            metadata["changes"] = token_changes
            theme.tokens_by_mode = new_tokens
            changed = True

    if not changed:
        return theme

    theme.save()
    cache.delete(_cache_key())

    _log_audit(
        user_id=user_id,
        action=AUDIT_THEME_UPDATED,
        theme=theme,
        request=request,
        metadata=metadata,
    )

    logger.info(
        "CompanyTheme updated: mode=%s, token_fields=%d",
        theme.active_mode,
        len(metadata.get("changes", {})),
    )
    return theme


def create_default_theme(
    user_id: UUID | None = None,
    request: HttpRequest | None = None,
) -> CompanyTheme:
    """Create the CompanyTheme singleton with default values.

    Called during org database provisioning, after migrations have run.
    The row starts with `active_mode="light"` and an empty
    `tokens_by_mode` — the frontend treats an empty map as "use built-in
    preset tokens for every mode", so no per-token seeding is needed.

    Args:
        user_id: UUID of the user creating the org (for audit trail).
        request: The current HTTP request (for audit IP/user-agent).

    Returns:
        Newly created CompanyTheme instance.
    """
    theme = CompanyTheme(active_mode=DEFAULT_ACTIVE_MODE, tokens_by_mode={})
    theme.save()

    if user_id is not None:
        _log_audit(
            user_id=user_id,
            action=AUDIT_THEME_CREATED,
            theme=theme,
            request=request,
            metadata={"active_mode": DEFAULT_ACTIVE_MODE},
        )

    logger.info("CompanyTheme created with default active_mode=%s", DEFAULT_ACTIVE_MODE)
    return theme
