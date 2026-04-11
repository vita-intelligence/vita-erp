"""
Onboarding service — submit/recompute/seed.

This module is the only place that mutates `OnboardingSubmission`.
The rules it enforces:

  1. **No orphan files.** When a submission is updated and an old
     value pointed at a `UserMediaAsset` that the new responses no
     longer reference, the asset row is deleted in the same
     transaction. `django-cleanup` then removes the file from
     storage. Files that the user selected but never submitted
     (closed the tab, refreshed the page) never reach the server.

  2. **Cached re-onboarding gate.** After every write to either the
     submission or the form definition, `Membership.requires_onboarding`
     is recomputed for the affected member(s). The auth /me/ hot path
     just reads the cached flag — never recomputes.

  3. **Singleton seeding.** New orgs get a default form with First
     Name (required), Last Name (required), Profile Photo (optional)
     pre-populated. The admin can edit, reorder, or delete those
     fields freely afterward — they're not special.

Cross-DB rules: this module runs entirely inside the active org DB
context (set by TenantMiddleware or by the caller via
`set_current_org_db`). The Membership writes hit the central DB via
`.using("default")`. We never open a transaction that spans both DBs
because Django doesn't support that.
"""

from __future__ import annotations

import logging
import uuid
from typing import Any

from django.core.files.uploadedfile import UploadedFile
from django.db import transaction
from django.utils import timezone

from apps.org_accounts.models import OnboardingForm, OnboardingSubmission, UserMediaAsset
from apps.org_accounts.services.form_walker import is_value_present, walk_fields
from apps.organizations.context import set_current_org_db
from apps.organizations.db import register_org_database
from apps.organizations.models import Membership, Organization

logger = logging.getLogger(__name__)


# ── Default form (seeded on org creation) ──────────────────────────────────


DEFAULT_FORM_DEFINITION: dict[str, Any] = {
    "version": 1,
    "name": "User onboarding",
    "description": "Information collected from every member when they join the organization.",
    "elements": [
        {
            "kind": "field",
            "id": "first_name",
            "type": "text",
            "label": "First name",
            "required": True,
            "hidden": False,
        },
        {
            "kind": "field",
            "id": "last_name",
            "type": "text",
            "label": "Last name",
            "required": True,
            "hidden": False,
        },
        {
            "kind": "field",
            "id": "profile_photo",
            "type": "image",
            "label": "Profile photo",
            "required": False,
            "hidden": False,
        },
    ],
    "settings": {},
}


def seed_default_onboarding_form(org: Organization, user_id: uuid.UUID | str | None) -> OnboardingForm:
    """Create the singleton OnboardingForm row for a fresh org.

    Idempotent — calling twice returns the existing row. Designed to
    be called from the org-provisioning code paths
    (`create_organization` and `create_org_from_checkout`).
    """
    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)
    try:
        existing = OnboardingForm.objects.using(db_alias).first()
        if existing is not None:
            return existing
        form = OnboardingForm(
            definition=DEFAULT_FORM_DEFINITION,
            version=1,
            updated_by=uuid.UUID(str(user_id)) if user_id else None,
        )
        form.save(using=db_alias)
        return form
    finally:
        from apps.organizations.context import clear_current_org_db

        clear_current_org_db()


# ── Recompute the cached gate ──────────────────────────────────────────────


def is_member_missing_required_fields(
    form_definition: dict[str, Any] | None,
    responses: dict[str, Any] | None,
) -> bool:
    """Return True iff at least one currently-required field is missing.

    Visibility rules: a field that's hidden by an unsatisfied `relevant`
    expression is treated as not required for the purposes of the
    re-onboarding gate. Visibility expressions are evaluated against
    the *current* responses (not historical), so a user who's already
    answered a chain of dependent fields stays unblocked.
    """
    responses = responses or {}
    for field in walk_fields(form_definition):
        if not field.get("required"):
            continue
        if not _is_visible(field, responses):
            continue
        field_id = field.get("id")
        if not field_id:
            continue
        if not is_value_present(responses.get(field_id)):
            return True
    return False


