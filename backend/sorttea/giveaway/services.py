"""
Service layer for giveaway verification and management.
"""

import logging
from django.utils import timezone
from django.db import transaction
from sorttea.instagram.models import InstagramAccount
from sorttea.instagram.services import InstagramService, InstagramAPIError
from .models import Giveaway, Entry, AuditLog

logger = logging.getLogger('sorttea.giveaway')


class GiveawayVerificationError(Exception):
    """Exception raised for giveaway verification errors."""
    pass


class GiveawayService:
    """Service for giveaway management and verification."""
    
    @staticmethod
    def create_entry(giveaway, instagram_username, instagram_account=None, user=None, client_ip=None):
        """
        Create a new giveaway entry and queue verification if possible.
        """
        if not giveaway.is_active:
            logger.warning(f"Attempted to create entry for inactive giveaway {giveaway.id}")
            raise GiveawayVerificationError("This giveaway is not currently active")
            
        # Check for duplicate entries
        if Entry.objects.filter(giveaway=giveaway, instagram_username=instagram_username).exists():
            logger.warning(f"Duplicate entry attempt for {instagram_username} in giveaway {giveaway.id}")
            raise GiveawayVerificationError("You have already submitted an entry for this giveaway")
            
        # Create entry
        with transaction.atomic():
            entry = Entry.objects.create(
                giveaway=giveaway,
                instagram_username=instagram_username,
                instagram_account=instagram_account,
                verification_status='pending'
            )
            
            # Log entry creation
            AuditLog.objects.create(
                user=user,
                action_type='entry_created',
                object_id=str(entry.id),
                object_type='Entry',
                ip_address=client_ip,
                action_details={
                    'giveaway_id': str(giveaway.id),
                    'instagram_username': instagram_username
                }
            )
            
            # Try to verify immediately if we have Instagram account access
            if instagram_account and instagram_account.is_token_valid:
                try:
                    GiveawayService.verify_entry(entry)
                except (GiveawayVerificationError, InstagramAPIError) as e:
                    logger.warning(f"Entry initial verification failed: {str(e)}")
                    # We don't raise here, as the entry is still created
            
        return entry
    
    @staticmethod
    def verify_entry(entry, force=False):
        """
        Verify a giveaway entry against all required verification rules.
        """
        if entry.verification_status == 'verified' and not force:
            logger.info(f"Entry {entry.id} already verified")
            return True
            
        giveaway = entry.giveaway
        instagram_account = entry.instagram_account
        
        if not instagram_account:
            logger.error(f"Cannot verify entry {entry.id} without Instagram account access")
            entry.mark_failed({'error': 'No Instagram account connected'})
            raise GiveawayVerificationError("Cannot verify entry without Instagram account access")
            
        if not instagram_account.is_token_valid:
            logger.error(f"Invalid Instagram token for account {instagram_account.username}")
            entry.mark_failed({'error': 'Instagram token is invalid or expired'})
            raise GiveawayVerificationError("Instagram authorization is invalid or expired")
            
        verification_results = {}
        verification_passed = True
        
        try:
            # Verify follow rule if enabled
            if giveaway.verify_follow and giveaway.instagram_account_to_follow:
                follow_result = InstagramService.verify_follow(
                    instagram_account, 
                    giveaway.instagram_account_to_follow
                )
                verification_results['follow'] = follow_result
                verification_passed = verification_passed and follow_result
            
            # Verify like rule if enabled
            if giveaway.verify_like and giveaway.instagram_post_to_like:
                like_result = InstagramService.verify_like(
                    instagram_account, 
                    giveaway.instagram_post_to_like
                )
                verification_results['like'] = like_result
                verification_passed = verification_passed and like_result
            
            # Verify comment rule if enabled
            if giveaway.verify_comment and giveaway.instagram_post_to_comment:
                comment_result = InstagramService.verify_comment(
                    instagram_account, 
                    giveaway.instagram_post_to_comment
                )
                verification_results['comment'] = comment_result
                verification_passed = verification_passed and comment_result
            
            # Verify tag rule if enabled
            # This would require looking at comments on the post and checking tags
            # Currently a placeholder as detailed implementation depends on Instagram API limitations
            if giveaway.verify_tags and giveaway.required_tag_count > 0 and giveaway.instagram_post_to_comment:
                tags_verified = True  # Placeholder for actual verification
                verification_results['tags'] = tags_verified
                verification_passed = verification_passed and tags_verified
            
            # Verify custom rules if any
            for custom_rule in giveaway.custom_rules.all():
                # Implementation would depend on custom rule types
                # Placeholder for actual verification
                rule_passed = True
                verification_results[f'custom_rule_{custom_rule.id}'] = rule_passed
                if custom_rule.is_required:
                    verification_passed = verification_passed and rule_passed
            
            # Update entry status based on verification results
            if verification_passed:
                entry.mark_verified(verification_results)
                
                # Log successful verification
                AuditLog.objects.create(
                    action_type='entry_verified',
                    object_id=str(entry.id),
                    object_type='Entry',
                    action_details={
                        'giveaway_id': str(giveaway.id),
                        'instagram_username': entry.instagram_username,
                        'verification_results': verification_results
                    }
                )
                
                return True
            else:
                entry.mark_failed({'error': 'Failed verification checks', 'details': verification_results})
                
                # Log failed verification
                AuditLog.objects.create(
                    action_type='entry_failed',
                    object_id=str(entry.id),
                    object_type='Entry',
                    action_details={
                        'giveaway_id': str(giveaway.id),
                        'instagram_username': entry.instagram_username,
                        'verification_results': verification_results
                    }
                )
                
                return False
                
        except InstagramAPIError as e:
            logger.error(f"Instagram API error during verification: {str(e)}")
            entry.mark_failed({'error': str(e)})
            raise GiveawayVerificationError(f"Instagram API error: {str(e)}")
    
    @staticmethod
    def select_winners(giveaway, count=None, user=None):
        """
        Select winners for a giveaway.
        """
        if giveaway.status != 'ended':
            logger.warning(f"Attempted to select winners for active giveaway {giveaway.id}")
            raise GiveawayVerificationError("Cannot select winners for an active giveaway")
            
        winner_entries = giveaway.select_winners(count)
        
        # Log winner selection
        AuditLog.objects.create(
            user=user,
            action_type='winner_selected',
            object_id=str(giveaway.id),
            object_type='Giveaway',
            action_details={
                'winner_count': len(winner_entries),
                'winners': [str(entry.id) for entry in winner_entries]
            }
        )
        
        return winner_entries
    
    @staticmethod
    def revalidate_entries(giveaway, user=None):
        """
        Revalidate all pending entries for a giveaway.
        """
        pending_entries = giveaway.entries.filter(verification_status='pending')
        validated_count = 0
        
        for entry in pending_entries:
            if entry.instagram_account and entry.instagram_account.is_token_valid:
                try:
                    if GiveawayService.verify_entry(entry):
                        validated_count += 1
                except Exception as e:
                    logger.error(f"Error revalidating entry {entry.id}: {str(e)}")
                    
        logger.info(f"Revalidated {validated_count} of {pending_entries.count()} entries for giveaway {giveaway.id}")
        
        # Log revalidation action
        AuditLog.objects.create(
            user=user,
            action_type='entries_revalidated',
            object_id=str(giveaway.id),
            object_type='Giveaway',
            action_details={
                'pending_count': pending_entries.count(),
                'validated_count': validated_count
            }
        )
        
        return validated_count 