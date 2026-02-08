from django.db import transaction
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Company
from .serializers import CompanyCreateSerializer, CompanyListSerializer
from .pagination import MyCompaniesPagination

from access.models import (
    Membership,
    Role,
    Permission,
    RolePermission,
    MembershipRole,
)


class CompanyCreateView(generics.CreateAPIView):
    """
    Create a new company and bootstrap access control for the creator:

    - Create the Company record
    - Create Membership for request.user in that company
    - Create a system "Owner" role for the company (if not exists)
    - Assign ALL system permissions to the Owner role
    - Assign Owner role to the creator's membership
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CompanyCreateSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        # 1) Create company
        company = serializer.save()

        # 2) Ensure creator becomes an active member of the new company
        membership, _ = Membership.objects.get_or_create(
            user=self.request.user,
            company=company,
            defaults={"is_active": True},
        )

        # 3) Create the company-scoped "Owner" role (system role)
        owner_role, _ = Role.objects.get_or_create(
            company=company,
            name="Owner",
            defaults={
                "description": "Full access to manage the company.",
                "is_system": True,
            },
        )

        # 4) Grant ALL permissions to the Owner role
        #    (Permissions are system-defined and seeded from permissions.py)
        permissions = Permission.objects.all().only("id")

        RolePermission.objects.bulk_create(
            [RolePermission(role=owner_role, permission=p) for p in permissions],
            ignore_conflicts=True,  # safe if rerun / duplicates
        )

        # 5) Assign Owner role to the creator
        MembershipRole.objects.get_or_create(
            membership=membership,
            role=owner_role,
        )


class MyCompaniesListView(generics.ListAPIView):
    """
    List companies where the current user has an active membership.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CompanyListSerializer
    pagination_class = MyCompaniesPagination

    def get_queryset(self):
        return (
            Company.objects.filter(
                memberships__user=self.request.user,
                memberships__is_active=True,
            )
            .distinct()
            .order_by("-date_created")
        )
