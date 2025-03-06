"""
Serializers for Instagram app models.
"""

from rest_framework import serializers
from .models import InstagramAccount, InstagramMediaCache, InstagramInteraction


class InstagramAccountSerializer(serializers.ModelSerializer):
    """Serializer for InstagramAccount model."""
    is_token_valid = serializers.BooleanField(read_only=True)
    token_expires_in = serializers.SerializerMethodField()
    
    class Meta:
        model = InstagramAccount
        fields = [
            'id', 'instagram_user_id', 'username', 'is_token_valid', 
            'token_expires_in', 'created_at', 'updated_at'
        ]
        read_only_fields = fields
    
    def get_token_expires_in(self, obj):
        """Get seconds until token expires."""
        from django.utils import timezone
        if obj.expires_at:
            delta = obj.expires_at - timezone.now()
            return max(0, int(delta.total_seconds()))
        return 0


class InstagramMediaSerializer(serializers.ModelSerializer):
    """Serializer for InstagramMediaCache model."""
    
    class Meta:
        model = InstagramMediaCache
        fields = [
            'media_id', 'media_type', 'permalink', 'caption',
            'like_count', 'comments_count', 'timestamp', 'created_at'
        ]
        read_only_fields = fields


class InstagramInteractionSerializer(serializers.ModelSerializer):
    """Serializer for InstagramInteraction model."""
    
    class Meta:
        model = InstagramInteraction
        fields = [
            'id', 'instagram_account', 'target_username', 'target_media_id',
            'interaction_type', 'verified', 'verified_at', 'created_at'
        ]
        read_only_fields = fields 