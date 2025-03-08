from rest_framework import serializers
from .models import ActivityData, OverviewStats, EngagementBreakdown

class ActivityDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityData
        fields = ['date', 'participants', 'engagement', 'completion_rate']

class OverviewStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OverviewStats
        fields = [
            'total_giveaways', 
            'active_giveaways',
            'total_participants',
            'total_engagement',
            'completion_rate'
        ]

class EngagementBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementBreakdown
        fields = ['date', 'likes', 'comments', 'shares', 'follows', 'tags']

class TimeseriesDataSerializer(serializers.Serializer):
    """
    Serializer for timeseries data that matches the frontend TimeseriesData interface
    """
    date = serializers.DateField()
    participants = serializers.IntegerField()
    engagement = serializers.IntegerField()
    completion_rate = serializers.FloatField() 