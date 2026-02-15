"""
System permission catalog for Vita ERM.

Permissions represent atomic capabilities that can be assigned
to roles. Roles are then assigned to memberships inside companies.

Admins combine these permissions to create custom roles.
"""

PERMISSION_CATALOG = {
    "companies": {
        "label": "Company Management",
        "permissions": {
            "companies.view": "View company details",
            "companies.edit": "Edit company details",
        },
    },

    "members": {
        "label": "Member Management",
        "permissions": {
            "members.view": "View company members",
            "members.invite": "Invite new members",
            "members.remove": "Remove members",
        },
    },

    "roles": {
        "label": "Role & Access Control",
        "permissions": {
            "roles.view": "View roles",
            "roles.create": "Create roles",
            "roles.edit": "Edit roles",
            "roles.delete": "Delete roles",
            "roles.assign": "Assign roles to members",
        },
    },

    "items": {
        "label": "Items Registration",
        "permissions": {
            "items.view": "View items",
            "items.create": "Create items",
            "items.edit": "Edit items",
            "items.delete": "Delete items"
        },
    },

    "procurements": {
        "label": "Procurements Operations",
        "permissions": {
            "procurements.view": "View procurements",
        }
    },

    "suppliers": {
        "label": "Suppliers Registration",
        "permissions": {
            "suppliers.view": "View suppliers",
            "suppliers.edit": "Edit suppliers",
            "suppliers.delete": "Delete suppliers",
            "suppliers.create": "Create suppliers",
        }
    }
}


"""
Helper that runs in migration file
so whenver a new db created we have same
permissions consistent in different environments.
"""
def iter_permissions():
    for module in PERMISSION_CATALOG.values():
        for key, desc in module["permissions"].items():
            yield key, desc