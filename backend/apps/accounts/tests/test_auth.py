"""
Auth endpoint tests — register, login, refresh, logout, verification.

Tests use Django's test client with cookie support. Each test gets
a fresh database (pytest-django handles rollback).
"""

import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

from apps.accounts.models import AuditLog, Session, User
from apps.accounts.tests.factories import DEFAULT_PASSWORD, UserFactory

# Fresh client for each test
pytestmark = pytest.mark.django_db


@pytest.fixture()
def client():
    return APIClient()


@pytest.fixture()
def user():
    return UserFactory()


@pytest.fixture()
def verified_user():
    return UserFactory(is_verified=True)


@pytest.fixture(autouse=True)
def _clear_cache():
    """Clear rate limit counters between tests."""
    cache.clear()


# ── Registration ─────────────────────────────────────────────────────────────


class TestRegister:
    URL = "/api/v1/auth/register/"

    def test_register_success(self, client):
        response = client.post(self.URL, {"email": "new@test.com", "password": "StrongPass99"})
        assert response.status_code == 201
        assert response.data["email"] == "new@test.com"
        assert response.data["is_verified"] is False
        assert User.objects.filter(email="new@test.com").exists()

    def test_register_sets_cookies(self, client):
        response = client.post(self.URL, {"email": "new@test.com", "password": "StrongPass99"})
        assert "vita_access" in response.cookies
        assert "vita_refresh" in response.cookies

    def test_register_creates_session(self, client):
        client.post(self.URL, {"email": "new@test.com", "password": "StrongPass99"})
        assert Session.objects.count() == 1

    def test_register_creates_audit_log(self, client):
        client.post(self.URL, {"email": "new@test.com", "password": "StrongPass99"})
        assert AuditLog.objects.filter(action="login").exists()

    def test_register_duplicate_email(self, client, user):
        response = client.post(self.URL, {"email": user.email, "password": "StrongPass99"})
        assert response.status_code == 400
        assert "email_taken" in str(response.data)

    def test_register_weak_password(self, client):
        response = client.post(self.URL, {"email": "new@test.com", "password": "123"})
        assert response.status_code == 400

    def test_register_missing_email(self, client):
        response = client.post(self.URL, {"password": "StrongPass99"})
        assert response.status_code == 400

    def test_register_missing_password(self, client):
        response = client.post(self.URL, {"email": "new@test.com"})
        assert response.status_code == 400

    def test_register_rate_limited(self, client):
        for i in range(3):
            client.post(self.URL, {"email": f"user{i}@rate.com", "password": "StrongPass99"})
        response = client.post(self.URL, {"email": "extra@rate.com", "password": "StrongPass99"})
        assert response.status_code == 429


# ── Login ────────────────────────────────────────────────────────────────────


class TestLogin:
    URL = "/api/v1/auth/login/"

    def test_login_success(self, client, user):
        response = client.post(self.URL, {"email": user.email, "password": DEFAULT_PASSWORD})
        assert response.status_code == 200
        assert response.data["email"] == user.email

    def test_login_sets_cookies(self, client, user):
        response = client.post(self.URL, {"email": user.email, "password": DEFAULT_PASSWORD})
        assert "vita_access" in response.cookies
        assert "vita_refresh" in response.cookies

    def test_login_creates_session(self, client, user):
        client.post(self.URL, {"email": user.email, "password": DEFAULT_PASSWORD})
        assert Session.objects.filter(user=user, is_active=True).exists()

    def test_login_wrong_password(self, client, user):
        response = client.post(self.URL, {"email": user.email, "password": "WrongPassword"})
        assert response.status_code == 401
        assert "invalid_credentials" in str(response.data)

    def test_login_wrong_email(self, client):
        response = client.post(self.URL, {"email": "nobody@test.com", "password": "Whatever99"})
        assert response.status_code == 401

    def test_login_inactive_user(self, client):
        user = UserFactory(is_active=False)
        response = client.post(self.URL, {"email": user.email, "password": DEFAULT_PASSWORD})
        assert response.status_code == 401
        # Django's authenticate() returns None for inactive users — same as wrong password
        assert "invalid_credentials" in str(response.data)

    def test_login_logs_failed_attempt(self, client, user):
        client.post(self.URL, {"email": user.email, "password": "WrongPassword"})
        assert AuditLog.objects.filter(user=user, action="login_failed").exists()

    def test_login_rate_limited(self, client, user):
        for _ in range(5):
            client.post(self.URL, {"email": user.email, "password": "WrongPassword"})
        response = client.post(self.URL, {"email": user.email, "password": DEFAULT_PASSWORD})
        assert response.status_code == 429


