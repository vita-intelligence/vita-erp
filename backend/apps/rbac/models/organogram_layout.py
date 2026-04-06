"""
OrganogramLayout — singleton per org database.

Stores the visual canvas state for the organogram chart: node positions
and edge connections. This is purely a UI/presentation concern — it does
not carry domain meaning (no permission inheritance via edges).

One row per org database, created on first access (get-or-create).
The entire canvas is saved/loaded in a single PUT/GET round-trip.
"""

from __future__ import annotations

import uuid

from django.db import models


class OrganogramLayout(models.Model):
    """Visual layout for the organization chart canvas.

    nodes_layout: mapping of role UUID → {x, y} canvas coordinates.
    edges: list of {source, target} UUID pairs (visual connections).
    """

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    nodes_layout = models.JSONField(
        default=dict,
        help_text=('Map of role UUID → {x: float, y: float}. Example: {"<uuid>": {"x": 100, "y": 200}}'),
    )
    edges = models.JSONField(
        default=list,
        help_text=('List of visual connections between roles. Example: [{"source": "<uuid>", "target": "<uuid>"}]'),
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "rbac_organogram_layout"

    def __str__(self) -> str:
        node_count = len(self.nodes_layout) if isinstance(self.nodes_layout, dict) else 0
        edge_count = len(self.edges) if isinstance(self.edges, list) else 0
        return f"OrganogramLayout ({node_count} nodes, {edge_count} edges)"

    def save(self, *args: object, **kwargs: object) -> None:
        """Enforce singleton — only one layout per org database."""
        if self._state.adding and OrganogramLayout.objects.exists():
            existing = OrganogramLayout.objects.first()
            if existing:
                self.pk = existing.pk
                self._state.adding = False
        super().save(*args, **kwargs)
