from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/companies/', include('companies.urls')),
    path('api/invites/', include('invites.urls')),
    path('api/access/', include('access.urls')),
    path('api/items/', include('items.urls')),
]