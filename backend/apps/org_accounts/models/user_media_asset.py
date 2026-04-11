"""
UserMediaAsset — file metadata + storage handle for one uploaded file
referenced by an OnboardingSubmission.

Why a separate model rather than just storing file paths in the
submission's `responses` JSON?

  1. We need a typed FileField/ImageField so Django + django-cleanup
     manage the actual storage backend (filesystem in dev, S3/Blob in
     prod when we wire that up later).
  2. Cleanup discipline: when the submission is updated and the new
     responses no longer reference an asset, we want to delete the
     asset row so `django-cleanup` deletes the underlying file from
     storage. A FK with ON DELETE CASCADE keeps this clean.
  3. Multiple file fields per form (profile photo + signed contract
     + ID scan, etc.) need separate rows for separate cleanup.

The submission's `responses` JSON points at an asset by id rather
than embedding URLs, so renaming the file or rotating storage
backends doesn't require rewriting the JSON blob.
"""

from __future__ import annotations

import uuid
from typing import Any

from django.db import models


def _onboarding_upload_path(instance: UserMediaAsset, filename: str) -> str:
    """Build a stable upload path that survives storage backend swaps.

    Format: onboarding/<membership_id>/<asset_id>/<original_filename>
    The asset_id segment guarantees uniqueness even if the user uploads
    two photos with the same filename.
    """
    return f"onboarding/{instance.submission.membership_id}/{instance.id}/{filename}"


class UserMediaAsset(models.Model):
    """One uploaded file attached to an onboarding submission."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    submission = models.ForeignKey(
        "org_accounts.OnboardingSubmission",
        on_delete=models.CASCADE,
        related_name="media_assets",
    )
    field_name = models.CharField(
        max_length=100,
        help_text="Form field this asset is bound to (e.g. 'profile_photo').",
    )

    file = models.FileField(upload_to=_onboarding_upload_path)
    mime_type = models.CharField(max_length=100, blank=True)
    size_bytes = models.PositiveBigIntegerField(default=0)
    original_filename = models.CharField(max_length=255, blank=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "org_accounts_user_media_asset"
        indexes = [
            models.Index(fields=["submission", "field_name"]),
        ]
        ordering = ["-uploaded_at"]

    def __str__(self) -> str:
        return f"UserMediaAsset {self.id} ({self.field_name})"

    def save(self, *args: Any, **kwargs: Any) -> None:
        # Ensure the upload_path callback sees an id even on first save.
        if not self.id:
            self.id = uuid.uuid4()
        super().save(*args, **kwargs)
