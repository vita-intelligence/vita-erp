"""
Cookie-based JWT authentication for Django REST Framework.

Reads the access token from the httpOnly cookie instead of the
Authorization header. This is the only authentication class used
in Vita ERP — no header-based auth.
"""

from __future__ import annotations

from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """Read JWT access token from httpOnly cookie instead of Authorization header."""

    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.VITA_ACCESS_COOKIE)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
