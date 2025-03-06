"""
Serializers for Giveaway app models.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Giveaway, Entry, Winner, VerificationRule, AuditLog
from sorttea.instagram.models import InstagramAccount
from sorttea.instagram.serializers import InstagramAccountSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Simple serializer for User model."""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = fields


class GiveawaySerializer(serializers.ModelSerializer):
    """Serializer for Giveaway model."""
    created_by = UserSerializer(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    entry_count = serializers.SerializerMethodField()
    verified_entry_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Giveaway
        fields = [
            'id', 'title', 'description', 'created_by', 'start_date', 'end_date',
            'status', 'prize_description', 'winner_count', 'instagram_account_to_follow',
            'instagram_post_to_like', 'instagram_post_to_comment', 'required_tag_count',
            'verify_follow', 'verify_like', 'verify_comment', 'verify_tags',
            'is_active', 'entry_count', 'verified_entry_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'is_active', 'created_at', 'updated_at']
    
    def get_entry_count(self, obj):
        """Get total number of entries."""
        return obj.get_entry_count()
    
    def get_verified_entry_count(self, obj):
        """Get number of verified entries."""
        return obj.get_verified_entry_count()
    
    def create(self, validated_data):
        """Create a new giveaway and set the creator."""
        user = self.context['request'].user
        giveaway = Giveaway.objects.create(created_by=user, **validated_data)
        
        # Log giveaway creation
        AuditLog.objects.create(
            user=user,
            action_type='giveaway_created',
            object_id=str(giveaway.id),
            object_type='Giveaway',
            action_details={'title': giveaway.title}
        )
        
        return giveaway
    
    def update(self, instance, validated_data):
        """Update a giveaway and log changes."""
        old_status = instance.status
        giveaway = super().update(instance, validated_data)
        
        # Log giveaway update
        AuditLog.objects.create(
            user=self.context['request'].user,
            action_type='giveaway_updated',
            object_id=str(giveaway.id),
            object_type='Giveaway',
            action_details={'title': giveaway.title}
        )
        
        # If status changed, log that specifically
        if old_status != giveaway.status:
            AuditLog.objects.create(
                user=self.context['request'].user,
                action_type='giveaway_status_changed',
                object_id=str(giveaway.id),
                object_type='Giveaway',
                action_details={
                    'title': giveaway.title,
                    'old_status': old_status,
                    'new_status': giveaway.status
                }
            )
        
        return giveaway


class EntrySerializer(serializers.ModelSerializer):
    """Serializer for Entry model."""
    giveaway = serializers.PrimaryKeyRelatedField(queryset=Giveaway.objects.all())
    instagram_account = InstagramAccountSerializer(read_only=True)
    
    class Meta:
        model = Entry
        fields = [
            'id', 'giveaway', 'instagram_username', 'instagram_account',
            'verification_status', 'verification_details', 'verified_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'verification_status', 'verification_details', 'verified_at',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        """Create a new entry using the service layer."""
        from .services import GiveawayService, GiveawayVerificationError
        
        user = self.context['request'].user
        giveaway = validated_data['giveaway']
        instagram_username = validated_data['instagram_username']
        
        # Try to get the user's Instagram account
        instagram_account = None
        try:
            instagram_account = InstagramAccount.objects.get(user=user)
        except InstagramAccount.DoesNotExist:
            pass
        
        try:
            entry = GiveawayService.create_entry(
                giveaway=giveaway,
                instagram_username=instagram_username,
                instagram_account=instagram_account,
                user=user,
                client_ip=self.context['request'].META.get('REMOTE_ADDR')
            )
            return entry
        except GiveawayVerificationError as e:
            raise serializers.ValidationError(str(e))


class WinnerSerializer(serializers.ModelSerializer):
    """Serializer for Winner model."""
    giveaway = GiveawaySerializer(read_only=True)
    entry = EntrySerializer(read_only=True)
    
    class Meta:
        model = Winner
        fields = [
            'id', 'giveaway', 'entry', 'selected_at', 'contacted', 
            'contacted_at', 'prize_claimed', 'claimed_at', 'notes'
        ]
        read_only_fields = ['id', 'giveaway', 'entry', 'selected_at']


class VerificationRuleSerializer(serializers.ModelSerializer):
    """Serializer for VerificationRule model."""
    giveaway = serializers.PrimaryKeyRelatedField(queryset=Giveaway.objects.all())
    
    class Meta:
        model = VerificationRule
        fields = [
            'id', 'name', 'giveaway', 'rule_type', 'rule_params', 
            'is_required', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer for AuditLog model."""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'action_type', 'action_details', 
            'object_id', 'object_type', 'timestamp', 'ip_address'
        ]
        read_only_fields = fields 