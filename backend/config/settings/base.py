from datetime import timedelta
from pathlib import Path

from decouple import config

# BASE_DIR points to backend/
BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config("SECRET_KEY")

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="",
    cast=lambda v: [h.strip() for h in v.split(",") if h.strip()],
)

# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
]

# Central DB apps
LOCAL_SHARED_APPS = [
    "apps.platform_audit",
    "apps.accounts",
    "apps.organizations",
    "apps.billing",
]

# Org DB apps — migrated per-organization, not on the central DB
LOCAL_TENANT_APPS = [
    "apps.audit",
    "apps.rbac",
    "apps.company",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_SHARED_APPS + LOCAL_TENANT_APPS

# ---------------------------------------------------------------------------
# Custom User Model
# ---------------------------------------------------------------------------

AUTH_USER_MODEL = "accounts.User"

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

MIDDLEWARE = [
    "apps.organizations.middleware.TenantMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # Billing guards — run last so they see the authenticated user and
    # resolved tenant org. They only block writes; reads always flow
    # through so users can view their billing state to fix problems.
    "apps.billing.middleware.SubscriptionStatusMiddleware",
    "apps.billing.middleware.StorageQuotaMiddleware",
]

# ---------------------------------------------------------------------------
# URLs / WSGI / ASGI
# ---------------------------------------------------------------------------

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# ---------------------------------------------------------------------------
# Templates
# ---------------------------------------------------------------------------

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME", default="vita_erp"),
        "USER": config("DB_USER", default="postgres"),
        "PASSWORD": config("DB_PASSWORD", default=""),
        "HOST": config("DB_HOST", default="localhost"),
        "PORT": config("DB_PORT", default="5432"),
    }
}

# Multi-tenant routing — shared apps → default DB, tenant apps → org DB
DATABASE_ROUTERS = ["apps.organizations.router.TenantDatabaseRouter"]

# ---------------------------------------------------------------------------
# Cache — overridden per environment (Redis in dev/prod, LocMem in test)
# ---------------------------------------------------------------------------

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}

# ---------------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------------------------------------------------------------------
# Django REST Framework
# ---------------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.accounts.authentication.CookieJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
        "apps.accounts.permissions.IsEmailVerified",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}

# ---------------------------------------------------------------------------
# JWT (Simple JWT) — cookie-based, not header-based
# ---------------------------------------------------------------------------

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ROTATE_REFRESH_TOKENS": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

# Cookie names — used by our custom token handling (services/auth.py)
VITA_ACCESS_COOKIE = "vita_access"
VITA_REFRESH_COOKIE = "vita_refresh"

# ---------------------------------------------------------------------------
# Internationalisation
# ---------------------------------------------------------------------------

USE_I18N = True
USE_TZ = True

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"

# Languages supported across the platform — must stay in sync with frontend I18N.locales.
# Note: Django uses "zh-hans" for Simplified Chinese; the frontend uses "zh".
# Accept-Language header partial matching handles the mapping automatically.
LANGUAGES = [
    ("en", "English"),
    ("zh-hans", "Chinese (Simplified)"),
    ("es", "Spanish"),
    ("hi", "Hindi"),
    ("ar", "Arabic"),
    ("fr", "French"),
    ("pt", "Portuguese"),
    ("ru", "Russian"),
    ("de", "German"),
    ("ja", "Japanese"),
    ("ko", "Korean"),
    ("it", "Italian"),
    ("tr", "Turkish"),
    ("id", "Indonesian"),
]

# Where Django looks for .po / .mo translation files
LOCALE_PATHS = [BASE_DIR / "locale"]

# ---------------------------------------------------------------------------
# Static files
# ---------------------------------------------------------------------------

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# ---------------------------------------------------------------------------
# Default primary key
# ---------------------------------------------------------------------------

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# Stripe — billing integration
# ---------------------------------------------------------------------------
#
# All three keys default to empty strings so local dev and test environments
# that don't touch Stripe can boot without setting env vars. Real operations
# will raise an explicit error at call time if keys are missing — see
# `apps.billing.stripe.client.get_stripe_client`.
#
# Variable conventions:
#   STRIPE_SECRET_KEY      — sk_test_* in dev, sk_live_* in prod
#   STRIPE_PUBLIC_KEY      — pk_test_* in dev, pk_live_* in prod
#   STRIPE_WEBHOOK_SECRET  — whsec_* (unique per endpoint; use `stripe listen`
#                            in dev to get a rotating one)
#   STRIPE_API_VERSION     — pin the Stripe API version the app is tested against
#                            so silent upstream changes don't break us

STRIPE_SECRET_KEY = config("STRIPE_SECRET_KEY", default="")
STRIPE_PUBLIC_KEY = config("STRIPE_PUBLIC_KEY", default="")
STRIPE_WEBHOOK_SECRET = config("STRIPE_WEBHOOK_SECRET", default="")
STRIPE_API_VERSION = config("STRIPE_API_VERSION", default="2026-03-25.dahlia")
