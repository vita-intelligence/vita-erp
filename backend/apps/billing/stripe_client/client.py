"""
Stripe SDK accessor.

Binds `stripe.api_key` / `stripe.api_version` from Django settings lazily
and returns the configured `stripe` module. All billing code that needs
to talk to Stripe should go through `get_stripe()` so we have a single
place that controls configuration and validation.
"""

from __future__ import annotations

from types import ModuleType
from typing import Any, Final

import stripe as stripe_module
from django.conf import settings

_configured: bool = False


class StripeNotConfiguredError(RuntimeError):
    """Raised when Stripe operations are attempted but no secret key is set.

    This is deliberately distinct from any of Stripe's own exceptions so
    callers can branch on "we never configured Stripe" vs "Stripe rejected
    our request." Typical scenarios:

    - Local dev without a `.env` entry for STRIPE_SECRET_KEY
    - CI / test runs that shouldn't touch Stripe at all
    - A misconfigured deploy where the secret never made it to the pod
    """


def _ensure_configured() -> None:
    """Idempotently bind secret key + API version to the stripe module.

    We cannot do this at import time because Django settings may not be
    fully loaded yet (e.g., during manage.py startup or pytest collection).
    Running it on every call is essentially free — just a module-level
    flag check after the first call.
    """
    global _configured
    if _configured:
        return

    secret_key: str = getattr(settings, "STRIPE_SECRET_KEY", "") or ""
    if not secret_key:
        raise StripeNotConfiguredError(
            "STRIPE_SECRET_KEY is not set. Add it to your environment "
            "(e.g., `.env` in dev, secret manager in prod) before calling "
            "any Stripe operation. For local dev, use a `sk_test_*` key "
            "from https://dashboard.stripe.com/test/apikeys.",
        )

    stripe_module.api_key = secret_key
    api_version: str = getattr(settings, "STRIPE_API_VERSION", "") or ""
    if api_version:
        stripe_module.api_version = api_version

    _configured = True


def get_stripe() -> ModuleType:
    """Return the configured `stripe` SDK module.

    Raises `StripeNotConfiguredError` if no secret key is available. Idempotent —
    safe to call on every request.
    """
    _ensure_configured()
    return stripe_module


def stripe_to_dict(stripe_obj: Any) -> dict[str, Any]:
    """Convert a Stripe SDK object to a fully-nested plain Python dict.

    Stripe SDK v15 `StripeObject` supports attribute access and bracket
    access but NOT the dict `.get()` method, and `dict(obj)` fails because
    the iterator protocol returns integer keys. Any code path that wants
    to use dict operations (`.get(k, default)`, `dict.update(...)`, etc.)
    on Stripe-returned values must convert at the boundary with this
    helper first.

    Handles None gracefully (returns an empty dict) so callers can
    write `stripe_to_dict(session.metadata)` without a nullcheck.
    """
    if stripe_obj is None:
        return {}
    if hasattr(stripe_obj, "to_dict_recursive"):
        result: dict[str, Any] = stripe_obj.to_dict_recursive()
        return result
    if hasattr(stripe_obj, "to_dict"):
        result = stripe_obj.to_dict()
        return result
    return dict(stripe_obj)


# ── Convenience re-exports ─────────────────────────────────────────────────
# Common Stripe exception types that callers want to catch. Re-exporting
# them here lets downstream code import everything from one place:
#
#   from apps.billing.stripe_client import get_stripe, StripeError, SignatureVerificationError
#
# without needing a separate `import stripe` that could shadow the package
# subdirectory.

StripeError: Final = stripe_module.StripeError
InvalidRequestError: Final = stripe_module.InvalidRequestError
SignatureVerificationError: Final = stripe_module.SignatureVerificationError
