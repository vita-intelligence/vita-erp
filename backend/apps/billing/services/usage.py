"""
Usage calculation services — pure read-only functions that turn RBAC
state and DB size into billing quantities.

These functions have no side effects. They're consumed by:
- The daily usage reporter (`manage.py report_usage_to_stripe`)
- The Billing tab read API (`/api/v1/billing/usage/`, `/breakdown/`)
- The storage enforcement middleware

All monetary values are integer pence. Storage values are integer bytes
unless a `_gb` variant is explicitly requested.

Cross-DB note: Memberships live in the central DB. Roles, role permissions,
and user-role assignments live in the org DB. PermissionPrice lives in the
central DB. This module switches DB contexts where needed and reads both
sides in the same call.
"""

from __future__ import annotations

import logging
import math
from dataclasses import dataclass, field
from uuid import UUID

from django.db import connection, connections

from apps.billing.models import BillingConfig, PermissionPrice
from apps.organizations.db import register_org_database
from apps.organizations.models import Membership, Organization
from apps.rbac.constants import ROLE_OWNER
from apps.rbac.models import Role, RolePermission, UserRole

logger = logging.getLogger(__name__)


# ── Result types ────────────────────────────────────────────────────────────


@dataclass
class UserCostLine:
    """One line in the per-user breakdown shown in the billing tab."""

    user_id: str
    email: str
    total_pence: int = 0
    permissions: list[tuple[str, str, int]] = field(default_factory=list)
    """List of (module_code, action, price_pence)."""


@dataclass
class BillingBreakdown:
    """Complete breakdown for the Billing tab."""

    base_price_pence: int
    user_cost_total_pence: int
    storage_quota_gb: int
    storage_minimum_gb: int
    storage_price_per_gb_pence: int
    storage_used_bytes: int
    storage_cost_pence: int
    grand_total_pence: int
    currency: str
    users: list[UserCostLine] = field(default_factory=list)


# ── Price lookups ───────────────────────────────────────────────────────────


def get_permission_price_map() -> dict[tuple[str, str], int]:
    """Load all PermissionPrice rows into a fast in-memory lookup.

    Keyed by (module_code, action). Missing pairs return 0 via .get()
    so adding a new module to RBAC before seeding a price doesn't crash
    the billing pipeline — the permission just doesn't cost anything yet.
    """
    return {(p.module_code, p.action): p.price_pence for p in PermissionPrice.objects.all()}


# ── Per-user cost ───────────────────────────────────────────────────────────


def get_user_cost_pence(user_id: str | UUID, org: Organization) -> int:
    """Sum the price of every permission this user holds in the given org.

    Permissions held via multiple roles are counted only once. Pulls
    role-permission pairs from the org DB, then looks up PermissionPrice
    in the central DB and sums matching rows.
    """
    price_map = get_permission_price_map()
    user_permissions = _get_user_permissions_in_org(user_id, org)
    return sum(price_map.get(perm, 0) for perm in user_permissions)


def _get_user_permissions_in_org(user_id: str | UUID, org: Organization) -> set[tuple[str, str]]:
    """Return a deduplicated set of (module_code, action) permissions held
    by the given user within the given org.

    Owner billing rule:
    - The organization's creator (`org.created_by`) is the primary owner
      and is free — returns an empty set regardless of roles.
    - Any other user holding the Owner role is a secondary owner and is
      charged for the full PermissionPrice catalog (Owner grants access
      to everything, so billing mirrors that).
    """
    db_alias = register_org_database(org.db_name)

    # Fetch the role IDs assigned to this user in the org DB
    role_ids = list(
        UserRole.objects.using(db_alias).filter(user_id=str(user_id)).values_list("role_id", flat=True),
    )
    if not role_ids:
        return set()

    is_owner = (
        Role.objects.using(db_alias)
        .filter(
            id__in=role_ids,
            is_system=True,
            name=ROLE_OWNER,
        )
        .exists()
    )

    if is_owner:
        # Primary owner — the person whose card pays the subscription — is free.
        if org.created_by_id is not None and str(org.created_by_id) == str(user_id):
            return set()
        # Secondary owner — full access, full charge.
        return set(PermissionPrice.objects.values_list("module_code", "action"))

    # Fetch all permissions across those roles, deduped
    pairs = RolePermission.objects.using(db_alias).filter(role_id__in=role_ids).values_list("module_code", "action")
    return {(module, action) for module, action in pairs}


