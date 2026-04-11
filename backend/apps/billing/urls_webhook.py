"""Webhook-only URL patterns — kept separate so they can be mounted
outside the /api/v1/ namespace and remain CSRF-exempt without
affecting the main billing routes."""

from apps.billing.urls import webhook_urlpatterns

app_name = "billing-webhook"

urlpatterns = webhook_urlpatterns
