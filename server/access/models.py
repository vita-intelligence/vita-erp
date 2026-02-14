from django.conf import settings
from django.db import models


class Membership(models.Model):
    """
    Links a user to a company.

    This is the tenant-aware “identity” of a user inside a company.
    All company-scoped access control (roles/teams/etc.) should attach
    to Membership rather than directly to the User model.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memberships",
    )
    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="memberships",
    )

    # Soft membership toggle (useful for suspensions without deleting history)
    is_active = models.BooleanField(default=True)

    # Audit timestamp: when the user joined the company in this system
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "memberships"
        verbose_name = "Membership"
        verbose_name_plural = "Memberships"
        ordering = ["-joined_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "company"],
                name="uniq_user_company_membership",
            )
        ]
        indexes = [
            models.Index(fields=["user", "is_active"], name="idx_membership_user_active"),
        ]

    def __str__(self) -> str:
        # Avoid assuming a custom User has `username`
        return f"{self.user} | {self.company.name}"


class Role(models.Model):
    """
    Company-scoped role defined by company admins.

    Roles are labels that bundle permissions (via RolePermission) and are assigned
    to members (via MembershipRole). Roles are unique per company by name.
    """

    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="roles",
    )
    name = models.CharField(
        max_length=80,
        db_index=True,
        help_text="Role name within the company.",
    )
    description = models.TextField(blank=True, default="")

    # Useful when you seed default roles like Owner/Admin and want to protect them
    is_system = models.BooleanField(default=False)

    class Meta:
        db_table = "roles"
        verbose_name = "Role"
        verbose_name_plural = "Roles"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["company", "name"],
                name="uniq_role_name_per_company",
            )
        ]

    def __str__(self) -> str:
        return f"{self.company.name} | {self.name}"


class Permission(models.Model):
    """
    System-defined capability (atomic access unit).

    Permissions are defined by developers (source of truth = permissions catalog),
    stored in DB for UI/role editing, and assigned to roles via RolePermission.

    Key format (recommended): "<module>.<action>" e.g. "members.invite"
    """

    key = models.CharField(
        max_length=120,
        unique=True,
        help_text='System permission key (e.g. "roles.create").',
    )
    description = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "permissions"
        ordering = ["key"]

    def __str__(self) -> str:
        return self.key


class RolePermission(models.Model):
    """
    Role ↔ Permission mapping (which permissions a role grants).
    """

    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="role_permissions",
    )
    permission = models.ForeignKey(
        Permission,
        on_delete=models.CASCADE,
        related_name="permission_roles",
    )

    class Meta:
        db_table = "role_permissions"
        constraints = [
            models.UniqueConstraint(
                fields=["role", "permission"],
                name="uniq_role_permission",
            )
        ]

    def __str__(self) -> str:
        return f"{self.role} → {self.permission.key}"


class MembershipRole(models.Model):
    """
    Membership ↔ Role mapping (which roles a member has in a company).
    """

    membership = models.ForeignKey(
        Membership,
        on_delete=models.CASCADE,
        related_name="membership_roles",
    )
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="assigned_memberships",
    )

    class Meta:
        db_table = "membership_roles"
        constraints = [
            models.UniqueConstraint(
                fields=["membership", "role"],
                name="uniq_membership_role",
            )
        ]

    def __str__(self) -> str:
        return f"{self.membership} → {self.role.name}"