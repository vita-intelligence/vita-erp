import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url


# ========== INITS ==========
load_dotenv()
# ===========================


# ========== PROJECT META ==========
PROJECT_NAME = os.getenv("DJANGO_PROJECT_NAME", "Configure name in env")
# ==================================


# ========== MAIN SETTINGS ==========
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-secret")
DEBUG = os.getenv("DJANGO_DEBUG", os.getenv("DJANGO-DEBUG", "true")).lower() == "true"
HOSTS = os.getenv("DJANGO_HOSTS", "localhost,127.0.0.1").split(",")
HOSTS_URLS = os.getenv("DJANGO_HOSTS_URLS","http://localhost:3000,http://127.0.0.1:3000").split(",")
DB_URL = os.getenv("DJANGO_DB_URL")
ALLOWED_HOSTS = HOSTS
CORS_ALLOWED_ORIGINS = HOSTS_URLS
CSRF_TRUSTED_ORIGINS = HOSTS_URLS
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
CSRF_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
# ===================================


# ========== DEFINITION ==========
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'
# ================================


# ========== DATABASE ==========
if DB_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DB_URL,
            conn_max_age=600,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
# ==============================


# ========== AUTH ==========
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
# ==========================


# ========== INTERNATIONALIZATION (I18N) ==========
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True
# ==========================================


# ========== STATIC & FILES ==========
STATIC_URL = 'static/'
# ====================================


# ========== MODEL & DB DEFAULTS ==========
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# =========================================


# ========== STARTUP MESSAGE ==========
module = sys.modules[__name__]

proj = getattr(module, "PROJECT_NAME", "Project")
mode = getattr(module, "MODE", "DEV")
debug = getattr(module, "DEBUG", False)
hosts = getattr(module, "ALLOWED_HOSTS", [])
cors = getattr(module, "CORS_ALLOWED_ORIGINS", [])
csrf = getattr(module, "CSRF_TRUSTED_ORIGINS", [])
tz = getattr(module, "TIME_ZONE", "UTC")
lang = getattr(module, "LANGUAGE_CODE", "en-us")
base_dir = str(getattr(module, "BASE_DIR", ""))
static_url = getattr(module, "STATIC_URL", "static/")
static_root = getattr(module, "STATIC_ROOT", None)
default_auto = getattr(module, "DEFAULT_AUTO_FIELD", "—")
apps_count = len(getattr(module, "INSTALLED_APPS", []))
middleware_count = len(getattr(module, "MIDDLEWARE", []))
proc_id = os.getpid()
port = os.environ.get("PORT") or os.environ.get("DJANGO_PORT") or "8000"

print(f"""
========== DJANGO SETTINGS ==========
Project name        : {proj}
Mode                : {mode}
Debug               : {debug}
Process ID          : {proc_id}
Port                : {port}

Language             : {lang}
Time zone            : {tz}

Base dir             : {base_dir}

Static URL           : {static_url}
Static root          : {static_root}
Default auto field   : {default_auto}

Allowed hosts        : {hosts}
CORS allowed origins : {cors}
CSRF trusted origins : {csrf}

Installed apps count : {apps_count}
Middleware count     : {middleware_count}
=====================================
""")
# =====================================