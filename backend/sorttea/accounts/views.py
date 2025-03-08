"""
Views for the Accounts app.
"""

from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer
import logging

logger = logging.getLogger('sorttea.accounts')

User = get_user_model()


class IsUserOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow users to edit their own profile.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the user
        return obj == request.user


class UserViewSet(viewsets.ModelViewSet):
    """API endpoints for users."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsUserOrReadOnly]
    
    def get_queryset(self):
        """
        Filter users:
        - Staff can see all users
        - Others can only see themselves
        """
        user = self.request.user
        if user.is_staff:
            return User.objects.all()
        
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get the authenticated user's profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        """Update the authenticated user's profile."""
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SSORegistrationView(APIView):
    """Standalone view for SSO registration that doesn't require authentication."""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Register or get a user from SSO provider data."""
        email = request.data.get('email')
        name = request.data.get('name')
        provider = request.data.get('provider')
        provider_id = request.data.get('providerId')
        access_token = request.data.get('accessToken')
        
        if not email or not provider or not provider_id:
            return Response(
                {'error': 'Email, provider, and providerId are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Build a profile URL based on the provider
        profile_url = None
        if provider == 'google':
            profile_url = f"https://profiles.google.com/{provider_id}"
        elif provider == 'facebook':
            profile_url = f"https://facebook.com/{provider_id}"
            
        # Try to find existing user with this email
        try:
            user = User.objects.get(email=email)
            logger.info(f"Existing user found for SSO login: {email} via {provider}")
            
            # Update the provider information
            user.profile.auth_provider = provider
            user.profile.provider_user_id = provider_id
            user.profile.provider_profile_url = profile_url
            user.profile.last_login_provider = provider
            user.profile.save()
            
            logger.info(f"Updated provider information for user {user.username}")
            
        except User.DoesNotExist:
            # Create new user
            name_parts = name.split(' ', 1) if name else ['User', '']
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Generate username from email
            username = email.split('@')[0]
            base_username = username
            counter = 1
            
            # Make sure username is unique
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                # Don't set password for SSO users
            )
            
            # Set provider information in the profile
            profile = user.profile
            profile.auth_provider = provider
            profile.provider_user_id = provider_id
            profile.provider_profile_url = profile_url
            profile.last_login_provider = provider
            profile.save()
            
            logger.info(f"Created new user from SSO: {email} via {provider}")
            
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK) 