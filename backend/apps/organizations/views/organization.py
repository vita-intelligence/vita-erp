"""
Organization views — thin wrappers that validate and delegate to services.

Endpoints:
    POST   /api/v1/organizations/              → create
    GET    /api/v1/organizations/              → list
    GET    /api/v1/organizations/{id}/         → detail
    POST   /api/v1/organizations/{id}/select/  → select (reissue JWT)
"""

from __future__ import annotations

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsEmailVerified
from apps.organizations.models import Membership, Organization
from apps.organizations.serializers import (
    CreateOrganizationSerializer,
    OrganizationDetailSerializer,
    OrganizationSummarySerializer,
)
from apps.organizations.services.organization import create_organization


class OrganizationListCreateView(APIView):
    """List user's organizations (GET) or create a new one (POST).

    POST creates the org, starts a trial, and returns org-scoped JWT cookies.
    GET returns a compact list of organizations the user belongs to.
    """

    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get(self, request):
        org_ids = Membership.objects.filter(
            user=request.user,
            is_active=True,
        ).values_list("organization_id", flat=True)

        orgs = Organization.objects.filter(id__in=org_ids).order_by("-created_at")
        return Response(OrganizationSummarySerializer(orgs, many=True).data)

    def post(self, request):
        serializer = CreateOrganizationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        org, error = create_organization(
            user=request.user,
            name=serializer.validated_data["name"],
            slug=serializer.validated_data["slug"],
            industry=serializer.validated_data.get("industry", ""),
            country=serializer.validated_data.get("country", ""),
            timezone_str=serializer.validated_data.get("timezone", "UTC"),
            base_currency=serializer.validated_data.get("base_currency", "USD"),
            request=request,
        )

        if error:
            return Response(
                {"detail": error},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = Response(
            OrganizationDetailSerializer(org).data,
            status=status.HTTP_201_CREATED,
        )
        _set_org_scoped_cookies(request.user, org, response)
        return response


class SelectOrganizationView(APIView):
    """Select an organization and receive org-scoped JWT cookies.

    Called when a user switches between organizations or after
    initial org creation.
    """

    permission_classes = [IsAuthenticated, IsEmailVerified]

    def post(self, request, org_id):
        membership = (
            Membership.objects.filter(
                user=request.user,
                organization_id=org_id,
                is_active=True,
            )
            .select_related("organization")
            .first()
        )

        if not membership:
            return Response(
                {"detail": "not_a_member"},
                status=status.HTTP_403_FORBIDDEN,
            )

        org = membership.organization

        if not org.is_accessible:
            return Response(
                {"detail": "org_not_accessible"},
                status=status.HTTP_403_FORBIDDEN,
            )

        response = Response(OrganizationDetailSerializer(org).data)
        _set_org_scoped_cookies(request.user, org, response)
        return response


class OrganizationDetailView(APIView):
    """Get details of a specific organization."""

    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get(self, request, org_id):
        membership = (
            Membership.objects.filter(
                user=request.user,
                organization_id=org_id,
                is_active=True,
            )
            .select_related("organization")
            .first()
        )

        if not membership:
            return Response(
                {"detail": "not_a_member"},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(OrganizationDetailSerializer(membership.organization).data)


def _set_org_scoped_cookies(user, org, response) -> None:
    """Issue a new JWT pair with org_id claim and set cookies."""
    from apps.accounts.services.auth import create_tokens, set_auth_cookies

    access_token, refresh_token = create_tokens(user, org_id=str(org.id))
    set_auth_cookies(response, access_token, refresh_token)