def _is_visible(field: dict[str, Any], responses: dict[str, Any]) -> bool:
    """Evaluate the field's visibility rule against the current responses.

    v1 supports the simplest form: a `relevant` string of the shape
    "field_name == value". Anything more complex (and/or, parens,
    function calls) is treated as visible until we wire a real
    expression evaluator. The form constructor's frontend already
    handles the full grammar; backend visibility eval here is only
    used to *exclude fields from the required check*, so being
    permissive is the safe direction (worst case: we re-prompt the
    user for an irrelevant field, which the FormViewer hides anyway
    when they reload).
    """
    relevant = field.get("relevant")
    if not isinstance(relevant, str) or not relevant.strip():
        return True

    expr = relevant.strip()
    # Match "name == 'value'" / "name == \"value\"" / "name == 123" /
    # "name == true"
    import re

    match = re.fullmatch(r"\s*([a-zA-Z_][\w-]*)\s*==\s*(.+?)\s*", expr)
    if not match:
        return True

    other_name = match.group(1)
    raw_other_value = match.group(2).strip()
    if (raw_other_value.startswith("'") and raw_other_value.endswith("'")) or (
        raw_other_value.startswith('"') and raw_other_value.endswith('"')
    ):
        expected: Any = raw_other_value[1:-1]
    elif raw_other_value.lower() in ("true", "false"):
        expected = raw_other_value.lower() == "true"
    else:
        try:
            expected = int(raw_other_value)
        except ValueError:
            try:
                expected = float(raw_other_value)
            except ValueError:
                expected = raw_other_value
    actual = responses.get(other_name)
    return bool(actual == expected)


def recompute_membership_onboarding_status(
    membership: Membership,
    *,
    db_alias: str | None = None,
) -> bool:
    """Recompute and persist `Membership.requires_onboarding`.

    Returns the new value. Call after either:
      - the user submits an `OnboardingSubmission` (we know which
        membership directly), or
      - the admin saves the org's `OnboardingForm` (call this for
        every membership in the org via
        `recompute_org_onboarding_status`).
    """
    org = membership.organization
    if db_alias is None:
        db_alias = register_org_database(org.db_name)
        set_current_org_db(db_alias)
        clear_after = True
    else:
        clear_after = False

    try:
        form = OnboardingForm.objects.using(db_alias).first()
        definition = form.definition if form else None
        submission = OnboardingSubmission.objects.using(db_alias).filter(membership_id=membership.id).first()
        responses = submission.responses if submission else {}

        new_value = is_member_missing_required_fields(definition, responses)
        if membership.requires_onboarding != new_value:
            membership.requires_onboarding = new_value
            membership.save(update_fields=["requires_onboarding"])
        return new_value
    finally:
        if clear_after:
            from apps.organizations.context import clear_current_org_db

            clear_current_org_db()


def recompute_org_onboarding_status(org: Organization) -> int:
    """Recompute `requires_onboarding` for every active member of an org.

    Returns the count of memberships whose flag actually flipped.
    Called from `OnboardingForm.save()` (admin edited the form).

    O(N members × M required fields). The plan flags this as
    synchronous-for-v1 with a TODO to move to a background task once
    orgs grow.
    """
    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)
    flipped = 0
    try:
        form = OnboardingForm.objects.using(db_alias).first()
        definition = form.definition if form else None

        memberships = list(Membership.objects.using("default").filter(organization=org, is_active=True))
        # Pre-fetch all submissions in one query — avoids N+1 across many members.
        submissions = {
            sub.membership_id: sub.responses
            for sub in OnboardingSubmission.objects.using(db_alias).filter(
                membership_id__in=[m.id for m in memberships]
            )
        }

        for membership in memberships:
            responses = submissions.get(membership.id, {})
            new_value = is_member_missing_required_fields(definition, responses)
            if membership.requires_onboarding != new_value:
                membership.requires_onboarding = new_value
                membership.save(update_fields=["requires_onboarding"])
                flipped += 1
        return flipped
    finally:
        from apps.organizations.context import clear_current_org_db

        clear_current_org_db()


# ── Submission write path ──────────────────────────────────────────────────


