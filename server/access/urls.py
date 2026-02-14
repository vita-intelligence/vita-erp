from django.urls import path
from .views import (
    CompanyRolesListView,
    RoleCreateView,
    RoleDetailView,
    PermissionCatalogView,
    MyCompanyPermissionsView,
    TeamMembersListView,
    ChangeMemberRoleView,
    RemoveMemberView,
)

urlpatterns = [
    # Roles
    path("companies/<int:company_id>/roles/", CompanyRolesListView.as_view(), name="company-roles-list"),
    path("companies/<int:company_id>/roles/create/", RoleCreateView.as_view(), name="company-role-create"),
    path("companies/<int:company_id>/roles/<int:role_id>/", RoleDetailView.as_view(), name="company-role-detail"),

    # Permissions
    path("companies/<int:company_id>/permissions/", PermissionCatalogView.as_view(), name="permission-catalog"),
    path("companies/<int:company_id>/my-permissions/", MyCompanyPermissionsView.as_view(), name="my-company-permissions"),

    # Team
    path("companies/<int:company_id>/team/", TeamMembersListView.as_view(), name="company-team"),
    path("companies/<int:company_id>/team/<int:membership_id>/role/", ChangeMemberRoleView.as_view(), name="change-member-role"),
    path("companies/<int:company_id>/team/<int:membership_id>/", RemoveMemberView.as_view(), name="remove-member"),
]