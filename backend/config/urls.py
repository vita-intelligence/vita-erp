"""
Root URL configuration — all API routes start with /api/v1/.
"""

from django.conf import settings
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path(
        "api/v1/accounts/",
        include(("apps.accounts.urls_accounts", "accounts_v2"), namespace="accounts_v2"),
    ),
    path("api/v1/organizations/", include("apps.organizations.urls")),
    path("api/v1/company/", include("apps.company.urls")),
    path("api/v1/rbac/", include("apps.rbac.urls")),
    path("api/v1/billing/", include(("apps.billing.urls", "billing"), namespace="billing")),
    path("webhooks/", include(("apps.billing.urls_webhook", "billing-webhook"), namespace="billing-webhook")),
]

# Serve media files in development (Django dev server only)
if settings.DEBUG:
    from django.conf.urls.static import static

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # type: ignore[arg-type]
