"""
Company URL configuration.

All routes are mounted under /api/v1/company/ by the root urlconf.
"""

from django.urls import path

from apps.company.views.company_settings import CompanySettingsView

app_name = "company"

urlpatterns = [
    path("settings/", CompanySettingsView.as_view(), name="settings"),
]
