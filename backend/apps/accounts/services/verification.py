"""
Email verification — token generation, sending, and confirmation.

Tokens are stored in cache (Redis) with 24h TTL.
Emails use Django templates (templates/emails/) for easy translation.
In dev, the email prints to console. In prod, real email service.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from django.conf import settings
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from apps.accounts.constants import AUDIT_EMAIL_VERIFIED
from apps.accounts.services.auth import log_auth_event

if TYPE_CHECKING:
    from django.http import HttpRequest

    from apps.accounts.models import User

# Token lives 24 hours
VERIFICATION_TOKEN_TTL = 60 * 60 * 24


def _cache_key(token: str) -> str:
    return f"email_verification:{token}"


def generate_verification_token(user: User) -> str:
    """Generate a unique verification token and store user_id in cache."""
    token = uuid.uuid4().hex
    cache.set(_cache_key(token), str(user.id), VERIFICATION_TOKEN_TTL)
    return token


def verify_token(token: str) -> str | None:
    """Look up the token in cache. Returns user_id if valid, None if expired/invalid."""
    user_id = cache.get(_cache_key(token))
    if user_id:
        cache.delete(_cache_key(token))  # One-time use
    return user_id


def send_verification_email(user: User, token: str) -> None:
    """
    Send the verification email using Django templates.
    Templates live in templates/emails/ and support i18n via {% blocktrans %}.
    In dev (console backend): prints to terminal.
    In prod: sends real email via configured backend.
    """
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    verification_url = f"{frontend_url}/verify-email?token={token}"

    context = {
        "verification_url": verification_url,
        "user_email": user.email,
    }

    subject = render_to_string("emails/verify_email_subject.txt", context).strip()
    text_body = render_to_string("emails/verify_email.txt", context).strip()
    html_body = render_to_string("emails/verify_email.html", context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@vita-erp.com"),
        to=[user.email],
    )
    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)


def confirm_email(user: User, request: HttpRequest) -> None:
    """Mark the user's email as verified and log the event."""
    user.is_verified = True
    user.save(update_fields=["is_verified"])
    log_auth_event(user, AUDIT_EMAIL_VERIFIED, request)
