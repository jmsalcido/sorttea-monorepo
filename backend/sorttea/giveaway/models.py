"""
Models for the Giveaway app.
"""

import uuid
import logging
import random
from django.db import models
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger('sorttea.giveaway')


class Giveaway(models.Model):
    """Model for giveaway campaigns."""
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('ended', 'Ended'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_giveaways')
    
    # Giveaway details
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    prize_description = models.TextField()
    winner_count = models.PositiveIntegerField(default=1)
    
    # Instagram specific fields
    instagram_account_to_follow = models.CharField(max_length=255, blank=True, null=True)
    instagram_post_to_like = models.CharField(max_length=255, blank=True, null=True)
    instagram_post_to_comment = models.CharField(max_length=255, blank=True, null=True)
    required_tag_count = models.PositiveIntegerField(default=0)
    
    # Verification rules (configurable)
    verify_follow = models.BooleanField(default=True)
    verify_like = models.BooleanField(default=True)
    verify_comment = models.BooleanField(default=False)
    verify_tags = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def is_active(self):
        return (
            self.status == 'active' and 
            self.start_date <= timezone.now() <= self.end_date
        )
    
    def get_entry_count(self):
        return self.entries.count()
    
    def get_verified_entry_count(self):
        return self.entries.filter(verification_status='verified').count()
    
    def select_winners(self, count=None):
        """Select random winners from verified entries."""
        if count is None:
            count = self.winner_count
            
        verified_entries = self.entries.filter(verification_status='verified')
        entry_count = verified_entries.count()
        
        if entry_count == 0:
            logger.warning(f"No verified entries found for giveaway {self.id}")
            return []
            
        if entry_count <= count:
            logger.info(f"All {entry_count} verified entries selected as winners for giveaway {self.id}")
            winner_entries = verified_entries
        else:
            # Select random entries
            winner_ids = random.sample(list(verified_entries.values_list('id', flat=True)), count)
            winner_entries = verified_entries.filter(id__in=winner_ids)
            logger.info(f"Selected {count} winners randomly from {entry_count} entries for giveaway {self.id}")
        
        # Mark selected entries as winners
        for entry in winner_entries:
            Winner.objects.get_or_create(giveaway=self, entry=entry)
            
        return winner_entries


class Entry(models.Model):
    """Model for giveaway entries."""
    VERIFICATION_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('failed', 'Failed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    giveaway = models.ForeignKey(Giveaway, on_delete=models.CASCADE, related_name='entries')
    instagram_username = models.CharField(max_length=255)
    instagram_account = models.ForeignKey('instagram.InstagramAccount', on_delete=models.SET_NULL, 
                                         null=True, blank=True, related_name='giveaway_entries')
    
    # Verification status
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='pending')
    verification_details = models.JSONField(default=dict)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.instagram_username} - {self.giveaway.title}"
    
    def mark_verified(self, details=None):
        """Mark entry as verified with optional details."""
        self.verification_status = 'verified'
        self.verified_at = timezone.now()
        if details:
            self.verification_details.update(details)
        self.save()
        logger.info(f"Entry {self.id} by {self.instagram_username} marked as verified")
    
    def mark_failed(self, details=None):
        """Mark entry as failed with optional details."""
        self.verification_status = 'failed'
        if details:
            self.verification_details.update(details)
        self.save()
        logger.info(f"Entry {self.id} by {self.instagram_username} marked as failed")
    
    class Meta:
        unique_together = ('giveaway', 'instagram_username')
        indexes = [
            models.Index(fields=['giveaway', 'verification_status']),
            models.Index(fields=['instagram_username']),
        ]


class Winner(models.Model):
    """Model for giveaway winners."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    giveaway = models.ForeignKey(Giveaway, on_delete=models.CASCADE, related_name='winners')
    entry = models.OneToOneField(Entry, on_delete=models.CASCADE, related_name='winner')
    selected_at = models.DateTimeField(auto_now_add=True)
    contacted = models.BooleanField(default=False)
    contacted_at = models.DateTimeField(null=True, blank=True)
    prize_claimed = models.BooleanField(default=False)
    claimed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Winner {self.entry.instagram_username} for {self.giveaway.title}"
    
    def mark_contacted(self):
        """Mark winner as contacted."""
        self.contacted = True
        self.contacted_at = timezone.now()
        self.save()
        logger.info(f"Winner {self.id} marked as contacted")
    
    def mark_claimed(self):
        """Mark prize as claimed."""
        self.prize_claimed = True
        self.claimed_at = timezone.now()
        self.save()
        logger.info(f"Prize for winner {self.id} marked as claimed")


class VerificationRule(models.Model):
    """Model for custom verification rules that can be associated with giveaways."""
    name = models.CharField(max_length=255)
    giveaway = models.ForeignKey(Giveaway, on_delete=models.CASCADE, related_name='custom_rules')
    rule_type = models.CharField(max_length=50)
    rule_params = models.JSONField(default=dict)
    is_required = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} for {self.giveaway.title}"


class AuditLog(models.Model):
    """Model for audit logging of important actions."""
    ACTION_TYPES = (
        ('entry_created', 'Entry Created'),
        ('entry_verified', 'Entry Verified'),
        ('entry_failed', 'Entry Failed'),
        ('winner_selected', 'Winner Selected'),
        ('winner_contacted', 'Winner Contacted'),
        ('prize_claimed', 'Prize Claimed'),
        ('verification_rule_created', 'Verification Rule Created'),
        ('verification_rule_updated', 'Verification Rule Updated'),
        ('giveaway_created', 'Giveaway Created'),
        ('giveaway_updated', 'Giveaway Updated'),
        ('giveaway_status_changed', 'Giveaway Status Changed'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    action_details = models.JSONField(default=dict)
    object_id = models.CharField(max_length=255, null=True, blank=True)
    object_type = models.CharField(max_length=255, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.action_type} at {self.timestamp}"
    
    class Meta:
        indexes = [
            models.Index(fields=['action_type']),
            models.Index(fields=['object_type', 'object_id']),
            models.Index(fields=['timestamp']),
        ] 