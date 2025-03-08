from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from django.db.models import Sum, Avg
from datetime import datetime, timedelta
import random

from .models import ActivityData, OverviewStats, EngagementBreakdown
from .serializers import (
    ActivityDataSerializer, 
    OverviewStatsSerializer, 
    EngagementBreakdownSerializer,
    TimeseriesDataSerializer
)

class OverviewStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get overview statistics for the authenticated user"""
        user = request.user
        
        # Try to get existing stats or create them
        stats, created = OverviewStats.objects.get_or_create(user=user)
        
        # If stats are older than 1 hour or just created, refresh them
        if created or (timezone.now() - stats.last_updated) > timedelta(hours=1):
            self._update_stats(user, stats)
        
        serializer = OverviewStatsSerializer(stats)
        return Response(serializer.data)
    
    def _update_stats(self, user, stats):
        """Update overview statistics with the latest data"""
        from sorttea.giveaway.models import Giveaway
        
        # Count active and total giveaways
        all_giveaways = Giveaway.objects.filter(created_by=user)
        active_giveaways = all_giveaways.filter(status='active')
        
        # Calculate participant and engagement totals
        participants = sum(g.participants for g in all_giveaways if hasattr(g, 'participants') and g.participants is not None)
        engagements = sum(g.total_engagement for g in all_giveaways if hasattr(g, 'total_engagement') and g.total_engagement is not None)
        
        # Calculate completion rate (average across all giveaways)
        rates = [g.completion_rate for g in all_giveaways if hasattr(g, 'completion_rate') and g.completion_rate is not None]
        avg_rate = sum(rates) / len(rates) if rates else 0
        
        # Update the stats object
        stats.total_giveaways = all_giveaways.count()
        stats.active_giveaways = active_giveaways.count()
        stats.total_participants = participants
        stats.total_engagement = engagements
        stats.completion_rate = round(avg_rate, 2)
        stats.last_updated = timezone.now()
        stats.save()

class TimeseriesDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get timeseries data for charts"""
        user = request.user
        
        # Get query parameters for date range and mock data flag
        start_date_str = request.query_params.get('startDate')
        end_date_str = request.query_params.get('endDate')
        use_mock_data = request.query_params.get('mock', '').lower() == 'true'
        
        # Default to last 30 days if no dates provided
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        # Parse provided dates if any
        if start_date_str:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass
        
        if end_date_str:
            try:
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
            except ValueError:
                pass
        
        # Get activity data from database
        activity_data = ActivityData.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        # If no data exists
        if not activity_data.exists():
            # Only generate mock data if in DEBUG mode AND mock flag is True
            from django.conf import settings
            if settings.DEBUG and use_mock_data:
                data = self._generate_mock_data(start_date, end_date, user)
                return Response(data)
            else:
                # Return empty array in production or when mock data not requested
                return Response([])
        else:
            # Serialize the actual data
            serializer = ActivityDataSerializer(activity_data, many=True)
            return Response(serializer.data)
    
    def _generate_mock_data(self, start_date, end_date, user):
        """Generate mock data for development until real data is available"""
        data = []
        current_date = start_date
        
        # Base values that will increase over time
        base_participants = random.randint(5, 15)
        base_engagement = random.randint(10, 30)
        
        # Save the generated data to the database
        activity_data_objects = []
        
        while current_date <= end_date:
            # Calculate the day number in sequence
            day_number = (current_date - start_date).days + 1
            
            # Generate slightly increasing participants (with some randomness)
            participants = base_participants + (day_number // 3) + random.randint(-3, 5)
            participants = max(1, participants)  # Ensure always positive
            
            # Generate slightly increasing engagement (with some randomness)
            engagement = base_engagement + (day_number // 2) + random.randint(-5, 10)
            engagement = max(participants, engagement)  # Engagement should be >= participants
            
            # Calculate completion rate
            completion_rate = min(98, (40 + (day_number // 2) + random.randint(0, 30)))
            
            # Create the mock data entry
            entry = {
                'date': current_date.strftime("%Y-%m-%d"),
                'participants': participants,
                'engagement': engagement,
                'completion_rate': completion_rate
            }
            
            # Create ActivityData object to save later
            activity_data_objects.append(
                ActivityData(
                    user=user,
                    date=current_date,
                    participants=participants,
                    engagement=engagement,
                    completion_rate=completion_rate
                )
            )
            
            data.append(entry)
            current_date += timedelta(days=1)
        
        # Bulk create all the objects
        ActivityData.objects.bulk_create(activity_data_objects, ignore_conflicts=True)
        
        return data

class EngagementBreakdownView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get engagement breakdown by type"""
        user = request.user
        
        # Get aggregated engagement data from the past 30 days
        thirty_days_ago = timezone.now().date() - timedelta(days=30)
        
        engagement = EngagementBreakdown.objects.filter(
            user=user,
            date__gte=thirty_days_ago
        ).aggregate(
            likes=Sum('likes'),
            comments=Sum('comments'),
            shares=Sum('shares'),
            follows=Sum('follows'),
            tags=Sum('tags')
        )
        
        # Replace None values with 0
        for key in engagement:
            if engagement[key] is None:
                engagement[key] = 0
        
        return Response(engagement)

class TopGiveawaysView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get top performing giveaways"""
        user = request.user
        limit = int(request.query_params.get('limit', 5))
        
        from sorttea.giveaway.models import Giveaway
        
        # Get user's giveaways and order by participant count
        giveaways = Giveaway.objects.filter(created_by=user)
        
        # This is a simplified version - in a real implementation,
        # you'd calculate proper ranking metrics
        top_giveaways = []
        for giveaway in giveaways[:limit]:
            # Calculate a simple change percent (mock data for now)
            change_percent = random.randint(-10, 30)
            
            top_giveaways.append({
                'id': str(giveaway.id),
                'title': giveaway.title,
                'participants': getattr(giveaway, 'participants', random.randint(10, 100)),
                'engagement': getattr(giveaway, 'total_engagement', random.randint(20, 200)),
                'changePercent': change_percent
            })
        
        return Response(top_giveaways)

class ParticipantDemographicsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get participant demographics data"""
        # This would be implemented with actual demographic data
        # For now, return mock data
        demographics = {
            'age_groups': {
                '18-24': 35,
                '25-34': 40,
                '35-44': 15,
                '45-54': 7,
                '55+': 3
            },
            'gender': {
                'female': 60,
                'male': 38,
                'other': 2
            },
            'locations': {
                'United States': 40,
                'Canada': 15,
                'United Kingdom': 12,
                'Australia': 8,
                'Germany': 5,
                'France': 4,
                'Others': 16
            }
        }
        
        return Response(demographics)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_report(request):
    """Export analytics report as CSV or PDF"""
    format_type = request.query_params.get('format', 'csv')
    
    # This would generate and return a file
    # For now, return a mock response
    return Response({
        'status': 'success',
        'message': f'Report would be exported as {format_type}. Implementation pending.'
    })
