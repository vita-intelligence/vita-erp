from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .utils import set_jwt_cookies, clear_jwt_cookies


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user
    
    POST /api/auth/register
    {
        "email": "user@example.com",
        "username": "johndoe",
        "password": "SecurePass123"
    }
    """
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Prepare response
        response_data = {
            'user': UserSerializer(user).data,
            'message': 'Registration successful'
        }
        
        response = Response(response_data, status=status.HTTP_201_CREATED)
        
        # Set tokens in cookies
        set_jwt_cookies(response, access_token, refresh)
        
        return response
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login user
    
    POST /api/auth/login
    {
        "email": "user@example.com",
        "password": "SecurePass123"
    }
    """
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    # Authenticate by email (find user by email, then check password)
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.get(email=email)
        
        # Check password
        if not user.check_password(password):
            return Response(
                {'detail': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except User.DoesNotExist:
        return Response(
            {'detail': 'Invalid email or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check if user is active
    if not user.is_active:
        return Response(
            {'detail': 'User account is disabled'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    
    # Prepare response
    response_data = {
        'user': UserSerializer(user).data,
        'message': 'Login successful'
    }
    
    response = Response(response_data, status=status.HTTP_200_OK)
    
    # Set tokens in cookies
    set_jwt_cookies(response, access_token, refresh)
    
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout user (clear JWT cookies)
    
    POST /api/auth/logout
    """
    response = Response(
        {'message': 'Logout successful'},
        status=status.HTTP_200_OK
    )
    
    # Clear JWT cookies
    clear_jwt_cookies(response)
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    """
    Get current user info
    
    GET /api/auth/user
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    Refresh access token using refresh token from cookie
    
    POST /api/auth/refresh
    """
    refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
    
    if not refresh_token:
        return Response(
            {'detail': 'Refresh token not found'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        
        response = Response(
            {'message': 'Token refreshed'},
            status=status.HTTP_200_OK
        )
        
        # Set new access token in cookie
        response.set_cookie(
            key=settings.JWT_AUTH_COOKIE,
            value=str(access_token),
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            secure=settings.JWT_AUTH_COOKIE_SECURE,
            httponly=settings.JWT_AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.JWT_AUTH_COOKIE_SAMESITE,
            path=settings.JWT_AUTH_COOKIE_PATH,
        )
        
        return response
        
    except Exception as e:
        return Response(
            {'detail': 'Invalid refresh token'},
            status=status.HTTP_401_UNAUTHORIZED
        )