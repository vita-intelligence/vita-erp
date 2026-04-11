"""
Accounts URL configuration — onboarding + invitations.

Mounted at /api/v1/accounts/ in config/urls.py. Distinct from the
auth-flavoured /api/v1/auth/ routes (which still live in
apps/accounts/urls.py) so the existing auth surface stays untouched.
"""

from django.urls import path

from apps.accounts.views import (
    InvitationAcceptView,
    InvitationDetailView,
    InvitationListCreateView,
    InvitationLookupView,
    InvitationResendView,
    OnboardingFormView,
    OnboardingMeView,
    UserMediaAssetView,
)

app_name = "accounts_v2"

urlpatterns = [
    # Admin: onboarding form editor
    path("onboarding-form/", OnboardingFormView.as_view(), name="onboarding-form"),
    # Member: self onboarding
    path("me/onboarding/", OnboardingMeView.as_view(), name="me-onboarding"),
    # Media fetch
    path("media/<uuid:asset_id>/", UserMediaAssetView.as_view(), name="media-asset"),
    # Invitations — admin CRUD
    path("invitations/", InvitationListCreateView.as_view(), name="invitations"),
    path(
        "invitations/<uuid:invitation_id>/",
        InvitationDetailView.as_view(),
        name="invitation-detail",
    ),
    path(
        "invitations/<uuid:invitation_id>/resend/",
        InvitationResendView.as_view(),
        name="invitation-resend",
    ),
    # Invitations — public lookup + accept
    path("invitations/lookup/", InvitationLookupView.as_view(), name="invitation-lookup"),
    path("invitations/accept/", InvitationAcceptView.as_view(), name="invitation-accept"),
]
