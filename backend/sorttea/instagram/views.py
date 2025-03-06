"""
Views for the Instagram app.
"""

import logging
from django.conf import settings
from django.shortcuts import redirect
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import InstagramAccount, InstagramMediaCache
from .services import InstagramService, InstagramAPIError
from .serializers import InstagramAccountSerializer, InstagramMediaSerializer

logger = logging.getLogger('sorttea.instagram')


class InstagramAuthView(APIView):
    """Views for Instagram authentication flow."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        """Get Instagram authentication URL."""
        try:
            auth_url = InstagramService.get_auth_url()
            return Response({'auth_url': auth_url})
        except InstagramAPIError as e:
            logger.error(f"Error getting Instagram auth URL: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class InstagramCallbackView(APIView):
    """Handle Instagram OAuth callback."""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        """Process Instagram OAuth callback."""
        code = request.query_params.get('code')
        error = request.query_params.get('error')
        error_reason = request.query_params.get('error_reason')
        error_description = request.query_params.get('error_description')
        
        if error or not code:
            logger.error(f"Instagram auth error: {error_reason} - {error_description}")
            # Redirect to frontend with error
            return redirect(f"{settings.FRONTEND_URL}/instagram-auth-error?error={error_reason}")
        
        try:
            # Exchange code for token
            token_info = InstagramService.exchange_code_for_token(code)
            
            # Update or create Instagram account for the user
            instagram_account, created = InstagramAccount.objects.update_or_create(
                user=request.user,
                defaults={
                    'instagram_user_id': token_info['user_id'],
                    'username': token_info['username'],
                    'access_token': token_info['access_token'],
                    'token_type': token_info['token_type'],
                    'expires_at': timezone.now() + timezone.timedelta(seconds=token_info['expires_in'])
                }
            )
            
            if created:
                logger.info(f"Created new Instagram account for {request.user.username}: {token_info['username']}")
            else:
                logger.info(f"Updated Instagram account for {request.user.username}: {token_info['username']}")
            
            # Redirect to frontend with success
            return redirect(f"{settings.FRONTEND_URL}/instagram-auth-success")
            
        except InstagramAPIError as e:
            logger.error(f"Instagram token exchange error: {str(e)}")
            # Redirect to frontend with error
            return redirect(f"{settings.FRONTEND_URL}/instagram-auth-error?error=token_exchange_failed")


class InstagramAccountViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoints for Instagram accounts."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InstagramAccountSerializer
    
    def get_queryset(self):
        """Limit queryset to the authenticated user's Instagram account."""
        return InstagramAccount.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the authenticated user's Instagram account."""
        try:
            instagram_account = InstagramAccount.objects.get(user=request.user)
            serializer = self.get_serializer(instagram_account)
            return Response(serializer.data)
        except InstagramAccount.DoesNotExist:
            return Response({'detail': 'Instagram account not connected'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def refresh_token(self, request, pk=None):
        """Refresh the Instagram access token."""
        instagram_account = self.get_object()
        
        try:
            # Refresh token
            token_data = InstagramService.refresh_token(instagram_account.access_token)
            
            # Update account
            instagram_account.update_token(
                token_data['access_token'],
                instagram_account.token_type,
                token_data['expires_in']
            )
            
            serializer = self.get_serializer(instagram_account)
            return Response(serializer.data)
            
        except InstagramAPIError as e:
            logger.error(f"Instagram token refresh error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def disconnect(self, request, pk=None):
        """Disconnect Instagram account."""
        instagram_account = self.get_object()
        instagram_account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class InstagramMediaViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoints for Instagram media."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InstagramMediaSerializer
    
    def get_queryset(self):
        """Limit queryset to media from the authenticated user's Instagram account."""
        try:
            instagram_account = InstagramAccount.objects.get(user=self.request.user)
            return InstagramMediaCache.objects.filter(instagram_account=instagram_account).order_by('-timestamp')
        except InstagramAccount.DoesNotExist:
            return InstagramMediaCache.objects.none()
    
    @action(detail=False, methods=['get'])
    def refresh(self, request):
        """Refresh media data from Instagram."""
        try:
            instagram_account = InstagramAccount.objects.get(user=request.user)
            
            if not instagram_account.is_token_valid:
                return Response(
                    {'error': 'Instagram token is invalid or expired'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Fetch media from Instagram
            media_data = InstagramService.get_user_media(instagram_account)
            
            # Return updated media
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
            
        except InstagramAccount.DoesNotExist:
            return Response(
                {'error': 'Instagram account not connected'},
                status=status.HTTP_404_NOT_FOUND
            )
        except InstagramAPIError as e:
            logger.error(f"Instagram media refresh error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 