from .base import *  # noqa: F401, F403

DEBUG = False

# Use a fast in-memory SQLite database for tests
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Disable password hashing for speed
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
