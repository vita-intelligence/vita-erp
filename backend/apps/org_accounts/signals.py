"""
Signals — keep cached gates in sync with onboarding form edits.

When an admin saves the org's `OnboardingForm`, every member of that
org needs `requires_onboarding` re-evaluated against the new form
definition. We do that synchronously in the same request because
form edits are rare and orgs are small in v1; the per-member
recompute is O(N_required_fields) and a 500-member org settles in
under a second.

A `post_save` hook is the right shape because the recompute needs
the saved row's `pk` and the new `definition`. Pre-save can't see
either (the row hasn't been written yet).

We can't access `Membership.organization` from inside the org DB
context because Membership lives in the central DB — the recompute
service handles the cross-DB context switching itself.
"""

from __future__ import annotations

import logging
from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.org_accounts.models import OnboardingForm

logger = logging.getLogger(__name__)


@receiver(post_save, sender=OnboardingForm)
def sync_membership_onboarding_after_form_save(
    sender: Any,
    instance: OnboardingForm,
    created: bool,
    update_fields: frozenset[str] | None = None,
    **kwargs: Any,
) -> None:
    """Re-evaluate `requires_onboarding` for every member of this org.

    The signal handler resolves the active org from the current
    tenant context (the form save happens inside an org request).
    If we can't determine the org (e.g., a management command
    saving forms in bulk without setting tenant context), the
    handler logs a warning and skips — the operator can run a
    manual recompute via the management command.
    """
    from apps.org_accounts.services.onboarding import recompute_org_onboarding_status
    from apps.organizations.context import get_current_org_db
    from apps.organizations.models import Organization

    db_alias = get_current_org_db()
    if not db_alias:
        logger.debug("OnboardingForm saved with no active org context — skipping recompute")
        return

    org = Organization.objects.using("default").filter(db_name=db_alias).first()
    if org is None:
        logger.warning(
            "OnboardingForm saved but no Organization found for db_name=%s",
            db_alias,
        )
        return

    flipped = recompute_org_onboarding_status(org)
    logger.info(
        "Recomputed onboarding status for org %s — %d memberships flipped",
        org.slug,
        flipped,
    )
