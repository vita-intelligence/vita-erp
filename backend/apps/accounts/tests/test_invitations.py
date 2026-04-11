"""
Integration tests for the invitation service.

These run in the test settings (single SQLite DB, no tenant router)
so the cross-DB pattern of `Membership` (central) vs `UserRole`
(tenant) collapses to one DB. The behavior we're verifying is the
*service contract* — admin-initiated create, lookup, accept, revoke,
and the email-mismatch / expiry / already-accepted edge cases.
"""

# mypy: ignore-errors

from __future__ import annotations

from datetime import timedelta

import pytest
from django.utils import timezone

from apps.accounts.models import Invitation
from apps.accounts.services.invitation import (
    accept_invitation,
    create_invitation,
    lookup_invitation_by_token,
    resend_invitation,
    revoke_invitation,
)
from apps.accounts.tests.factories import UserFactory
from apps.organizations.models import Membership
from apps.organizations.tests.factories import OrganizationFactory


@pytest.mark.django_db
class TestCreateInvitation:
    def test_create_succeeds(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, error = create_invitation(
            email="newperson@example.com",
            organization=org,
            invited_by=admin,
        )
        assert error is None
        assert invitation is not None
        assert invitation.email == "newperson@example.com"
        assert invitation.token  # auto-generated
        assert invitation.expires_at > timezone.now()
        assert invitation.is_pending

    def test_create_lowercases_email(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, _ = create_invitation(
            email="MIXED@Example.COM",
            organization=org,
            invited_by=admin,
        )
        assert invitation.email == "mixed@example.com"

    def test_create_rejects_invalid_email(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, error = create_invitation(
            email="not-an-email",
            organization=org,
            invited_by=admin,
        )
        assert invitation is None
        assert error == "email_invalid"

    def test_create_rejects_existing_active_member(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        existing = UserFactory(is_verified=True, email="member@example.com")
        Membership.objects.create(user=existing, organization=org, is_active=True)

        invitation, error = create_invitation(
            email="member@example.com",
            organization=org,
            invited_by=admin,
        )
        assert invitation is None
        assert error == "already_member"

    def test_create_rejects_duplicate_pending_invite(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        create_invitation(email="x@example.com", organization=org, invited_by=admin)
        invitation, error = create_invitation(
            email="x@example.com",
            organization=org,
            invited_by=admin,
        )
        assert invitation is None
        assert error == "pending_exists"

    def test_create_allows_re_invite_after_revoke(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        first, _ = create_invitation(email="x@example.com", organization=org, invited_by=admin)
        revoke_invitation(first)

        second, error = create_invitation(
            email="x@example.com",
            organization=org,
            invited_by=admin,
        )
        assert error is None
        assert second is not None
        assert second.token != first.token


@pytest.mark.django_db
class TestAcceptInvitation:
    def _make_pending(self, email: str = "newperson@example.com"):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, _ = create_invitation(email=email, organization=org, invited_by=admin)
        return invitation

    def test_accept_creates_membership(self):
        invitation = self._make_pending()
        user = UserFactory(email=invitation.email, is_verified=True)
        success, error = accept_invitation(invitation=invitation, user=user)
        assert success is True
        assert error is None
        assert Membership.objects.filter(
            user=user,
            organization=invitation.organization,
            is_active=True,
        ).exists()
        invitation.refresh_from_db()
        assert invitation.accepted_at is not None

    def test_accept_initializes_requires_onboarding_true(self):
        invitation = self._make_pending()
        user = UserFactory(email=invitation.email, is_verified=True)
        accept_invitation(invitation=invitation, user=user)
        membership = Membership.objects.get(user=user, organization=invitation.organization)
        assert membership.requires_onboarding is True

    def test_accept_rejects_email_mismatch(self):
        invitation = self._make_pending(email="invited@example.com")
        attacker = UserFactory(email="attacker@example.com", is_verified=True)
        success, error = accept_invitation(invitation=invitation, user=attacker)
        assert success is False
        assert error == "email_mismatch"
        assert not Membership.objects.filter(
            user=attacker,
            organization=invitation.organization,
        ).exists()

    def test_accept_rejects_unverified_user(self):
        invitation = self._make_pending()
        user = UserFactory(email=invitation.email, is_verified=False)
        success, error = accept_invitation(invitation=invitation, user=user)
        assert success is False
        assert error == "not_verified"

    def test_accept_rejects_expired(self):
        invitation = self._make_pending()
        invitation.expires_at = timezone.now() - timedelta(days=1)
        invitation.save(update_fields=["expires_at"])
        user = UserFactory(email=invitation.email, is_verified=True)
        success, error = accept_invitation(invitation=invitation, user=user)
        assert success is False
        assert error == "expired"

    def test_accept_rejects_already_accepted(self):
        invitation = self._make_pending()
        user = UserFactory(email=invitation.email, is_verified=True)
        accept_invitation(invitation=invitation, user=user)
        success, error = accept_invitation(invitation=invitation, user=user)
        assert success is False
        assert error == "already_accepted"

    def test_accept_rejects_revoked(self):
        invitation = self._make_pending()
        revoke_invitation(invitation)
        user = UserFactory(email=invitation.email, is_verified=True)
        success, error = accept_invitation(invitation=invitation, user=user)
        assert success is False
        assert error == "revoked"


@pytest.mark.django_db
class TestRevokeAndResend:
    def test_revoke_marks_revoked_at(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, _ = create_invitation(email="x@example.com", organization=org, invited_by=admin)
        revoke_invitation(invitation)
        invitation.refresh_from_db()
        assert invitation.revoked_at is not None
        assert invitation.status == Invitation.STATUS_REVOKED

    def test_resend_extends_expiry_and_clears_revocation(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, _ = create_invitation(email="x@example.com", organization=org, invited_by=admin)
        revoke_invitation(invitation)
        invitation.refresh_from_db()

        updated, error = resend_invitation(invitation)
        assert error is None
        assert updated is not None
        assert updated.revoked_at is None
        assert updated.expires_at > timezone.now()

    def test_resend_blocks_already_accepted(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, _ = create_invitation(email="x@example.com", organization=org, invited_by=admin)
        invitation.accepted_at = timezone.now()
        invitation.save(update_fields=["accepted_at"])

        updated, error = resend_invitation(invitation)
        assert updated is None
        assert error == "already_accepted"


@pytest.mark.django_db
class TestLookup:
    def test_lookup_by_token_returns_invitation(self):
        org = OrganizationFactory()
        admin = UserFactory(is_verified=True)
        invitation, _ = create_invitation(email="x@example.com", organization=org, invited_by=admin)

        found = lookup_invitation_by_token(invitation.token)
        assert found is not None
        assert found.id == invitation.id

    def test_lookup_unknown_token_returns_none(self):
        assert lookup_invitation_by_token("nonexistent-token") is None
