"""
Accounts URL configuration.

All endpoints are prefixed with /api/v1/auth/ (set in config/urls.py).
"""

from django.urls import path

from apps.accounts.views import (
    ChangeEmailView,
    ChangePasswordView,
    LoginView,
    LogoutView,
    MeView,
    RefreshView,
    RegisterView,
    ResendVerificationView,
    SessionListView,
    SessionRevokeView,
    VerifyEmailView,
)

app_name = "accounts"

urlpatterns = [
    # Public (no auth required)
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    # Authenticated
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("me/password/", ChangePasswordView.as_view(), name="change-password"),
    path("me/email/", ChangeEmailView.as_view(), name="change-email"),
    path("resend-verification/", ResendVerificationView.as_view(), name="resend-verification"),
    path("sessions/", SessionListView.as_view(), name="sessions"),
    path("sessions/<uuid:session_id>/", SessionRevokeView.as_view(), name="session-revoke"),
]
