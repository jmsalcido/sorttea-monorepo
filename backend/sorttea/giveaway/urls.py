"""
URL configuration for Giveaway app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    GiveawayViewSet, EntryViewSet, WinnerViewSet,
    VerificationRuleViewSet, AuditLogViewSet
)

router = DefaultRouter()
router.register(r'giveaways', GiveawayViewSet, basename='giveaway')
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'winners', WinnerViewSet, basename='winner')
router.register(r'rules', VerificationRuleViewSet, basename='verification-rule')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-log')

urlpatterns = [
    path('', include(router.urls)),
] 