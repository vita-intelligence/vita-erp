from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Membership, MembershipRole, Role, Permission, RolePermission
from .serializers import RoleSerializer, RoleDetailSerializer, TeamMemberSerializer, PermissionSerializer
from .pagination import TeamPagination
from .services.permissions import membership_has_perm
from companies.models import Company


# ============================================================================
# MIXINS
# ============================================================================

class CompanyMemberMixin:
    """
    Resolves company + requester membership from URL kwargs.
    Raises 404 if company doesn't exist or user is not an active member.
    """

    def get_company(self):
        if not hasattr(self, '_company'):
            self._company = get_object_or_404(Company, id=self.kwargs['company_id'])
        return self._company

    def get_membership(self):
        if not hasattr(self, '_membership'):
            self._membership = get_object_or_404(
                Membership,
                user=self.request.user,
                company=self.get_company(),
                is_active=True,
            )
        return self._membership

    def require_perm(self, perm: str):
        """Returns 403 Response if lacking permission. Use in APIView methods."""
        if not membership_has_perm(self.get_membership(), perm):
            return Response(
                {'detail': f'Missing permission: {perm}'},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None

    def check_perm(self, perm: str):
        """Raises PermissionDenied if lacking permission. Use in get_queryset."""
        if not membership_has_perm(self.get_membership(), perm):
            raise PermissionDenied(f'Missing permission: {perm}')


# ============================================================================
# ROLES
# ============================================================================

class CompanyRolesListView(CompanyMemberMixin, generics.ListAPIView):
    """
    GET /api/access/companies/{company_id}/roles/
    Requires: roles.view
    """
    permission_classes = [IsAuthenticated]
    serializer_class = RoleSerializer

    def get_queryset(self):
        self.check_perm('roles.view')
        return Role.objects.filter(company=self.get_company())


class RoleCreateView(CompanyMemberMixin, APIView):
    """
    POST /api/access/companies/{company_id}/roles/create/
    Body: { "name": "Manager", "description": "...", "permission_ids": [1, 2, 3] }
    Requires: roles.create
    """
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, company_id):
        if denied := self.require_perm('roles.create'):
            return denied

        name = request.data.get('name', '').strip()
        description = request.data.get('description', '').strip()
        permission_ids = request.data.get('permission_ids', [])

        if not name:
            return Response({'detail': 'name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        company = self.get_company()

        if Role.objects.filter(company=company, name=name).exists():
            return Response(
                {'detail': f'A role named "{name}" already exists in this company.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        role = Role.objects.create(
            company=company,
            name=name,
            description=description,
            is_system=False,
        )

        if permission_ids:
            permissions = Permission.objects.filter(id__in=permission_ids)
            RolePermission.objects.bulk_create([
                RolePermission(role=role, permission=p) for p in permissions
            ])

        return Response(RoleDetailSerializer(role).data, status=status.HTTP_201_CREATED)


class RoleDetailView(CompanyMemberMixin, APIView):
    """
    GET /api/access/companies/{company_id}/roles/{role_id}/ → requires roles.view
    PATCH  /api/access/companies/{company_id}/roles/{role_id}/  → requires roles.edit
    DELETE /api/access/companies/{company_id}/roles/{role_id}/  → requires roles.delete
    """
    permission_classes = [IsAuthenticated]

    def get_role(self):
        return get_object_or_404(Role, id=self.kwargs['role_id'], company=self.get_company())

    def get(self, request, company_id, role_id):
        if denied := self.require_perm('roles.view'):
            return denied
        return Response(RoleDetailSerializer(self.get_role()).data)

    def patch(self, request, company_id, role_id):
        if denied := self.require_perm('roles.edit'):
            return denied

        role = self.get_role()

        if role.is_system:
            return Response({'detail': 'System roles cannot be edited.'}, status=status.HTTP_400_BAD_REQUEST)

        name = request.data.get('name', '').strip()
        description = request.data.get('description', role.description).strip()
        permission_ids = request.data.get('permission_ids')  # None = don't touch

        if name and name != role.name:
            if Role.objects.filter(company=self.get_company(), name=name).exists():
                return Response(
                    {'detail': f'A role named "{name}" already exists in this company.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            role.name = name

        role.description = description
        role.save()

        if permission_ids is not None:
            RolePermission.objects.filter(role=role).delete()
            if permission_ids:
                permissions = Permission.objects.filter(id__in=permission_ids)
                RolePermission.objects.bulk_create([
                    RolePermission(role=role, permission=p) for p in permissions
                ])

        return Response(RoleDetailSerializer(role).data)

    def delete(self, request, company_id, role_id):
        if denied := self.require_perm('roles.delete'):
            return denied

        role = self.get_role()

        if role.is_system:
            return Response({'detail': 'System roles cannot be deleted.'}, status=status.HTTP_400_BAD_REQUEST)

        role.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================================
# PERMISSIONS CATALOG
# ============================================================================

class PermissionCatalogView(CompanyMemberMixin, APIView):
    """
    GET /api/access/companies/{company_id}/permissions/
    Requires: roles.view
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, company_id):
        self.check_perm('roles.view')
        return Response(PermissionSerializer(Permission.objects.all(), many=True).data)


class MyCompanyPermissionsView(CompanyMemberMixin, APIView):
    """
    GET /api/access/companies/{company_id}/my-permissions/
    No permission required — every active member can fetch their own permissions.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, company_id):
        membership = self.get_membership()

        permission_keys = list(
            Permission.objects.filter(
                permission_roles__role__assigned_memberships__membership=membership
            ).values_list('key', flat=True).distinct()
        )

        return Response({'permissions': permission_keys})


# ============================================================================
# TEAM
# ============================================================================

class TeamMembersListView(CompanyMemberMixin, generics.ListAPIView):
    """
    GET /api/access/companies/{company_id}/team/
    Requires: members.view
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TeamMemberSerializer
    pagination_class = TeamPagination

    def get_queryset(self):
        self.check_perm('members.view')
        return (
            Membership.objects
            .filter(company=self.get_company(), is_active=True)
            .select_related('user')
            .prefetch_related('membership_roles__role')
        )


class ChangeMemberRoleView(CompanyMemberMixin, APIView):
    """
    POST /api/access/companies/{company_id}/team/{membership_id}/role/
    Body: { "role_id": 2 }
    Requires: roles.assign
    """
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, company_id, membership_id):
        if denied := self.require_perm('roles.assign'):
            return denied

        target = get_object_or_404(Membership, id=membership_id, company=self.get_company(), is_active=True)

        if target.user == request.user:
            return Response({'detail': 'You cannot change your own role.'}, status=status.HTTP_400_BAD_REQUEST)

        role_id = request.data.get('role_id')
        if not role_id:
            return Response({'detail': 'role_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        new_role = get_object_or_404(Role, id=role_id, company=self.get_company())

        if new_role.is_system and new_role.name == 'Owner':
            return Response({'detail': 'Cannot assign the Owner role.'}, status=status.HTTP_400_BAD_REQUEST)

        MembershipRole.objects.filter(membership=target).delete()
        MembershipRole.objects.create(membership=target, role=new_role)

        return Response(TeamMemberSerializer(target).data)


class RemoveMemberView(CompanyMemberMixin, APIView):
    """
    DELETE /api/access/companies/{company_id}/team/{membership_id}/
    Requires: members.remove
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, company_id, membership_id):
        if denied := self.require_perm('members.remove'):
            return denied

        target = get_object_or_404(Membership, id=membership_id, company=self.get_company(), is_active=True)

        if target.user == request.user:
            return Response({'detail': 'You cannot remove yourself from the company.'}, status=status.HTTP_400_BAD_REQUEST)

        is_owner = MembershipRole.objects.filter(
            membership=target, role__name='Owner', role__is_system=True
        ).exists()

        if is_owner:
            return Response({'detail': 'Cannot remove the company Owner.'}, status=status.HTTP_400_BAD_REQUEST)

        target.is_active = False
        target.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)