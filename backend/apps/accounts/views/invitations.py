"""
Invitation views — admin CRUD + public lookup/accept.

Admin endpoints are gated by `accounts:write` (create/revoke/resend)
and `accounts:read` (list). They live under the active org context
and only operate on invitations belonging to that org — there's no
cross-org leakage.

Public endpoints take an opaque token. Lookup is fully unauthenticated
so the accept-invite landing page can render before the user logs in.
Accept requires authentication so we can verify the logged-in user's
email matches the invitation's email — preventing token-leak attacks.
"""

from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Invitation
from apps.accounts.serializers import (
    InvitationAcceptSerializer,
    InvitationCreateSerializer,
    InvitationDetailSerializer,
    InvitationLookupSerializer,
)
from apps.accounts.services.invitation import (
    accept_invitation,
    create_invitation,
    lookup_invitation_by_token,
    resend_invitation,
    revoke_invitation,
)
from apps.organizations.permissions import HasOrgContext
from apps.rbac.constants import MODULE_ACCOUNTS
from apps.rbac.permissions import HasModulePermission

logger = logging.getLogger(__name__)


# ── Admin CRUD ─────────────────────────────────────────────────────────────


class InvitationListCreateView(APIView):
    """GET/POST /api/v1/accounts/invitations/

    GET → list invitations for the active org (filtered to non-revoked
    by default; pass ?include_revoked=true to see everything).
    POST → create a new invitation. Sends the invite email.
    """

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_ACCOUNTS
    rbac_action_map = {"GET": "read", "POST": "write"}

    def get(self, request: Request) -> Response:
        org = request.tenant_org
        qs = Invitation.objects.filter(organization=org).select_related(
            "organization",
            "invited_by",
        )
        if request.query_params.get("include_revoked") != "true":
            qs = qs.filter(revoked_at__isnull=True)
        return Response(
            {"data": InvitationDetailSerializer(qs, many=True).data},
        )

    def post(self, request: Request) -> Response:
        serializer = InvitationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation, error = create_invitation(
            email=serializer.validated_data["email"],
            organization=request.tenant_org,
            invited_by=request.user,
            pre_assigned_role_id=serializer.validated_data.get("pre_assigned_role_id"),
        )
        if error:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            InvitationDetailSerializer(invitation).data,
            status=status.HTTP_201_CREATED,
        )


class InvitationDetailView(APIView):
    """DELETE /api/v1/accounts/invitations/{id}/  → revoke an invitation."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_ACCOUNTS
    rbac_action_map = {"DELETE": "write"}

    def delete(self, request: Request, invitation_id: str) -> Response:
        invitation = (
            Invitation.objects.filter(id=invitation_id, organization=request.tenant_org)
            .select_related("organization")
            .first()
        )
        if invitation is None:
            return Response({"detail": "not_found"}, status=status.HTTP_404_NOT_FOUND)

        revoke_invitation(invitation)
        return Response(status=status.HTTP_204_NO_CONTENT)


class InvitationResendView(APIView):
    """POST /api/v1/accounts/invitations/{id}/resend/  → re-send the email."""

    permission_classes = [IsAuthenticated, HasOrgContext, HasModulePermission]
    rbac_module = MODULE_ACCOUNTS
    rbac_action_map = {"POST": "write"}

    def post(self, request: Request, invitation_id: str) -> Response:
        invitation = (
            Invitation.objects.filter(id=invitation_id, organization=request.tenant_org)
            .select_related("organization")
            .first()
        )
        if invitation is None:
            return Response({"detail": "not_found"}, status=status.HTTP_404_NOT_FOUND)

        updated, error = resend_invitation(invitation)
        if error:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)
        return Response(InvitationDetailSerializer(updated).data)


# ── Public token lookup + accept ──────────────────────────────────────────


class InvitationLookupView(APIView):
    """GET /api/v1/accounts/invitations/lookup/?token=xxx

    Public — needed before the user logs in so the accept-invite
    landing page can render the right CTA. Returns minimal info: the
    invited email, the org name, the current status. Never returns
    the inviter or any PII about other org members.
    """

    permission_classes = [AllowAny]
    authentication_classes: list = []

    def get(self, request: Request) -> Response:
        token = request.query_params.get("token", "")
        if not token:
            return Response({"detail": "missing_token"}, status=status.HTTP_400_BAD_REQUEST)

        invitation = lookup_invitation_by_token(token)
        if invitation is None:
            return Response({"detail": "not_found"}, status=status.HTTP_404_NOT_FOUND)

        payload = {
            "email": invitation.email,
            "org_name": invitation.organization.name,
            "status": invitation.status,
            "pre_assigned_role_id": invitation.pre_assigned_role_id,
        }
        return Response(InvitationLookupSerializer(payload).data)


class InvitationAcceptView(APIView):
    """POST /api/v1/accounts/invitations/accept/  → finalize the invitation.

    Authenticated — the request must come from a logged-in user whose
    email matches the invitation's email. We verify match server-side
    so the frontend can't bypass it by sending a forged token in
    place of someone else's invite.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = InvitationAcceptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation = lookup_invitation_by_token(serializer.validated_data["token"])
        if invitation is None:
            return Response({"detail": "not_found"}, status=status.HTTP_404_NOT_FOUND)

        success, error = accept_invitation(invitation=invitation, user=request.user)
        if not success:
            return Response({"detail": error}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            {
                "status": "accepted",
                "organization_id": str(invitation.organization_id),
                "organization_slug": invitation.organization.slug,
            }
        )
