"""
Admin interface for the Instagram app.
"""

from django.contrib import admin
from .models import InstagramAccount, InstagramMediaCache, InstagramInteraction


@admin.register(InstagramAccount)
class InstagramAccountAdmin(admin.ModelAdmin):
    """Admin interface for InstagramAccount model."""
    list_display = ('username', 'user', 'instagram_user_id', 'is_token_valid', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('username', 'user__username', 'instagram_user_id')
    readonly_fields = ('created_at', 'updated_at', 'is_token_valid')
    
    def is_token_valid(self, obj):
        """Display if token is valid."""
        return obj.is_token_valid
    is_token_valid.boolean = True
    is_token_valid.short_description = 'Token Valid'


@admin.register(InstagramMediaCache)
class InstagramMediaCacheAdmin(admin.ModelAdmin):
    """Admin interface for InstagramMediaCache model."""
    list_display = ('media_id', 'instagram_account', 'media_type', 'timestamp', 'created_at')
    list_filter = ('media_type', 'timestamp', 'created_at')
    search_fields = ('media_id', 'instagram_account__username', 'caption')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(InstagramInteraction)
class InstagramInteractionAdmin(admin.ModelAdmin):
    """Admin interface for InstagramInteraction model."""
    list_display = ('instagram_account', 'target_username', 'interaction_type', 'verified', 'created_at')
    list_filter = ('interaction_type', 'verified', 'created_at')
    search_fields = ('instagram_account__username', 'target_username', 'target_media_id')
    readonly_fields = ('created_at', 'updated_at', 'verified_at') 