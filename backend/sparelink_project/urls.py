"""
SpareLink Kenya - Main URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # JWT Auth
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # App Routes
    path('api/users/',     include('apps.users.urls')),
    path('api/products/',  include('apps.products.urls')),
    path('api/orders/',    include('apps.orders.urls')),
    path('api/payments/',  include('apps.payments.urls')),
    path('api/messages/',  include('apps.messaging.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)