# ── Me ───────────────────────────────────────────────────────────────────────


class TestMe:
    URL = "/api/v1/auth/me/"

    def test_me_authenticated(self, client, user):
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.get(self.URL)
        assert response.status_code == 200
        assert response.data["email"] == user.email

    def test_me_unauthenticated(self, client):
        response = client.get(self.URL)
        assert response.status_code == 401

    def test_me_unverified_allowed(self, client, user):
        """Unverified users can see their own profile."""
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.get(self.URL)
        assert response.status_code == 200
        assert response.data["is_verified"] is False


# ── Email Verification ───────────────────────────────────────────────────────


class TestEmailVerification:
    VERIFY_URL = "/api/v1/auth/verify-email/"
    RESEND_URL = "/api/v1/auth/resend-verification/"

    def test_verify_success(self, client, user):
        from apps.accounts.services.verification import generate_verification_token

        token = generate_verification_token(user)
        response = client.post(self.VERIFY_URL, {"token": token})
        assert response.status_code == 200
        user.refresh_from_db()
        assert user.is_verified is True

    def test_verify_invalid_token(self, client):
        response = client.post(self.VERIFY_URL, {"token": "bogus"})
        assert response.status_code == 400
        assert "token_invalid_or_expired" in str(response.data)

    def test_verify_already_verified(self, client, verified_user):
        from apps.accounts.services.verification import generate_verification_token

        token = generate_verification_token(verified_user)
        response = client.post(self.VERIFY_URL, {"token": token})
        assert response.status_code == 200
        assert "already_verified" in str(response.data)

    def test_verify_creates_audit_log(self, client, user):
        from apps.accounts.services.verification import generate_verification_token

        token = generate_verification_token(user)
        client.post(self.VERIFY_URL, {"token": token})
        assert AuditLog.objects.filter(user=user, action="email_verified").exists()

    def test_resend_requires_auth(self, client):
        response = client.post(self.RESEND_URL)
        assert response.status_code == 401


# ── Verified-Only Endpoints ──────────────────────────────────────────────────


