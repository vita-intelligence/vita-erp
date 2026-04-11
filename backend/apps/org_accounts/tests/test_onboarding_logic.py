"""
Pure unit tests for the form-walker + recompute logic.

These don't touch Django models — they exercise the
`is_member_missing_required_fields` function with hand-crafted form
definitions and response payloads. The interesting cases are exactly
the user's "what if the admin adds a new required field later"
scenario from the plan.
"""

# mypy: ignore-errors

from __future__ import annotations

from apps.org_accounts.services.onboarding import is_member_missing_required_fields


def _form(*fields: dict) -> dict:
    return {"version": 1, "elements": list(fields)}


def _required(name: str, kind: str = "text", **extra) -> dict:
    """Build a required field. The form constructor uses `id` as the
    canonical identifier — `name` here is just the test parameter."""
    return {
        "kind": "field",
        "type": kind,
        "id": name,
        "label": name,
        "required": True,
        "hidden": False,
        **extra,
    }


def _optional(name: str, kind: str = "text", **extra) -> dict:
    return {
        "kind": "field",
        "type": kind,
        "id": name,
        "label": name,
        "required": False,
        "hidden": False,
        **extra,
    }


def _group(name: str, *children: dict) -> dict:
    return {"kind": "group", "id": name, "elements": list(children)}


# ── Empty / trivial cases ─────────────────────────────────────────────────


def test_no_form_no_responses_is_complete():
    assert is_member_missing_required_fields(None, None) is False


def test_empty_form_is_always_complete():
    assert is_member_missing_required_fields(_form(), {}) is False


def test_only_optional_fields_is_always_complete():
    form = _form(_optional("middle_name"))
    assert is_member_missing_required_fields(form, {}) is False


# ── The "happy path" ──────────────────────────────────────────────────────


def test_required_field_present_is_complete():
    form = _form(_required("first_name"), _required("last_name"))
    assert (
        is_member_missing_required_fields(
            form,
            {"first_name": "Jane", "last_name": "Doe"},
        )
        is False
    )


def test_required_field_empty_string_is_missing():
    form = _form(_required("first_name"))
    assert is_member_missing_required_fields(form, {"first_name": ""}) is True


def test_required_field_whitespace_only_is_missing():
    form = _form(_required("first_name"))
    assert is_member_missing_required_fields(form, {"first_name": "   "}) is True


def test_required_field_none_is_missing():
    form = _form(_required("first_name"))
    assert is_member_missing_required_fields(form, {"first_name": None}) is True


def test_required_field_completely_absent_is_missing():
    form = _form(_required("first_name"))
    assert is_member_missing_required_fields(form, {}) is True


# ── The user's re-onboarding scenarios ────────────────────────────────────


def test_admin_adds_new_required_field_user_is_relocked():
    """Existing user filled v1 (first/last). Admin adds Department as
    required → recompute should flag the user as needing onboarding."""
    new_form = _form(
        _required("first_name"),
        _required("last_name"),
        _required("department"),  # NEW
    )
    old_responses = {"first_name": "Jane", "last_name": "Doe"}
    assert is_member_missing_required_fields(new_form, old_responses) is True


def test_admin_adds_new_optional_field_user_stays_unblocked():
    """Adding an optional field never re-locks anyone."""
    new_form = _form(
        _required("first_name"),
        _required("last_name"),
        _optional("nickname"),  # NEW
    )
    old_responses = {"first_name": "Jane", "last_name": "Doe"}
    assert is_member_missing_required_fields(new_form, old_responses) is False


def test_admin_makes_existing_field_required_after_user_left_it_empty():
    """Department was optional and user skipped it. Admin makes it
    required → user must re-fill."""
    new_form = _form(
        _required("first_name"),
        _required("department"),  # was optional, now required
    )
    old_responses = {"first_name": "Jane"}  # user never filled department
    assert is_member_missing_required_fields(new_form, old_responses) is True


def test_admin_removes_required_field_user_unlocks():
    """Department was required and user has it. Admin removes the field
    entirely → recompute should NOT flag the user."""
    new_form = _form(_required("first_name"))
    old_responses = {"first_name": "Jane", "department": "Sales"}
    assert is_member_missing_required_fields(new_form, old_responses) is False


def test_admin_relaxes_required_to_optional_unlocks_user():
    """Department was required, user left empty. Admin makes it optional."""
    new_form = _form(_required("first_name"), _optional("department"))
    old_responses = {"first_name": "Jane"}
    assert is_member_missing_required_fields(new_form, old_responses) is False


# ── Visibility rules ──────────────────────────────────────────────────────


def test_hidden_required_field_does_not_block():
    """A required field hidden by an unsatisfied `relevant` expression
    must not count toward the missing-fields check."""
    form = _form(
        _required("has_company_car", kind="select_one"),
        _required(
            "license_plate",
            relevant="has_company_car == 'yes'",
        ),
    )
    responses = {"has_company_car": "no"}  # license_plate hidden
    assert is_member_missing_required_fields(form, responses) is False


def test_visible_required_field_via_relevant_blocks():
    """When the visibility expression is satisfied, the dependent
    required field DOES count."""
    form = _form(
        _required("has_company_car"),
        _required("license_plate", relevant="has_company_car == 'yes'"),
    )
    responses = {"has_company_car": "yes"}  # license_plate now visible + missing
    assert is_member_missing_required_fields(form, responses) is True


# ── Groups (nested fields) ────────────────────────────────────────────────


def test_required_field_inside_group_is_walked():
    """The walker descends into group elements; missing required
    fields inside a group still trigger re-onboarding."""
    form = _form(
        _group(
            "personal",
            _required("first_name"),
            _required("last_name"),
        ),
    )
    assert is_member_missing_required_fields(form, {"first_name": "Jane"}) is True
    assert is_member_missing_required_fields(form, {"first_name": "Jane", "last_name": "Doe"}) is False


# ── Multi-value fields ────────────────────────────────────────────────────


def test_required_select_multiple_empty_list_is_missing():
    form = _form(_required("languages", kind="select_multiple"))
    assert is_member_missing_required_fields(form, {"languages": []}) is True


def test_required_select_multiple_with_values_is_complete():
    form = _form(_required("languages", kind="select_multiple"))
    assert is_member_missing_required_fields(form, {"languages": ["en", "fr"]}) is False
