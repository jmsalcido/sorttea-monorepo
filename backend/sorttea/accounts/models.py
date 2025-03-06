"""
Models for the Accounts app.
"""

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile model."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile for {self.user.username}"
    
    @property
    def has_instagram_connected(self):
        return hasattr(self.user, 'instagram_account') and self.user.instagram_account is not None 