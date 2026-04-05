"""
Company URL configuration.

All routes are mounted under /api/v1/company/ by the root urlconf.
"""

from django.urls import path

from apps.company.views.company_settings import CompanySettingsView
from apps.company.views.company_theme import CompanyThemeView

app_name = "company"

urlpatterns = [
    path("settings/", CompanySettingsView.as_view(), name="settings"),
    path("theme/", CompanyThemeView.as_view(), name="theme"),
]