# ── Org-wide user cost ──────────────────────────────────────────────────────


def get_org_total_user_cost_pence(org: Organization) -> int:
    """Sum per-user costs across every active member of the org."""
    price_map = get_permission_price_map()
    total = 0
    for membership in Membership.objects.filter(organization=org, is_active=True).select_related("user"):
        user_permissions = _get_user_permissions_in_org(membership.user_id, org)
        total += sum(price_map.get(perm, 0) for perm in user_permissions)
    return total


# ── Storage ─────────────────────────────────────────────────────────────────


def get_storage_usage_bytes(org: Organization) -> int:
    """Return the current on-disk size of the org's PostgreSQL database
    in bytes. Returns 0 on non-Postgres backends (SQLite in tests)."""
    if connection.vendor != "postgresql":
        return 0

    default_conn = connections["default"]
    default_conn.ensure_connection()
    with default_conn.cursor() as cursor:
        cursor.execute("SELECT pg_database_size(%s)", [org.db_name])
        row = cursor.fetchone()
        return int(row[0]) if row else 0


def get_storage_usage_gb(org: Organization) -> int:
    """Storage usage rounded UP to whole GB — the unit storage is billed in."""
    bytes_used = get_storage_usage_bytes(org)
    if bytes_used <= 0:
        return 0
    return max(1, math.ceil(bytes_used / (1024**3)))


def get_storage_quota_gb(org: Organization) -> int:
    """The storage ceiling the org is paying for. Falls back to the
    BillingConfig minimum if no subscription exists yet."""
    sub = getattr(org, "subscription", None)
    if sub is None:
        return BillingConfig.load().storage_minimum_gb
    return int(sub.storage_quota_gb)


def is_storage_quota_exceeded(org: Organization) -> bool:
    """Check whether on-disk size has exceeded the paid quota."""
    quota_bytes = get_storage_quota_gb(org) * (1024**3)
    return get_storage_usage_bytes(org) > quota_bytes


# ── Full breakdown ──────────────────────────────────────────────────────────


def get_billing_breakdown(org: Organization) -> BillingBreakdown:
    """Full breakdown consumed by the Billing tab `/breakdown/` endpoint.

    Returns everything needed to render the plan card, usage bars, and the
    per-user cost table without any further DB round-trips.
    """
    cfg = BillingConfig.load()
    price_map = get_permission_price_map()

    # Per-user breakdown
    user_lines: list[UserCostLine] = []
    user_cost_total = 0
    for membership in (
        Membership.objects.filter(organization=org, is_active=True).select_related("user").order_by("joined_at")
    ):
        permissions = _get_user_permissions_in_org(membership.user_id, org)
        lines: list[tuple[str, str, int]] = []
        user_total = 0
        for module_code, action in sorted(permissions):
            price = price_map.get((module_code, action), 0)
            lines.append((module_code, action, price))
            user_total += price
        user_lines.append(
            UserCostLine(
                user_id=str(membership.user_id),
                email=getattr(membership.user, "email", ""),
                total_pence=user_total,
                permissions=lines,
            ),
        )
        user_cost_total += user_total

    # Storage
    storage_quota_gb = get_storage_quota_gb(org)
    storage_used_bytes = get_storage_usage_bytes(org)
    billable_gb = max(0, storage_quota_gb - cfg.storage_minimum_gb)
    storage_cost_pence = billable_gb * cfg.storage_price_per_gb_pence

    return BillingBreakdown(
        base_price_pence=cfg.base_price_pence,
        user_cost_total_pence=user_cost_total,
        storage_quota_gb=storage_quota_gb,
        storage_minimum_gb=cfg.storage_minimum_gb,
        storage_price_per_gb_pence=cfg.storage_price_per_gb_pence,
        storage_used_bytes=storage_used_bytes,
        storage_cost_pence=storage_cost_pence,
        grand_total_pence=cfg.base_price_pence + user_cost_total + storage_cost_pence,
        currency=cfg.currency,
        users=user_lines,
    )
