"""URL routes for the billing app."""

from django.urls import path

from apps.billing.views import (
    AddOnListView,
    BillingBreakdownView,
    CheckoutSessionStatusView,
    CheckoutSessionView,
    CustomerPortalView,
    InvoiceListView,
    StorageQuotaUpdateView,
    StripeWebhookView,
    SubscriptionAddOnToggleView,
    SubscriptionDetailView,
    UsageView,
)

app_name = "billing"

urlpatterns = [
    # Read
    path("subscription/", SubscriptionDetailView.as_view(), name="subscription"),
    path("usage/", UsageView.as_view(), name="usage"),
    path("breakdown/", BillingBreakdownView.as_view(), name="breakdown"),
    path("invoices/", InvoiceListView.as_view(), name="invoices"),
    # Write
    path("storage-quota/", StorageQuotaUpdateView.as_view(), name="storage-quota"),
    # Checkout / onboarding
    path("checkout-session/", CheckoutSessionView.as_view(), name="checkout-session"),
    path(
        "checkout-session/<str:session_id>/",
        CheckoutSessionStatusView.as_view(),
        name="checkout-session-status",
    ),
    # Customer Portal
    path("customer-portal/", CustomerPortalView.as_view(), name="customer-portal"),
    # Add-ons
    path("addons/", AddOnListView.as_view(), name="addons"),
    path("addons/<slug:slug>/toggle/", SubscriptionAddOnToggleView.as_view(), name="addons-toggle"),
]

webhook_urlpatterns = [
    path("stripe/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
