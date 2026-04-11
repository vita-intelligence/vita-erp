"""
Stripe client integration — lazy, configured, module-level.

Everything Stripe-facing imports the singleton accessor `get_stripe()`
from this package rather than touching `stripe` directly. The accessor:

- Binds `stripe.api_key` and `stripe.api_version` from Django settings on
  first use, not at import time, so unit tests and fake-key dev envs can
  boot without real credentials.
- Raises `StripeNotConfiguredError` — a clear, actionable error — if anything
  tries to make a real call while `STRIPE_SECRET_KEY` is empty.
- Returns the same `stripe` module reference every time, so downstream
  code writes `stripe = get_stripe(); stripe.Customer.create(...)` and
  the SDK is fully typed.

Why not `stripe.api_key = settings.STRIPE_SECRET_KEY` at import time?
Because the settings might not be loaded in some contexts (management
commands, test collection), and because it hides the "no key configured"
error behind cryptic Stripe HTTP 401s at call time.
"""

from apps.billing.stripe_client.client import (
    InvalidRequestError,
    SignatureVerificationError,
    StripeError,
    StripeNotConfiguredError,
    get_stripe,
    stripe_to_dict,
)

__all__ = [
    "InvalidRequestError",
    "SignatureVerificationError",
    "StripeError",
    "StripeNotConfiguredError",
    "get_stripe",
    "stripe_to_dict",
]
