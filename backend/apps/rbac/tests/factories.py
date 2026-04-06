import factory

from apps.rbac.models import OrganogramLayout, Role, RolePermission, UserRole


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Role

    name = factory.Sequence(lambda n: f"Role {n}")
    description = ""
    is_system = False


class RolePermissionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = RolePermission

    role = factory.SubFactory(RoleFactory)
    module_code = "company_settings"
    action = "read"


class UserRoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserRole

    role = factory.SubFactory(RoleFactory)
    user_id = factory.Faker("uuid4")


class OrganogramLayoutFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganogramLayout

    nodes_layout: dict = {}  # noqa: RUF012
    edges: list = []  # noqa: RUF012
