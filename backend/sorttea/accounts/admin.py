"""
Admin interface for the Accounts app.
"""

from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin interface for UserProfile model."""
    list_display = ('user', 'display_name', 'has_instagram_connected', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'user__email', 'display_name')
    readonly_fields = ('created_at', 'updated_at', 'has_instagram_connected')
    
    def has_instagram_connected(self, obj):
        """Display if user has Instagram connected."""
        return obj.has_instagram_connected
    has_instagram_connected.boolean = True
    has_instagram_connected.short_description = 'Instagram Connected' 