class TestVerifiedOnlyAccess:
    def test_change_password_blocked_unverified(self, client, user):
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.post(
            "/api/v1/auth/me/password/",
            {"old_password": DEFAULT_PASSWORD, "new_password": "NewStrong99"},
        )
        assert response.status_code == 403
        assert "email_not_verified" in str(response.data)

    def test_change_password_allowed_verified(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        response = client.post(
            "/api/v1/auth/me/password/",
            {"old_password": DEFAULT_PASSWORD, "new_password": "NewStrong99"},
        )
        assert response.status_code == 200

    def test_change_email_blocked_unverified(self, client, user):
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.post(
            "/api/v1/auth/me/email/",
            {"new_email": "changed@test.com", "password": DEFAULT_PASSWORD},
        )
        assert response.status_code == 403

    def test_sessions_blocked_unverified(self, client, user):
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.get("/api/v1/auth/sessions/")
        assert response.status_code == 403


# ── Logout ───────────────────────────────────────────────────────────────────


class TestLogout:
    URL = "/api/v1/auth/logout/"

    def test_logout_success(self, client, user):
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL)
        assert response.status_code == 200

    def test_logout_revokes_session(self, client, user):
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        client.post(self.URL)
        assert not Session.objects.filter(user=user, is_active=True).exists()

    def test_logout_clears_cookies(self, client, user):
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL)
        assert response.cookies["vita_access"].value == ""
        assert response.cookies["vita_refresh"].value == ""

    def test_logout_unverified_allowed(self, client, user):
        """Unverified users can still logout."""
        client.post("/api/v1/auth/login/", {"email": user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL)
        assert response.status_code == 200


# ── Sessions ─────────────────────────────────────────────────────────────────


class TestSessions:
    LIST_URL = "/api/v1/auth/sessions/"

    def test_list_sessions(self, client, verified_user):
        # Login twice = 2 sessions
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        client2 = APIClient()
        client2.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})

        response = client.get(self.LIST_URL)
        assert response.status_code == 200
        assert len(response.data) == 2

    def test_revoke_single_session(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        session = Session.objects.filter(user=verified_user, is_active=True).first()
        response = client.delete(f"{self.LIST_URL}{session.id}/")
        assert response.status_code == 200
        session.refresh_from_db()
        assert session.is_active is False

    def test_revoke_all_sessions(self, client, verified_user):
        # Login 3 times
        for _ in range(3):
            c = APIClient()
            c.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})

        # Login once more with our test client (this one stays active)
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        response = client.delete(self.LIST_URL)
        assert response.status_code == 200
        assert response.data["revoked_count"] == 3

    def test_revoke_nonexistent_session(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        import uuid

        response = client.delete(f"{self.LIST_URL}{uuid.uuid4()}/")
        assert response.status_code == 404


# ── Change Password ──────────────────────────────────────────────────────────


class TestChangePassword:
    URL = "/api/v1/auth/me/password/"

    def test_change_password_success(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL, {"old_password": DEFAULT_PASSWORD, "new_password": "BrandNewPass99"})
        assert response.status_code == 200
        # Can login with new password (fresh client to clear old cookies)
        fresh_client = APIClient()
        response = fresh_client.post(
            "/api/v1/auth/login/",
            {"email": verified_user.email, "password": "BrandNewPass99"},
        )
        assert response.status_code == 200

    def test_change_password_wrong_old(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL, {"old_password": "WrongOldPass", "new_password": "BrandNewPass99"})
        assert response.status_code == 400
        assert "invalid_current_password" in str(response.data)

    def test_change_password_creates_audit_log(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        client.post(self.URL, {"old_password": DEFAULT_PASSWORD, "new_password": "BrandNewPass99"})
        assert AuditLog.objects.filter(user=verified_user, action="password_changed").exists()


# ── Change Email ─────────────────────────────────────────────────────────────


class TestChangeEmail:
    URL = "/api/v1/auth/me/email/"

    def test_change_email_success(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL, {"new_email": "updated@test.com", "password": DEFAULT_PASSWORD})
        assert response.status_code == 200
        verified_user.refresh_from_db()
        assert verified_user.email == "updated@test.com"
        assert verified_user.is_verified is False  # reset after email change

    def test_change_email_taken(self, client, verified_user):
        other = UserFactory(is_verified=True)
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL, {"new_email": other.email, "password": DEFAULT_PASSWORD})
        assert response.status_code == 400
        assert "email_taken" in str(response.data)

    def test_change_email_wrong_password(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        response = client.post(self.URL, {"new_email": "new@test.com", "password": "WrongPass"})
        assert response.status_code == 400
        assert "invalid_current_password" in str(response.data)

    def test_change_email_creates_audit_log(self, client, verified_user):
        client.post("/api/v1/auth/login/", {"email": verified_user.email, "password": DEFAULT_PASSWORD})
        client.post(self.URL, {"new_email": "audit@test.com", "password": DEFAULT_PASSWORD})
        log = AuditLog.objects.filter(user=verified_user, action="email_changed").first()
        assert log is not None
        assert log.metadata["new_email"] == "audit@test.com"
