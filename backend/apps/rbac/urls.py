"""RBAC URL patterns — mounted under /api/v1/rbac/."""

from __future__ import annotations

from django.urls import path

from apps.rbac.views import MePermissionsView

app_name = "rbac"

urlpatterns = [
    path(
        "me/permissions/",
        MePermissionsView.as_view(),
        name="me-permissions",
    ),
]
