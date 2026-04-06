"""RBAC URL patterns — mounted under /api/v1/rbac/."""

from __future__ import annotations

from django.urls import path

from apps.rbac.views import (
    MePermissionsView,
    OrganogramLayoutView,
    OrgMemberListView,
    RoleDetailView,
    RoleListCreateView,
    RoleMemberDetailView,
    RoleMemberView,
    RolePermissionView,
)

app_name = "rbac"

urlpatterns = [
    # Existing
    path(
        "me/permissions/",
        MePermissionsView.as_view(),
        name="me-permissions",
    ),
    # Roles CRUD
    path(
        "roles/",
        RoleListCreateView.as_view(),
        name="role-list-create",
    ),
    path(
        "roles/<uuid:role_id>/",
        RoleDetailView.as_view(),
        name="role-detail",
    ),
    # Role permissions
    path(
        "roles/<uuid:role_id>/permissions/",
        RolePermissionView.as_view(),
        name="role-permissions",
    ),
    # Role members
    path(
        "roles/<uuid:role_id>/members/",
        RoleMemberView.as_view(),
        name="role-members",
    ),
    path(
        "roles/<uuid:role_id>/members/<uuid:user_id>/",
        RoleMemberDetailView.as_view(),
        name="role-member-detail",
    ),
    # Organogram layout
    path(
        "organogram/",
        OrganogramLayoutView.as_view(),
        name="organogram-layout",
    ),
    # Org members
    path(
        "org-members/",
        OrgMemberListView.as_view(),
        name="org-members",
    ),
]
