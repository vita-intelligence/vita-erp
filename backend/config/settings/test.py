from .base import *  # noqa: F401, F403

DEBUG = False

# Use a fast in-memory SQLite database for tests.
# All models (shared + tenant) coexist in the same test DB.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Bypass the tenant router in tests — route everything to 'default'.
# This lets shared and tenant models coexist in the same SQLite DB,
# keeping tests fast without requiring PostgreSQL or CREATE DATABASE.
# Integration tests that specifically test multi-DB behavior should
# override this in their own conftest or test class.
DATABASE_ROUTERS = []

# Disable password hashing for speed
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# Email — capture instead of sending
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# Cookies — no HTTPS in tests
VITA_COOKIE_SECURE = False
VITA_COOKIE_SAMESITE = "Lax"
