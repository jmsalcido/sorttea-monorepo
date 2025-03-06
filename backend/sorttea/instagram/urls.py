"""
URL configuration for Instagram app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InstagramAuthView, InstagramCallbackView, InstagramAccountViewSet, InstagramMediaViewSet

router = DefaultRouter()
router.register(r'accounts', InstagramAccountViewSet, basename='instagram-account')
router.register(r'media', InstagramMediaViewSet, basename='instagram-media')

urlpatterns = [
    path('auth/', InstagramAuthView.as_view(), name='instagram-auth'),
    path('auth/callback/', InstagramCallbackView.as_view(), name='instagram-callback'),
    path('', include(router.urls)),
] 