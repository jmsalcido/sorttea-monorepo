"""
Service layer for Instagram API interactions.
"""

import logging
import requests
from django.conf import settings
from django.utils import timezone
from .models import InstagramAccount, InstagramMediaCache, InstagramInteraction

logger = logging.getLogger('sorttea.instagram')

INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com'
INSTAGRAM_OAUTH_URL = 'https://api.instagram.com/oauth/authorize'
INSTAGRAM_TOKEN_URL = 'https://api.instagram.com/oauth/access_token'
INSTAGRAM_GRAPH_URL = 'https://graph.instagram.com'


class InstagramAPIError(Exception):
    """Exception raised for Instagram API errors."""
    pass


class InstagramService:
    """Service for interaction with Instagram API."""
    
    @staticmethod
    def get_auth_url():
        """Get the Instagram OAuth authorization URL."""
        client_id = settings.INSTAGRAM_CLIENT_ID
        redirect_uri = settings.INSTAGRAM_REDIRECT_URI
        scope = 'user_profile,user_media'  # Add necessary scopes
        
        if not client_id:
            logger.error("Instagram client ID not configured.")
            raise InstagramAPIError("Instagram client ID not configured.")
            
        auth_url = f"{INSTAGRAM_OAUTH_URL}?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}&response_type=code"
        return auth_url
    
    @staticmethod
    def exchange_code_for_token(code):
        """Exchange authorization code for access token."""
        client_id = settings.INSTAGRAM_CLIENT_ID
        client_secret = settings.INSTAGRAM_CLIENT_SECRET
        redirect_uri = settings.INSTAGRAM_REDIRECT_URI
        
        if not client_id or not client_secret:
            logger.error("Instagram client ID or secret not configured.")
            raise InstagramAPIError("Instagram client ID or secret not configured.")
            
        try:
            response = requests.post(INSTAGRAM_TOKEN_URL, data={
                'client_id': client_id,
                'client_secret': client_secret,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri,
                'code': code
            })
            
            if response.status_code != 200:
                logger.error(f"Instagram token exchange failed: {response.text}")
                raise InstagramAPIError(f"Failed to exchange code for token: {response.text}")
                
            token_data = response.json()
            
            # Get long-lived token
            long_lived_token = InstagramService.exchange_token(token_data['access_token'])
            
            # Get user profile info
            user_info = InstagramService.get_user_info(long_lived_token['access_token'])
            
            return {
                'access_token': long_lived_token['access_token'],
                'token_type': 'Bearer',
                'expires_in': long_lived_token['expires_in'],
                'user_id': user_info['id'],
                'username': user_info['username']
            }
            
        except requests.RequestException as e:
            logger.error(f"Instagram token exchange request failed: {str(e)}")
            raise InstagramAPIError(f"Network error during token exchange: {str(e)}")
    
    @staticmethod
    def exchange_token(short_lived_token):
        """Exchange a short-lived token for a long-lived token."""
        client_secret = settings.INSTAGRAM_CLIENT_SECRET
        
        try:
            response = requests.get(
                f"{INSTAGRAM_GRAPH_URL}/access_token",
                params={
                    'grant_type': 'ig_exchange_token',
                    'client_secret': client_secret,
                    'access_token': short_lived_token
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Instagram token exchange failed: {response.text}")
                raise InstagramAPIError(f"Failed to exchange for long-lived token: {response.text}")
                
            return response.json()
            
        except requests.RequestException as e:
            logger.error(f"Instagram token exchange request failed: {str(e)}")
            raise InstagramAPIError(f"Network error during token exchange: {str(e)}")
    
    @staticmethod
    def refresh_token(access_token):
        """Refresh a long-lived Instagram token before it expires."""
        try:
            response = requests.get(
                f"{INSTAGRAM_GRAPH_URL}/refresh_access_token",
                params={
                    'grant_type': 'ig_refresh_token',
                    'access_token': access_token
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Instagram token refresh failed: {response.text}")
                raise InstagramAPIError(f"Failed to refresh token: {response.text}")
                
            return response.json()
            
        except requests.RequestException as e:
            logger.error(f"Instagram token refresh request failed: {str(e)}")
            raise InstagramAPIError(f"Network error during token refresh: {str(e)}")
    
    @staticmethod
    def get_user_info(access_token):
        """Get user profile information using an access token."""
        try:
            response = requests.get(
                f"{INSTAGRAM_GRAPH_URL}/me",
                params={
                    'fields': 'id,username',
                    'access_token': access_token
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Instagram get user info failed: {response.text}")
                raise InstagramAPIError(f"Failed to get user info: {response.text}")
                
            return response.json()
            
        except requests.RequestException as e:
            logger.error(f"Instagram get user info request failed: {str(e)}")
            raise InstagramAPIError(f"Network error during get user info: {str(e)}")
    
    @staticmethod
    def get_user_media(instagram_account, limit=10, after=None):
        """Get media for a user."""
        if not instagram_account.is_token_valid:
            logger.error(f"Instagram token invalid for account {instagram_account.username}")
            raise InstagramAPIError("Instagram token is invalid or expired")
            
        try:
            params = {
                'fields': 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username,children{media_url,thumbnail_url}',
                'access_token': instagram_account.access_token,
                'limit': limit
            }
            
            if after:
                params['after'] = after
                
            response = requests.get(
                f"{INSTAGRAM_GRAPH_URL}/me/media",
                params=params
            )
            
            if response.status_code != 200:
                logger.error(f"Instagram get media failed: {response.text}")
                raise InstagramAPIError(f"Failed to get user media: {response.text}")
                
            data = response.json()
            
            # Cache media data
            InstagramService.cache_media_data(instagram_account, data['data'])
            
            return data
            
        except requests.RequestException as e:
            logger.error(f"Instagram get media request failed: {str(e)}")
            raise InstagramAPIError(f"Network error during get media: {str(e)}")
    
    @staticmethod
    def cache_media_data(instagram_account, media_items):
        """Cache media items to reduce API calls."""
        for item in media_items:
            media_id = item.get('id')
            if not media_id:
                continue
                
            # Create or update media cache
            media_cache, created = InstagramMediaCache.objects.update_or_create(
                media_id=media_id,
                instagram_account=instagram_account,
                defaults={
                    'media_type': item.get('media_type', ''),
                    'permalink': item.get('permalink', ''),
                    'caption': item.get('caption', ''),
                    'like_count': item.get('like_count', 0),
                    'comments_count': item.get('comments_count', 0),
                    'timestamp': timezone.datetime.fromisoformat(item.get('timestamp').replace('Z', '+00:00')),
                    'raw_data': item
                }
            )
            
            if created:
                logger.info(f"Cached new media {media_id} for user {instagram_account.username}")
            else:
                logger.debug(f"Updated cached media {media_id} for user {instagram_account.username}")
    
    @staticmethod
    def verify_follow(instagram_account, target_username):
        """
        Verify if a user follows a target account.
        
        Note: Basic Display API doesn't directly support this verification.
        This is a placeholder that would need to be implemented with Instagram Graph API
        for business accounts or via scraping (which has ToS implications).
        """
        # In a real implementation, this would verify the follow relationship
        # Currently, we'll log the limitation and create a "verified" interaction
        logger.warning(f"Follow verification not fully implemented for {instagram_account.username} -> {target_username}")
        
        # Create interaction record
        interaction, created = InstagramInteraction.objects.get_or_create(
            instagram_account=instagram_account,
            target_username=target_username,
            interaction_type='follow',
            defaults={'verified': True, 'verified_at': timezone.now()}
        )
        
        if not created and not interaction.verified:
            interaction.mark_verified()
            
        return True
    
    @staticmethod
    def verify_like(instagram_account, media_id):
        """
        Verify if a user liked a specific media post.
        
        Note: Basic Display API doesn't directly support this verification.
        This is a placeholder that would need to be implemented with Instagram Graph API.
        """
        # In a real implementation, this would verify the like action
        logger.warning(f"Like verification not fully implemented for {instagram_account.username} on {media_id}")
        
        # Create interaction record
        interaction, created = InstagramInteraction.objects.get_or_create(
            instagram_account=instagram_account,
            target_media_id=media_id,
            interaction_type='like',
            defaults={'verified': True, 'verified_at': timezone.now()}
        )
        
        if not created and not interaction.verified:
            interaction.mark_verified()
            
        return True
    
    @staticmethod
    def verify_comment(instagram_account, media_id, comment_text=None):
        """
        Verify if a user commented on a specific media post.
        
        Note: Basic Display API doesn't directly support this verification.
        This is a placeholder that would need to be implemented with Instagram Graph API.
        """
        # In a real implementation, this would verify the comment
        logger.warning(f"Comment verification not fully implemented for {instagram_account.username} on {media_id}")
        
        # Create interaction record
        interaction, created = InstagramInteraction.objects.get_or_create(
            instagram_account=instagram_account,
            target_media_id=media_id,
            interaction_type='comment',
            defaults={'verified': True, 'verified_at': timezone.now()}
        )
        
        if not created and not interaction.verified:
            interaction.mark_verified()
            
        return True
    
    @staticmethod
    def verify_tag(instagram_account, media_id, tagged_username):
        """
        Verify if a user tagged someone in a specific media post.
        
        Note: Basic Display API doesn't directly support this verification.
        This is a placeholder that would need to be implemented with Instagram Graph API.
        """
        # In a real implementation, this would verify the tag action
        logger.warning(f"Tag verification not fully implemented for {instagram_account.username} -> {tagged_username} on {media_id}")
        
        # Create interaction record
        interaction, created = InstagramInteraction.objects.get_or_create(
            instagram_account=instagram_account,
            target_username=tagged_username,
            target_media_id=media_id,
            interaction_type='tag',
            defaults={'verified': True, 'verified_at': timezone.now()}
        )
        
        if not created and not interaction.verified:
            interaction.mark_verified()
            
        return True 