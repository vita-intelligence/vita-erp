"""
Auth views — register, login, refresh, logout.

Views are thin — validate input via serializer, delegate to service layer,
return response. No business logic here. Rate limiting on all public endpoints.
"""

from __future__ import annotations

from django.conf import settings
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.constants import AUDIT_LOGIN_FAILED
from apps.accounts.serializers import LoginSerializer, RegisterSerializer, UserSerializer
from apps.accounts.services.auth import (
    clear_auth_cookies,
    log_auth_event,
    login_user,
    logout_user,
    rotate_refresh_token,
)
from apps.accounts.services.rate_limit import (
    check_login_allowed,
    check_register_allowed,
    clear_login_attempts,
    record_login_attempt,
    record_register_attempt,
)
from apps.accounts.services.verification import (
    confirm_email,
    generate_verification_token,
    send_verification_email,
    verify_token,
)

RATE_LIMITED_RESPONSE = Response(
    {"error": "rate_limited"},
    status=status.HTTP_429_TOO_MANY_REQUESTS,
)


class RegisterView(APIView):
    """POST /api/v1/auth/register/ — create a new user account + send verification email."""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        if not check_register_allowed(request):
            return RATE_LIMITED_RESPONSE

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        record_register_attempt(request)

        # Send verification email (prints to console in dev)
        token = generate_verification_token(user)
        send_verification_email(user, token)

        # Auto-login (user can browse but is_verified=False until email confirmed)
        response = Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )
        login_user(user, request, response)

        return response


class LoginView(APIView):
    """POST /api/v1/auth/login/ — authenticate with email + password."""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        email = (request.data.get("email") or "").lower().strip()

        if not check_login_allowed(request, email):
            return RATE_LIMITED_RESPONSE

        serializer = LoginSerializer(data=request.data, context={"request": request})

        if not serializer.is_valid():
            # Record failed attempt
            record_login_attempt(request, email)

            # Log to audit if user exists
            if email:
                from apps.accounts.models import User

                user = User.objects.filter(email=email).first()
                if user:
                    log_auth_event(user, AUDIT_LOGIN_FAILED, request)

            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

        user = serializer.validated_data["user"]

        # Clear failed attempts on success
        clear_login_attempts(request, email)

        response = Response(UserSerializer(user).data)
        login_user(user, request, response)

        return response


class RefreshView(APIView):
    """POST /api/v1/auth/refresh/ — rotate refresh token, get new access token."""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        refresh_token = request.COOKIES.get(settings.VITA_REFRESH_COOKIE)

        if not refresh_token:
            return Response(
                {"error": "refresh_token_missing"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        from rest_framework_simplejwt.exceptions import TokenError
        from rest_framework_simplejwt.tokens import RefreshToken

        try:
            token = RefreshToken(refresh_token)
            user_id = token.payload.get("user_id")
        except TokenError:
            response = Response(
                {"error": "refresh_token_invalid"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            clear_auth_cookies(response)
            return response

        from apps.accounts.models import User

        user = User.objects.filter(id=user_id, is_active=True).first()
        if not user:
            response = Response(
                {"error": "user_not_found"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            clear_auth_cookies(response)
            return response

        response = Response({"status": "ok"})
        success = rotate_refresh_token(user, refresh_token, request, response)

        if not success:
            return Response(
                {"error": "refresh_token_reused"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return response


class VerifyEmailView(APIView):
    """POST /api/v1/auth/verify-email/ — confirm email with token from verification link."""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        token = request.data.get("token", "")
        if not token:
            return Response(
                {"error": "token_required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_id = verify_token(token)
        if not user_id:
            return Response(
                {"error": "token_invalid_or_expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from apps.accounts.models import User

        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response(
                {"error": "user_not_found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_verified:
            return Response({"status": "already_verified"})

        confirm_email(user, request)
        return Response({"status": "ok"})


class ResendVerificationView(APIView):
    """POST /api/v1/auth/resend-verification/ — resend verification email."""

    from rest_framework.permissions import IsAuthenticated

    # Authenticated but skip IsEmailVerified — unverified users need this
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        if request.user.is_verified:
            return Response({"status": "already_verified"})

        token = generate_verification_token(request.user)
        send_verification_email(request.user, token)
        return Response({"status": "ok"})


class LogoutView(APIView):
    """POST /api/v1/auth/logout/ — revoke session and clear cookies."""

    from rest_framework.permissions import IsAuthenticated

    # Skip IsEmailVerified — unverified users can still logout
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        response = Response({"status": "ok"})
        logout_user(request.user, request, response)
        return response
