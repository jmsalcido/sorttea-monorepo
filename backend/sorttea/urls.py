"""
URL configuration for sorttea project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

# Swagger/OpenAPI documentation setup
schema_view = get_schema_view(
    openapi.Info(
        title="SortTea API",
        default_version='v1',
        description="API for managing Instagram giveaway entries",
        terms_of_service="https://www.sorttea.com/terms/",
        contact=openapi.Contact(email="contact@sorttea.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Health check endpoint for debugging
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'API is reachable'})

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/instagram/', include('sorttea.instagram.urls')),
    path('api/v1/giveaway/', include('sorttea.giveaway.urls')),
    path('api/v1/accounts/', include('sorttea.accounts.urls')),
    
    # Swagger documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Health check for debugging
    path('health/', health_check, name='health_check'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 