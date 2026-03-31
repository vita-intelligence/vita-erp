"""
CompanySettings service — orchestrates creation, retrieval, and updates.

All writes go through this service. Views are thin wrappers that validate
input and delegate here. Every mutation is logged to the org audit trail.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any
from uuid import UUID

from django.core.cache import cache

from apps.audit.models import AuditLog
from apps.company.models import CompanySettings
from apps.company.services.locale_defaults import get_defaults_for_country
from apps.organizations.context import get_current_org_db

if TYPE_CHECKING:
    from django.http import HttpRequest

logger = logging.getLogger(__name__)

CACHE_KEY_PREFIX = "company_settings"
CACHE_TTL = 3600  # 1 hour

# Audit action constants
AUDIT_SETTINGS_CREATED = "company_settings_created"
AUDIT_SETTINGS_UPDATED = "company_settings_updated"


def _cache_key() -> str:
    db_alias = get_current_org_db() or "default"
    return f"{CACHE_KEY_PREFIX}:{db_alias}"


def _log_audit(
    user_id: UUID,
    action: str,
    settings: CompanySettings,
    request: HttpRequest | None = None,
    metadata: dict[str, Any] | None = None,
) -> None:
    """Write an immutable entry to the org-level audit log."""
    AuditLog.objects.create(
        user_id=user_id,
        action=action,
        entity_type="CompanySettings",
        entity_id=str(settings.pk),
        ip_address=_get_client_ip(request) if request else None,
        user_agent=request.META.get("HTTP_USER_AGENT", "") if request else "",
        metadata=metadata or {},
    )


def _get_client_ip(request: HttpRequest | None) -> str | None:
    if request is None:
        return None
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _snapshot(settings: CompanySettings) -> dict[str, str]:
    """Capture all field values as a flat dict for audit purposes.

    Excludes internal metadata (id, created_at, updated_at) — only
    business-relevant settings are recorded.
    """
    excluded = {"id", "created_at", "updated_at"}
    return {
        field.name: str(getattr(settings, field.name))
        for field in settings._meta.get_fields()
        if hasattr(field, "column") and field.name not in excluded
    }


def get_settings() -> CompanySettings:
    """Retrieve the CompanySettings singleton for the current org.

    Uses cache to avoid repeated DB hits. Falls back to DB on cache miss.

    Raises:
        CompanySettings.DoesNotExist: If settings have not been created yet.
    """
    key = _cache_key()
    settings = cache.get(key)

    if settings is None:
        settings = CompanySettings.objects.get()
        cache.set(key, settings, CACHE_TTL)

    return settings


def update_settings(
    data: dict[str, Any],
    user_id: UUID,
    request: HttpRequest | None = None,
) -> CompanySettings:
    """Partially update CompanySettings with the given field values.

    Runs full validation before saving. Invalidates cache on success.
    Logs changed fields (old and new values) to the org audit trail.

    Args:
        data: Dict of field names to new values (partial update).
        user_id: UUID of the user performing the update.
        request: The current HTTP request (for audit IP/user-agent).

    Returns:
        Updated CompanySettings instance.

    Raises:
        CompanySettings.DoesNotExist: If settings have not been created yet.
        ValidationError: If the new values fail model validation.
    """
    settings = CompanySettings.objects.get()

    changes: dict[str, dict[str, Any]] = {}
    for field, new_value in data.items():
        old_value = getattr(settings, field)
        if old_value != new_value:
            changes[field] = {"old": str(old_value), "new": str(new_value)}
            setattr(settings, field, new_value)

    if not changes:
        return settings

    settings.save()
    cache.delete(_cache_key())

    _log_audit(
        user_id=user_id,
        action=AUDIT_SETTINGS_UPDATED,
        settings=settings,
        request=request,
        metadata={"changes": changes},
    )

    logger.info("CompanySettings updated: %s", list(changes.keys()))
    return settings


def create_default_settings(
    country: str = "",
    currency: str = "",
    user_id: UUID | None = None,
    request: HttpRequest | None = None,
) -> CompanySettings:
    """Create CompanySettings with locale-aware defaults.

    Called during org database provisioning, after migrations have run.
    Uses the org's country and currency to determine appropriate defaults.

    Args:
        country: ISO 3166-1 alpha-2 country code (e.g. "US", "DE").
        currency: ISO 4217 currency code (e.g. "USD", "EUR").
        user_id: UUID of the user creating the org (for audit trail).
        request: The current HTTP request (for audit IP/user-agent).

    Returns:
        Newly created CompanySettings instance.
    """
    defaults = get_defaults_for_country(country, currency)
    settings = CompanySettings(**defaults)
    settings.save()

    if user_id is not None:
        _log_audit(
            user_id=user_id,
            action=AUDIT_SETTINGS_CREATED,
            settings=settings,
            request=request,
            metadata={
                "country": country,
                "currency": currency,
                "initial_values": _snapshot(settings),
            },
        )

    logger.info(
        "CompanySettings created with defaults for country=%s, currency=%s",
        country,
        currency,
    )
    return settings
