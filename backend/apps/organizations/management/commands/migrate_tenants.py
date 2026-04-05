"""
migrate_tenants — run migrations on every organization database.

Tenant apps (company, rbac, audit) do not live on the default database.
Each organization has its own PostgreSQL database, and Django's standard
`migrate` command only touches the database it is pointed at. Whenever
tenant-app migrations are added, they must be applied to every org DB.

This command automates that fan-out so you can ship tenant migrations
confidently:

    # Migrate tenant apps on every active/trial org DB
    uv run python manage.py migrate_tenants

    # See what would run without touching any database
    uv run python manage.py migrate_tenants --dry-run

    # Limit to a single tenant app
    uv run python manage.py migrate_tenants --app company

    # Include suspended/deactivated orgs too
    uv run python manage.py migrate_tenants --include-inactive

    # Target a specific organization by slug
    uv run python manage.py migrate_tenants --org acme

Exit code is 0 only if every targeted org migrated successfully. If any
fail, the command keeps going (so a single broken tenant does not block
the rest) and exits non-zero at the end listing the failures.
"""

from __future__ import annotations

from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError

from apps.organizations.constants import ORG_ACTIVE_STATUSES
from apps.organizations.db import register_org_database
from apps.organizations.models import Organization


class Command(BaseCommand):
    help = "Run migrations on every organization database (tenant apps)."

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            "--app",
            dest="app_label",
            default=None,
            help="Restrict migrations to a single app label (e.g. 'company').",
        )
        parser.add_argument(
            "--org",
            dest="org_slug",
            default=None,
            help="Target a single organization by slug.",
        )
        parser.add_argument(
            "--include-inactive",
            action="store_true",
            default=False,
            help="Also migrate suspended/deactivated orgs. Off by default.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            default=False,
            help="Print the plan without running any migrations.",
        )
        parser.add_argument(
            "--verbosity-per-org",
            dest="per_org_verbosity",
            type=int,
            default=1,
            choices=[0, 1, 2, 3],
            help="Verbosity passed to each per-org migrate call (default: 1).",
        )

    def handle(self, *args, **options) -> None:
        org_slug: str | None = options["org_slug"]
        app_label: str | None = options["app_label"]
        include_inactive: bool = options["include_inactive"]
        dry_run: bool = options["dry_run"]
        per_org_verbosity: int = options["per_org_verbosity"]

        orgs = self._select_orgs(
            org_slug=org_slug,
            include_inactive=include_inactive,
        )

        if not orgs:
            self.stdout.write(self.style.WARNING("No organizations matched — nothing to do."))
            return

        self._print_plan(
            orgs=orgs,
            app_label=app_label,
            include_inactive=include_inactive,
            dry_run=dry_run,
        )

        if dry_run:
            return

        failures: list[tuple[str, str]] = []
        for org in orgs:
            ok, error = self._migrate_one(
                org=org,
                app_label=app_label,
                verbosity=per_org_verbosity,
            )
            if not ok:
                failures.append((org.slug, error))

        self._print_summary(total=len(orgs), failures=failures)

        if failures:
            raise CommandError(f"migrate_tenants finished with {len(failures)} failure(s).")

    # ── selection ────────────────────────────────────────────────────────

    def _select_orgs(
        self,
        *,
        org_slug: str | None,
        include_inactive: bool,
    ) -> list[Organization]:
        qs = Organization.objects.all()

        if org_slug:
            qs = qs.filter(slug=org_slug)
            if not qs.exists():
                raise CommandError(f"No organization found with slug '{org_slug}'.")
        elif not include_inactive:
            qs = qs.filter(status__in=ORG_ACTIVE_STATUSES)

        return list(qs.order_by("name"))

    # ── output ───────────────────────────────────────────────────────────

    def _print_plan(
        self,
        *,
        orgs: list[Organization],
        app_label: str | None,
        include_inactive: bool,
        dry_run: bool,
    ) -> None:
        status_filter = "all statuses" if include_inactive else ", ".join(sorted(ORG_ACTIVE_STATUSES))
        app_filter = app_label if app_label else "all tenant apps"
        header = "DRY RUN — plan only" if dry_run else "Running migrate_tenants"

        self.stdout.write(self.style.MIGRATE_HEADING(header))
        self.stdout.write(f"  Status filter : {status_filter}")
        self.stdout.write(f"  App filter    : {app_filter}")
        self.stdout.write(f"  Orgs targeted : {len(orgs)}")
        self.stdout.write("")

        for org in orgs:
            self.stdout.write(f"  • {org.name:<40}  [{org.status:>11}]  db={org.db_name}")
        self.stdout.write("")

    def _print_summary(
        self,
        *,
        total: int,
        failures: list[tuple[str, str]],
    ) -> None:
        self.stdout.write("")
        ok_count = total - len(failures)

        if failures:
            self.stdout.write(self.style.ERROR(f"Failures ({len(failures)}):"))
            for slug, err in failures:
                self.stdout.write(self.style.ERROR(f"  ✗ {slug}: {err}"))

        summary_style = self.style.SUCCESS if not failures else self.style.WARNING
        self.stdout.write(summary_style(f"Done. {ok_count}/{total} organization(s) migrated."))

    # ── per-org migration ────────────────────────────────────────────────

    def _migrate_one(
        self,
        *,
        org: Organization,
        app_label: str | None,
        verbosity: int,
    ) -> tuple[bool, str]:
        self.stdout.write(self.style.MIGRATE_HEADING(f"→ {org.name} ({org.db_name})"))
        try:
            db_alias = register_org_database(org.db_name)
            if app_label:
                call_command("migrate", app_label, database=db_alias, verbosity=verbosity)
            else:
                call_command("migrate", database=db_alias, verbosity=verbosity)
        except Exception as exc:  # noqa: BLE001 — surface every migration failure
            self.stdout.write(self.style.ERROR(f"  ✗ {exc}"))
            return False, str(exc)

        return True, ""
