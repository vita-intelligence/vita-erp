"""
Subscription service — manages subscription lifecycle.

Handles trial status checks, subscription queries, and will serve
as the integration point for Stripe webhooks in the future.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from django.utils import timezone

from apps.billing.constants import (
    SUB_ACCESSIBLE_STATUSES,
    SUB_STATUS_CANCELED,
    SUB_STATUS_TRIALING,
)
from apps.billing.models import Subscription

if TYPE_CHECKING:
    from apps.organizations.models import Organization

logger = logging.getLogger(__name__)


def get_subscription(org: Organization) -> Subscription | None:
    """Get the active subscription for an organization."""
    return Subscription.objects.filter(organization=org).first()


def is_subscription_accessible(org: Organization) -> bool:
    """Check if the org's subscription allows access."""
    sub = get_subscription(org)
    if sub is None:
        return False

    # Auto-expire trials
    if sub.status == SUB_STATUS_TRIALING and sub.is_trial_expired:
        sub.status = SUB_STATUS_CANCELED
        sub.canceled_at = timezone.now()
        sub.save(update_fields=["status", "canceled_at", "updated_at"])
        logger.info("Trial expired for org %s", org.slug)
        return False

    return sub.status in SUB_ACCESSIBLE_STATUSES


def get_trial_days_remaining(org: Organization) -> int | None:
    """Get the number of trial days remaining. None if not on trial."""
    sub = get_subscription(org)
    if sub is None or sub.status != SUB_STATUS_TRIALING or sub.trial_end is None:
        return None

    remaining = (sub.trial_end - timezone.now()).days
    return max(0, remaining)
