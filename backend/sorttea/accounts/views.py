"""
Views for the Accounts app.
"""

from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer

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