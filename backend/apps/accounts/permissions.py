"""
Custom permission classes for the accounts app.

These are used as DRF permission_classes on views to enforce
access rules beyond simple authentication.
"""

from __future__ import annotations

from rest_framework.permissions import BasePermission


class IsEmailVerified(BasePermission):
    """
    Blocks access for users who haven't verified their email.

    Returns error code 'email_not_verified' so the frontend can
    show the appropriate message/redirect.
    """

    message = "email_not_verified"

    def has_permission(self, request, view) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_verified
