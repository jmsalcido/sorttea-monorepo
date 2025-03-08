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
    # SSO provider information
    auth_provider = models.CharField(max_length=50, blank=True, null=True, help_text="Authentication provider (e.g., 'google', 'facebook')")
    provider_user_id = models.CharField(max_length=255, blank=True, null=True, help_text="User ID from the authentication provider")
    provider_profile_url = models.URLField(blank=True, null=True, help_text="URL to user's profile at the provider")
    provider_image_url = models.URLField(blank=True, null=True, help_text="URL to user's profile picture from the provider")
    last_login_provider = models.CharField(max_length=50, blank=True, null=True, help_text="Last provider used for login")
    auth_token = models.TextField(blank=True, null=True, help_text="Authentication token from provider (mainly for debugging)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profile for {self.user.username}"
    
    @property
    def has_instagram_connected(self):
        return hasattr(self.user, 'instagram_account') and self.user.instagram_account is not None 