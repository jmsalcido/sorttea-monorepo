from django.contrib import admin
from .models import ActivityData, OverviewStats, EngagementBreakdown

@admin.register(ActivityData)
class ActivityDataAdmin(admin.ModelAdmin):
    list_display = ('date', 'user', 'participants', 'engagement', 'completion_rate')
    list_filter = ('date', 'user')
    search_fields = ('user__email', 'user__username')
    date_hierarchy = 'date'
    ordering = ('-date',)
    
    fieldsets = (
        (None, {
            'fields': ('user', 'date')
        }),
        ('Metrics', {
            'fields': ('participants', 'engagement', 'completion_rate'),
            'description': 'Daily activity metrics for analytics charts'
        }),
    )

@admin.register(OverviewStats)
class OverviewStatsAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_giveaways', 'active_giveaways', 'total_participants', 
                    'total_engagement', 'completion_rate', 'last_updated')
    list_filter = ('last_updated',)
    search_fields = ('user__email', 'user__username')
    readonly_fields = ('last_updated',)
    
    fieldsets = (
        (None, {
            'fields': ('user', 'last_updated')
        }),
        ('Giveaway Stats', {
            'fields': ('total_giveaways', 'active_giveaways'),
        }),
        ('Performance Metrics', {
            'fields': ('total_participants', 'total_engagement', 'completion_rate'),
            'description': 'Overall performance metrics for the user'
        }),
    )

@admin.register(EngagementBreakdown)
class EngagementBreakdownAdmin(admin.ModelAdmin):
    list_display = ('date', 'user', 'giveaway', 'likes', 'comments', 'shares', 'follows', 'tags')
    list_filter = ('date', 'user', 'giveaway')
    search_fields = ('user__email', 'user__username', 'giveaway__title')
    date_hierarchy = 'date'
    ordering = ('-date',)
    
    fieldsets = (
        (None, {
            'fields': ('user', 'giveaway', 'date')
        }),
        ('Engagement Breakdown', {
            'fields': ('likes', 'comments', 'shares', 'follows', 'tags'),
            'description': 'Breakdown of different types of engagement'
        }),
    )

# Register activity data in the admin site
# These are just re-exports for clarity, since we're using the @admin.register decorator above
# admin.site.register(ActivityData, ActivityDataAdmin)
# admin.site.register(OverviewStats, OverviewStatsAdmin)
# admin.site.register(EngagementBreakdown, EngagementBreakdownAdmin)
