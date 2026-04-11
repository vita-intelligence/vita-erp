from django.apps import AppConfig


class OrgAccountsConfig(AppConfig):
    """Tenant-side accounts data: per-org onboarding form definition,
    submitted responses, and uploaded media.

    Lives in the org database (not the central one). The central
    `apps.accounts` app still owns the User and Invitation models;
    `org_accounts` owns everything that varies per organization.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.org_accounts"
    verbose_name = "Org Accounts"

    def ready(self) -> None:
        # Connect post_save signal that recomputes Membership.requires_onboarding
        # whenever an admin edits the org's onboarding form.
        from apps.org_accounts import signals  # noqa: F401
