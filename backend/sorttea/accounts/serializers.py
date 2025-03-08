"""
Serializers for the Accounts app.
"""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserProfile
from sorttea.instagram.serializers import InstagramAccountSerializer

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    has_instagram_connected = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'display_name', 'bio', 'website', 
            'auth_provider', 'provider_user_id', 'provider_profile_url', 'last_login_provider',
            'has_instagram_connected', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'auth_provider', 'provider_user_id', 'provider_profile_url',
            'last_login_provider', 'has_instagram_connected', 'created_at', 'updated_at'
        ]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model with profile information."""
    profile = UserProfileSerializer(required=False)
    instagram_account = InstagramAccountSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 
            'last_name', 'profile', 'instagram_account',
            'is_staff', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'is_staff', 'date_joined', 'last_login']
    
    def create(self, validated_data):
        """Create a user with profile."""
        profile_data = validated_data.pop('profile', None)
        user = User.objects.create(**validated_data)
        
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        else:
            UserProfile.objects.create(user=user)
            
        return user
    
    def update(self, instance, validated_data):
        """Update a user and their profile."""
        profile_data = validated_data.pop('profile', None)
        
        # Update user fields
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        
        # Update profile if provided
        if profile_data:
            profile = instance.profile
            profile.display_name = profile_data.get('display_name', profile.display_name)
            profile.bio = profile_data.get('bio', profile.bio)
            profile.website = profile_data.get('website', profile.website)
            # Don't allow updating provider info through the general API
            profile.save()
            
        return instance 