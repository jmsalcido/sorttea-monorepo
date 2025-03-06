"""
Admin interface for the Giveaway app.
"""

from django.contrib import admin
from .models import Giveaway, Entry, Winner, VerificationRule, AuditLog


@admin.register(Giveaway)
class GiveawayAdmin(admin.ModelAdmin):
    """Admin interface for Giveaway model."""
    list_display = ('title', 'created_by', 'status', 'start_date', 'end_date', 'is_active')
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'created_by__username')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'created_by', 'prize_description', 'winner_count')
        }),
        ('Dates and Status', {
            'fields': ('start_date', 'end_date', 'status', 'created_at', 'updated_at')
        }),
        ('Instagram Requirements', {
            'fields': (
                'instagram_account_to_follow', 'instagram_post_to_like',
                'instagram_post_to_comment', 'required_tag_count'
            )
        }),
        ('Verification Settings', {
            'fields': ('verify_follow', 'verify_like', 'verify_comment', 'verify_tags')
        }),
    )


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    """Admin interface for Entry model."""
    list_display = ('instagram_username', 'giveaway', 'verification_status', 'created_at')
    list_filter = ('verification_status', 'created_at', 'giveaway')
    search_fields = ('instagram_username', 'giveaway__title')
    readonly_fields = ('created_at', 'updated_at', 'verified_at')


@admin.register(Winner)
class WinnerAdmin(admin.ModelAdmin):
    """Admin interface for Winner model."""
    list_display = ('entry', 'giveaway', 'selected_at', 'contacted', 'prize_claimed')
    list_filter = ('contacted', 'prize_claimed', 'selected_at')
    search_fields = ('entry__instagram_username', 'giveaway__title')
    readonly_fields = ('selected_at', 'contacted_at', 'claimed_at')


@admin.register(VerificationRule)
class VerificationRuleAdmin(admin.ModelAdmin):
    """Admin interface for VerificationRule model."""
    list_display = ('name', 'giveaway', 'rule_type', 'is_required', 'created_at')
    list_filter = ('rule_type', 'is_required', 'created_at')
    search_fields = ('name', 'giveaway__title')
    readonly_fields = ('created_at',)


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """Admin interface for AuditLog model."""
    list_display = ('action_type', 'user', 'object_type', 'timestamp')
    list_filter = ('action_type', 'object_type', 'timestamp')
    search_fields = ('user__username', 'object_id', 'action_type')
    readonly_fields = ('timestamp', 'user', 'action_type', 'action_details', 'object_id', 'object_type', 'ip_address') 