"""
User views — profile, password change, email change, session management.

All endpoints require authentication (default IsAuthenticated).
"""

from __future__ import annotations

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.constants import (
    AUDIT_ALL_SESSIONS_REVOKED,
    AUDIT_EMAIL_CHANGED,
    AUDIT_PASSWORD_CHANGED,
    AUDIT_SESSION_REVOKED,
)
from apps.accounts.models import Session
from apps.accounts.serializers import (
    ChangeEmailSerializer,
    ChangePasswordSerializer,
    SessionSerializer,
    UserSerializer,
)
from apps.accounts.services.auth import log_auth_event


class MeView(APIView):
    """
    GET  /api/v1/auth/me/ — return current user profile.
    """

    from rest_framework.permissions import IsAuthenticated

    # Skip IsEmailVerified — unverified users need to see their own profile
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(UserSerializer(request.user).data)


class ChangePasswordView(APIView):
    """
    POST /api/v1/auth/me/password/ — change password.
    Requires current password for confirmation.
    """

    def post(self, request: Request) -> Response:
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])

        log_auth_event(request.user, AUDIT_PASSWORD_CHANGED, request)

        return Response({"status": "ok"})


class ChangeEmailView(APIView):
    """
    POST /api/v1/auth/me/email/ — change email.
    Requires current password for confirmation.
    Resets is_verified since the new email is unverified.
    """

    def post(self, request: Request) -> Response:
        serializer = ChangeEmailSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        old_email = request.user.email
        new_email = serializer.validated_data["new_email"]

        request.user.email = new_email
        request.user.is_verified = False
        request.user.save(update_fields=["email", "is_verified"])

        log_auth_event(
            request.user,
            AUDIT_EMAIL_CHANGED,
            request,
            metadata={"old_email": old_email, "new_email": new_email},
        )

        return Response(UserSerializer(request.user).data)


class SessionListView(APIView):
    """
    GET    /api/v1/auth/sessions/     — list active sessions.
    DELETE /api/v1/auth/sessions/     — revoke all sessions except current.
    """

    def get(self, request: Request) -> Response:
        sessions = Session.objects.filter(user=request.user, is_active=True)
        serializer = SessionSerializer(
            sessions,
            many=True,
            context={"request": request},
        )
        return Response(serializer.data)

    def delete(self, request: Request) -> Response:
        """Revoke all sessions except the current one."""
        from django.conf import settings

        from apps.accounts.services.auth import hash_token

        current_refresh = request.COOKIES.get(settings.VITA_REFRESH_COOKIE, "")
        current_hash = hash_token(current_refresh) if current_refresh else ""

        revoked = (
            Session.objects.filter(
                user=request.user,
                is_active=True,
            )
            .exclude(
                refresh_token_hash=current_hash,
            )
            .update(is_active=False)
        )

        log_auth_event(
            request.user,
            AUDIT_ALL_SESSIONS_REVOKED,
            request,
            metadata={"revoked_count": revoked},
        )

        return Response({"status": "ok", "revoked_count": revoked})


class SessionRevokeView(APIView):
    """
    DELETE /api/v1/auth/sessions/{session_id}/ — revoke a specific session.
    """

    def delete(self, request: Request, session_id: str) -> Response:
        session = Session.objects.filter(
            id=session_id,
            user=request.user,
            is_active=True,
        ).first()

        if not session:
            return Response(
                {"error": "session_not_found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        session.is_active = False
        session.save(update_fields=["is_active"])

        log_auth_event(
            request.user,
            AUDIT_SESSION_REVOKED,
            request,
            metadata={"session_id": str(session_id)},
        )

        return Response({"status": "ok"})
