"""
Organogram layout service — manages the visual canvas state.

The layout is a singleton per org database: one row stores all node
positions and edge connections. Created on first access.
"""

from __future__ import annotations

from apps.rbac.models import OrganogramLayout


def get_layout() -> OrganogramLayout:
    """Return the org's organogram layout, creating it if absent."""
    layout = OrganogramLayout.objects.first()
    if layout is None:
        layout = OrganogramLayout.objects.create()
    return layout


def update_layout(
    nodes_layout: dict,
    edges: list,
) -> OrganogramLayout:
    """Full replacement of the canvas state."""
    layout = get_layout()
    layout.nodes_layout = nodes_layout
    layout.edges = edges
    layout.save(update_fields=["nodes_layout", "edges", "updated_at"])
    return layout
