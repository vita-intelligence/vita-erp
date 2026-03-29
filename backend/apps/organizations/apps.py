from django.apps import AppConfig


class OrganizationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.organizations"
    verbose_name = "Organizations"

    def ready(self) -> None:
        self._register_existing_org_databases()

    @staticmethod
    def _register_existing_org_databases() -> None:
        """Load all active organization databases into Django's connection handler.

        Runs at startup so TenantDatabaseRouter can route queries to the
        correct database without hitting the Organization table on every request.
        Silently skips if the table does not exist yet (first migration).
        """
        try:
            from apps.organizations.db import register_org_database
            from apps.organizations.models import Organization

            for db_name in (
                Organization.objects.filter(status__in=["trial", "active"])
                .values_list("db_name", flat=True)
                .iterator()
            ):
                register_org_database(db_name)
        except Exception:
            pass