def submit_onboarding(
    *,
    membership: Membership,
    responses: dict[str, Any],
    files: dict[str, UploadedFile],
) -> OnboardingSubmission:
    """Create or update the member's onboarding submission.

    `responses` is the JSON payload submitted by the form (with
    file fields holding placeholder/null/old-asset references —
    `files` carries the actual binary uploads keyed by field name).

    The write happens in three steps inside one transaction on the
    org DB:

      1. Load existing submission + assets (if any).
      2. For each new file: create UserMediaAsset → write to storage
         → replace the field's value in `responses` with a media
         reference dict.
      3. Diff old vs new responses. For every field whose old value
         was a media reference and whose new value either points at
         a different asset or doesn't reference media at all, delete
         the old `UserMediaAsset` row. `django-cleanup` removes the
         underlying file in `post_delete`.

    Then upsert the submission row, recompute the member's
    `requires_onboarding` flag, stamp `onboarding_completed_at` if
    this is the first successful submission, and return the saved
    submission.
    """
    org = membership.organization
    db_alias = register_org_database(org.db_name)
    set_current_org_db(db_alias)

    try:
        form = OnboardingForm.objects.using(db_alias).first()
        if form is None:
            # Auto-seed if missing — keeps the API resilient if an org
            # was created before this feature shipped.
            form = seed_default_onboarding_form(org, membership.user_id)
        form_definition = form.definition

        with transaction.atomic(using=db_alias):
            existing = OnboardingSubmission.objects.using(db_alias).filter(membership_id=membership.id).first()
            old_responses: dict[str, Any] = dict(existing.responses) if existing else {}

            # Materialize the submission row up front so file uploads can
            # link to it (UserMediaAsset.submission FK).
            if existing is None:
                submission = OnboardingSubmission(
                    membership_id=membership.id,
                    form_version=form.version,
                    responses={},
                )
                submission.save(using=db_alias)
            else:
                submission = existing

            new_responses = _materialize_uploads(
                submission=submission,
                responses=responses,
                files=files,
                form_definition=form_definition,
                db_alias=db_alias,
            )

            _delete_orphaned_assets(
                submission=submission,
                old_responses=old_responses,
                new_responses=new_responses,
                db_alias=db_alias,
            )

            submission.responses = new_responses
            submission.form_version = form.version
            submission.save(using=db_alias)

        # Update the central-DB membership outside the org-DB transaction
        # (Django doesn't support cross-DB atomic blocks).
        new_requires = is_member_missing_required_fields(form_definition, new_responses)
        update_fields: list[str] = []
        if membership.requires_onboarding != new_requires:
            membership.requires_onboarding = new_requires
            update_fields.append("requires_onboarding")
        if not new_requires and membership.onboarding_completed_at is None:
            membership.onboarding_completed_at = timezone.now()
            membership.onboarding_form_version_at_completion = form.version
            update_fields.extend(["onboarding_completed_at", "onboarding_form_version_at_completion"])
        if update_fields:
            membership.save(update_fields=update_fields)

        return submission
    finally:
        from apps.organizations.context import clear_current_org_db

        clear_current_org_db()


def _materialize_uploads(
    *,
    submission: OnboardingSubmission,
    responses: dict[str, Any],
    files: dict[str, UploadedFile],
    form_definition: dict[str, Any],
    db_alias: str,
) -> dict[str, Any]:
    """Create UserMediaAsset rows for every uploaded file and rewrite
    the matching keys in `responses` to point at them by asset id."""
    new_responses = dict(responses)

    file_field_ids = {
        field.get("id")
        for field in walk_fields(form_definition)
        if field.get("type") in ("file", "image", "signature") and field.get("id")
    }

    for field_id, uploaded in files.items():
        if field_id not in file_field_ids:
            logger.warning(
                "Ignoring upload for unknown field %s on submission %s",
                field_id,
                submission.id,
            )
            continue
        asset = UserMediaAsset(
            submission=submission,
            field_name=field_id,
            mime_type=getattr(uploaded, "content_type", "") or "",
            size_bytes=getattr(uploaded, "size", 0) or 0,
            original_filename=getattr(uploaded, "name", "") or "",
        )
        asset.file.save(uploaded.name or "upload.bin", uploaded, save=False)
        asset.save(using=db_alias)
        new_responses[field_id] = {"type": "media", "asset_id": str(asset.id)}

    return new_responses


def _delete_orphaned_assets(
    *,
    submission: OnboardingSubmission,
    old_responses: dict[str, Any],
    new_responses: dict[str, Any],
    db_alias: str,
) -> None:
    """Delete UserMediaAsset rows that the new responses no longer
    reference. `django-cleanup` removes the file from storage on
    `post_delete`."""
    old_asset_ids = _extract_media_asset_ids(old_responses)
    new_asset_ids = _extract_media_asset_ids(new_responses)
    orphan_ids = old_asset_ids - new_asset_ids
    if not orphan_ids:
        return
    UserMediaAsset.objects.using(db_alias).filter(
        submission=submission,
        id__in=orphan_ids,
    ).delete()


def _extract_media_asset_ids(responses: dict[str, Any]) -> set[uuid.UUID]:
    ids: set[uuid.UUID] = set()
    for value in responses.values():
        if isinstance(value, dict) and value.get("type") == "media":
            asset_id = value.get("asset_id")
            if asset_id:
                try:
                    ids.add(uuid.UUID(str(asset_id)))
                except (ValueError, TypeError):
                    continue
    return ids
