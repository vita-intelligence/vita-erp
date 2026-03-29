from django.urls import path

from apps.organizations.views import (
    OrganizationDetailView,
    OrganizationListCreateView,
    SelectOrganizationView,
)

urlpatterns = [
    path("", OrganizationListCreateView.as_view(), name="org-list-create"),
    path("<uuid:org_id>/", OrganizationDetailView.as_view(), name="org-detail"),
    path("<uuid:org_id>/select/", SelectOrganizationView.as_view(), name="org-select"),
]
