"""
Models for the Instagram app.
"""

import logging
from django.db import models
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger('sorttea.instagram')


class InstagramAccount(models.Model):
    """Model to store Instagram account information."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='instagram_account')
    instagram_user_id = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    access_token = models.TextField(blank=True, null=True)
    token_type = models.CharField(max_length=50, blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.instagram_user_id})"

    @property
    def is_token_valid(self):
        if not self.access_token or not self.expires_at:
            return False
        return self.expires_at > timezone.now()

    def update_token(self, access_token, token_type, expires_in):
        """Update the token information."""
        self.access_token = access_token
        self.token_type = token_type
        self.expires_at = timezone.now() + timezone.timedelta(seconds=expires_in)
        self.save()
        logger.info(f"Token updated for Instagram account {self.username}")


class InstagramMediaCache(models.Model):
    """Model to cache Instagram media information to reduce API calls."""
    media_id = models.CharField(max_length=255, primary_key=True)
    instagram_account = models.ForeignKey(InstagramAccount, on_delete=models.CASCADE, related_name='media_cache')
    media_type = models.CharField(max_length=50)  # IMAGE, VIDEO, CAROUSEL_ALBUM
    permalink = models.URLField(max_length=500)
    caption = models.TextField(blank=True, null=True)
    like_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField()
    raw_data = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Media {self.media_id} by {self.instagram_account.username}"

    class Meta:
        indexes = [
            models.Index(fields=['instagram_account', 'timestamp']),
        ]


class InstagramInteraction(models.Model):
    """Model to track Instagram interactions that we've verified."""
    INTERACTION_TYPES = (
        ('follow', 'Follow'),
        ('like', 'Like'),
        ('comment', 'Comment'),
        ('tag', 'Tag'),
    )
    
    instagram_account = models.ForeignKey(InstagramAccount, on_delete=models.CASCADE, related_name='interactions')
    target_username = models.CharField(max_length=255)  # Username of the account being interacted with
    target_media_id = models.CharField(max_length=255, blank=True, null=True)  # Media ID if applicable
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.instagram_account.username} {self.interaction_type} {self.target_username}"

    def mark_verified(self):
        self.verified = True
        self.verified_at = timezone.now()
        self.save()
        logger.info(f"Interaction {self.id} marked as verified")

    class Meta:
        indexes = [
            models.Index(fields=['instagram_account', 'target_username', 'interaction_type']),
            models.Index(fields=['target_media_id', 'interaction_type']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['instagram_account', 'target_username', 'target_media_id', 'interaction_type'],
                name='unique_instagram_interaction'
            )
        ] 