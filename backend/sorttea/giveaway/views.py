"""
Views for the Giveaway app.
"""

import logging
from django.db.models import Q
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Giveaway, Entry, Winner, VerificationRule, AuditLog
from .serializers import (
    GiveawaySerializer, EntrySerializer, WinnerSerializer,
    VerificationRuleSerializer, AuditLogSerializer
)
from .services import GiveawayService, GiveawayVerificationError
from sorttea.instagram.models import InstagramAccount

logger = logging.getLogger('sorttea.giveaway')


class IsGiveawayCreatorOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow creators of a giveaway to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the creator
        return obj.created_by == request.user


class GiveawayViewSet(viewsets.ModelViewSet):
    """API endpoints for giveaways."""
    serializer_class = GiveawaySerializer
    permission_classes = [permissions.IsAuthenticated, IsGiveawayCreatorOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'end_date', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Filter giveaways:
        - Staff can see all giveaways
        - Others can see public giveaways and their own
        """
        user = self.request.user
        if user.is_staff:
            return Giveaway.objects.all()
        
        return Giveaway.objects.filter(
            Q(status__in=['active', 'ended']) | Q(created_by=user)
        )
    
    @action(detail=True, methods=['post'])
    def select_winners(self, request, pk=None):
        """Select winners for a giveaway."""
        giveaway = self.get_object()
        
        # Only creator can select winners
        if giveaway.created_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Only the giveaway creator can select winners'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Get optional count parameter
            count = request.data.get('count', None)
            if count is not None:
                try:
                    count = int(count)
                    if count <= 0:
                        return Response(
                            {'error': 'Winner count must be positive'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except ValueError:
                    return Response(
                        {'error': 'Winner count must be a number'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Select winners
            winners = GiveawayService.select_winners(giveaway, count, user=request.user)
            
            # Return selected winners
            serializer = WinnerSerializer(winners, many=True)
            return Response(serializer.data)
            
        except GiveawayVerificationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def revalidate_entries(self, request, pk=None):
        """Revalidate pending entries for a giveaway."""
        giveaway = self.get_object()
        
        # Only creator can revalidate entries
        if giveaway.created_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Only the giveaway creator can revalidate entries'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Revalidate entries
            validated_count = GiveawayService.revalidate_entries(giveaway, user=request.user)
            
            return Response({
                'validated_count': validated_count,
                'total_pending': giveaway.entries.filter(verification_status='pending').count(),
                'message': f'Successfully revalidated {validated_count} entries'
            })
            
        except Exception as e:
            logger.error(f"Error revalidating entries: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_giveaways(self, request):
        """Get giveaways created by the authenticated user."""
        queryset = Giveaway.objects.filter(created_by=request.user)
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class EntryViewSet(viewsets.ModelViewSet):
    """API endpoints for giveaway entries."""
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['giveaway', 'verification_status']
    
    def get_queryset(self):
        """
        Filter entries:
        - Giveaway creators can see all entries for their giveaways
        - Other users can only see their own entries
        """
        user = self.request.user
        if user.is_staff:
            return Entry.objects.all()
        
        # Get entries for giveaways created by the user
        user_giveaways = Giveaway.objects.filter(created_by=user).values_list('id', flat=True)
        
        # Get entries with the user's Instagram account
        user_instagram = None
        try:
            user_instagram = InstagramAccount.objects.get(user=user)
        except InstagramAccount.DoesNotExist:
            pass
        
        if user_instagram:
            return Entry.objects.filter(
                Q(giveaway_id__in=user_giveaways) | 
                Q(instagram_account=user_instagram)
            )
        else:
            return Entry.objects.filter(giveaway_id__in=user_giveaways)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Manually trigger verification for an entry."""
        entry = self.get_object()
        
        # Check permission
        if not request.user.is_staff and request.user != entry.giveaway.created_by:
            if (not hasattr(entry, 'instagram_account') or 
                not entry.instagram_account or 
                entry.instagram_account.user != request.user):
                return Response(
                    {'error': 'You do not have permission to verify this entry'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        try:
            # Force verification
            force = request.data.get('force', False)
            result = GiveawayService.verify_entry(entry, force=force)
            
            return Response({
                'success': result,
                'verification_status': entry.verification_status,
                'verification_details': entry.verification_details
            })
            
        except GiveawayVerificationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_entries(self, request):
        """Get entries created by the authenticated user."""
        # Get entries with the user's Instagram account
        try:
            user_instagram = InstagramAccount.objects.get(user=request.user)
            queryset = Entry.objects.filter(instagram_account=user_instagram)
            
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
            
        except InstagramAccount.DoesNotExist:
            return Response([])


class WinnerViewSet(viewsets.ModelViewSet):
    """API endpoints for giveaway winners."""
    serializer_class = WinnerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['giveaway', 'contacted', 'prize_claimed']
    
    def get_queryset(self):
        """
        Filter winners:
        - Giveaway creators can see all winners for their giveaways
        - Other users can only see winners for public giveaways
        """
        user = self.request.user
        if user.is_staff:
            return Winner.objects.all()
        
        # Get winners for giveaways created by the user
        user_giveaways = Giveaway.objects.filter(created_by=user).values_list('id', flat=True)
        
        # Get winners for public giveaways
        public_giveaways = Giveaway.objects.filter(status='ended').values_list('id', flat=True)
        
        return Winner.objects.filter(
            Q(giveaway_id__in=user_giveaways) | 
            Q(giveaway_id__in=public_giveaways)
        )
    
    @action(detail=True, methods=['post'])
    def mark_contacted(self, request, pk=None):
        """Mark a winner as contacted."""
        winner = self.get_object()
        
        # Only creator can mark as contacted
        if winner.giveaway.created_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Only the giveaway creator can mark winners as contacted'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        winner.mark_contacted()
        serializer = self.get_serializer(winner)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_claimed(self, request, pk=None):
        """Mark a winner as having claimed their prize."""
        winner = self.get_object()
        
        # Only creator can mark as claimed
        if winner.giveaway.created_by != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Only the giveaway creator can mark prizes as claimed'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        winner.mark_claimed()
        serializer = self.get_serializer(winner)
        return Response(serializer.data)


class VerificationRuleViewSet(viewsets.ModelViewSet):
    """API endpoints for custom verification rules."""
    serializer_class = VerificationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['giveaway']
    
    def get_queryset(self):
        """
        Filter verification rules:
        - Giveaway creators can see all rules for their giveaways
        - Other users can see rules for public giveaways
        """
        user = self.request.user
        if user.is_staff:
            return VerificationRule.objects.all()
        
        # Get rules for giveaways created by the user
        user_giveaways = Giveaway.objects.filter(created_by=user).values_list('id', flat=True)
        
        # Get rules for public giveaways
        public_giveaways = Giveaway.objects.filter(status__in=['active', 'ended']).values_list('id', flat=True)
        
        return VerificationRule.objects.filter(
            Q(giveaway_id__in=user_giveaways) | 
            Q(giveaway_id__in=public_giveaways)
        )
    
    def perform_create(self, serializer):
        """Check if user has permission to create a rule for the giveaway."""
        giveaway = serializer.validated_data['giveaway']
        if giveaway.created_by != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You can only create rules for your own giveaways")
        
        # Create the rule
        rule = serializer.save()
        
        # Log rule creation
        AuditLog.objects.create(
            user=self.request.user,
            action_type='verification_rule_created',
            object_id=str(rule.id),
            object_type='VerificationRule',
            action_details={
                'giveaway_id': str(giveaway.id),
                'rule_name': rule.name,
                'rule_type': rule.rule_type
            }
        )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoints for audit logs."""
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['action_type', 'object_type', 'object_id']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        return AuditLog.objects.all() 