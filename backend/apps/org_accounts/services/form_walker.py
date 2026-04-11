"""
Form definition walker.

Tiny utility shared by the recompute logic and any future code that
needs to iterate the fields in a form definition. The form
constructor's schema (mirrored in
`frontend/src/components/form-constructor/types.ts`) is a recursive
tree of `field` and `group` elements; this module flattens it.

**Field identifier convention:** the form constructor uses `id` as
the only field identifier (no separate `name`). Admins can set the
id to a human-readable string like `"first_name"` for queryable
dataset semantics. All response payloads are keyed by id everywhere
in this codebase.
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Any


def walk_fields(definition: dict[str, Any] | None) -> Iterator[dict[str, Any]]:
    """Yield every `field` element in a form definition, depth-first.

    `group` elements are descended into. The yielded dicts are the
    raw element nodes, so callers can read `id`, `required`, `type`,
    etc. directly.
    """
    if not isinstance(definition, dict):
        return
    elements = definition.get("elements") or []
    stack: list[Any] = list(reversed(elements))
    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        kind = node.get("kind")
        if kind == "field":
            yield node
        elif kind == "group":
            children = node.get("elements") or []
            stack.extend(reversed(children))


def is_value_present(value: Any) -> bool:
    """Truthy in the SurveyCTO sense — present and non-empty.

    A submission satisfies a required field iff this returns True
    for the stored value. We deliberately don't validate type or
    constraint here — that's the FormViewer's job at submit time.
    Re-onboarding only triggers on *missing* fields, not on values
    that fail a tightened constraint.
    """
    if value is None:
        return False
    if isinstance(value, str):
        return value.strip() != ""
    if isinstance(value, list | tuple | dict | set):
        return len(value) > 0
    return True


def collect_required_field_ids(definition: dict[str, Any] | None) -> list[str]:
    """Return the ids of every currently-required field in the form.

    Fields hidden by an unsatisfied visibility rule are excluded — but
    visibility evaluation against actual response data is done by the
    caller because it needs the response context. This helper just
    returns fields that are *unconditionally* required.
    """
    ids: list[str] = []
    for field in walk_fields(definition):
        field_id = field.get("id")
        if field_id and field.get("required"):
            ids.append(str(field_id))
    return ids
