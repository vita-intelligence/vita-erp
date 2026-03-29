"""
Password reset — token generation, email sending, and password update.

Tokens are stored in cache (Redis) with 1h TTL — shorter than email verification
because password reset is a higher-risk operation.
Emails use Django templates (templates/emails/) for easy translation.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from apps.accounts.constants import AUDIT_PASSWORD_RESET_COMPLETED, AUDIT_PASSWORD_RESET_REQUESTED
from apps.accounts.services.auth import log_auth_event

if TYPE_CHECKING:
    from django.http import HttpRequest

    from apps.accounts.models import User

# Token lives 1 hour — tighter window than email verification
PASSWORD_RESET_TOKEN_TTL = 60 * 60


def _cache_key(token: str) -> str:
    return f"password_reset:{token}"


def generate_reset_token(user: User) -> str:
    """Generate a unique password reset token and store user_id in cache."""
    token = uuid.uuid4().hex
    cache.set(_cache_key(token), str(user.id), PASSWORD_RESET_TOKEN_TTL)
    return token


def verify_reset_token(token: str) -> str | None:
    """Look up the token in cache. Returns user_id if valid, None if expired/invalid."""
    user_id: str | None = cache.get(_cache_key(token))
    if user_id:
        return str(user_id)
    return None


def consume_reset_token(token: str) -> None:
    """Delete the token from cache after successful reset. One-time use."""
    cache.delete(_cache_key(token))


def send_password_reset_email(user: User, token: str) -> None:
    """
    Send the password reset email using Django templates.
    Templates live in templates/emails/ and support i18n via {% blocktrans %}.
    In dev (console backend): prints to terminal.
    In prod: sends real email via configured backend.
    """
    frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    reset_url = f"{frontend_url}/reset-password?token={token}"

    context = {
        "reset_url": reset_url,
        "user_email": user.email,
    }

    subject = render_to_string("emails/reset_password_subject.txt", context).strip()
    text_body = render_to_string("emails/reset_password.txt", context).strip()
    html_body = render_to_string("emails/reset_password.html", context)

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@vita-erp.com"),
        to=[user.email],
    )
    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)


def request_password_reset(user: User, request: HttpRequest) -> None:
    """Generate token, send email, and log the event."""
    token = generate_reset_token(user)
    send_password_reset_email(user, token)
    log_auth_event(user, AUDIT_PASSWORD_RESET_REQUESTED, request)


def reset_password(user: User, new_password: str, token: str, request: HttpRequest) -> list[str]:
    """
    Validate and set the new password.

    Returns an empty list on success, or a list of error codes on validation failure.
    Consumes the token only on success.
    """
    try:
        validate_password(new_password, user=user)
    except DjangoValidationError as e:
        codes: list[str] = []
        for error in e.error_list:
            codes.append(error.code or "password_invalid")
        return codes

    user.set_password(new_password)
    user.save(update_fields=["password"])

    consume_reset_token(token)
    log_auth_event(user, AUDIT_PASSWORD_RESET_COMPLETED, request)

    return []
