"""
URL configuration for Accounts app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SSORegistrationView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('register-sso/', SSORegistrationView.as_view(), name='register-sso'),
] 