from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from django.conf import settings
import jwt
import logging
import json

logger = logging.getLogger('sorttea.accounts')

class NextAuthAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class that accepts NextAuth.js tokens from Google OAuth.
    
    This class assumes that the user has already been registered in our system 
    during the NextAuth.js signIn callback, which associates the Google account 
    with our Django user.
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        if not token:
            return None

        try:
            # Debug logging
            logger.info(f"Authenticating with token: {token[:10]}...")
            
            # Check for email header in development mode
            if settings.DEBUG:
                email_header = request.META.get('HTTP_X_AUTH_EMAIL')
                if email_header:
                    logger.warning(f"DEBUG MODE: Using email from X-Auth-Email header: {email_header}")
                    user = User.objects.filter(email=email_header).first()
                    if user:
                        logger.warning(f"DEBUG MODE: Found user by email header: {user.username}")
                        return (user, token)
            
            # Option 1: Try to decode as JWT
            try:
                # Attempt to decode without verification
                decoded = jwt.decode(token, options={"verify_signature": False})
                logger.info(f"Decoded token payload: {json.dumps(decoded)[:100]}...")
                
                # First try to find by email
                email = decoded.get('email')
                if email:
                    logger.info(f"Found email in token: {email}")
                    user = User.objects.filter(email=email).first()
                    if user:
                        logger.info(f"Found user by email: {user.username}")
                        return (user, token)
                
                # Then try to find by sub (user ID)
                sub = decoded.get('sub')
                if sub:
                    logger.info(f"Found subject in token: {sub}")
                    # Try to find user with matching provider_user_id in their profile
                    from accounts.models import UserProfile
                    profile = UserProfile.objects.filter(provider_user_id=sub).first()
                    if profile and profile.user:
                        logger.info(f"Found user by provider_user_id: {profile.user.username}")
                        return (profile.user, token)
                        
                # Sometimes NextAuth puts user info in a nested 'user' attribute
                if 'user' in decoded and isinstance(decoded['user'], dict):
                    user_data = decoded['user']
                    user_email = user_data.get('email')
                    if user_email:
                        logger.info(f"Found email in nested user object: {user_email}")
                        user = User.objects.filter(email=user_email).first()
                        if user:
                            logger.info(f"Found user by nested email: {user.username}")
                            return (user, token)
            except Exception as e:
                logger.warning(f"Token is not a standard JWT or error parsing: {str(e)}")
                
            # Option 2: If the token is not a JWT, try other methods
            
            # Try a direct lookup of the token value in case it's stored in a user field
            # This would apply if you're storing session tokens directly
            try:
                from accounts.models import UserProfile
                # Note: This will only work after the migration is applied
                # and auth_token field exists
                profile = UserProfile.objects.filter(auth_token=token).first()
                if profile and profile.user:
                    logger.info(f"Found user by direct token match: {profile.user.username}")
                    return (profile.user, token)
            except Exception as e:
                logger.warning(f"Error looking up token in UserProfile: {str(e)}")
                
            # If we're developing/debugging, we can try a safer approach
            if settings.DEBUG:
                # Check if the token is an email address
                if '@' in token and '.' in token:
                    logger.warning(f"DEBUG MODE: Treating token as email: {token}")
                    user = User.objects.filter(email=token).first()
                    if user:
                        logger.warning(f"DEBUG MODE: Found user by email-as-token: {user.username}")
                        return (user, token)
                        
                # Special case for development - safer than taking first user
                # Look up the most recently active user with the provider matching the token
                # This still provides a better debugging experience than the original "first user" approach
                try:
                    # Get token issuer or provider if available
                    provider = None
                    if token.count('.') == 2:  # Looks like a JWT
                        try:
                            decoded = jwt.decode(token, options={"verify_signature": False})
                            # Look for issuer or client_id in token
                            provider = decoded.get('iss', '').lower()
                            if 'google' in provider:
                                provider = 'google'
                            elif 'facebook' in provider:
                                provider = 'facebook'
                            # If no issuer, check for provider directly
                            if not provider and 'provider' in decoded:
                                provider = decoded.get('provider', '').lower()
                        except:
                            pass
                    
                    if provider:
                        logger.warning(f"DEBUG MODE: Looking for recent user with provider: {provider}")
                        # Find most recently updated user with this provider
                        profile = UserProfile.objects.filter(
                            auth_provider=provider
                        ).order_by('-updated_at').first()
                        
                        if profile and profile.user:
                            logger.warning(f"DEBUG MODE: Using last active user for {provider}: {profile.user.username}")
                            return (profile.user, token)
                except Exception as e:
                    logger.warning(f"DEBUG MODE: Error finding user by provider: {str(e)}")
                    
            # If we've exhausted all options, authentication has failed
            logger.error(f"Could not authenticate user from token. No matching user found.")
            raise AuthenticationFailed('Invalid token or user not found')

        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')

    def get_user_email_from_token(self, token):
        """
        Extract the user email from the token without validation.
        In this implementation, we don't validate the token signature
        since NextAuth.js tokens come from Google/other providers.
        """
        try:
            # Try to decode the token without verification to extract the email
            # This is NOT secure for production if you don't trust the token source
            decoded = jwt.decode(token, options={"verify_signature": False})
            
            # Look for common claims that might contain email
            email = decoded.get('email') or decoded.get('sub') or decoded.get('unique_name')
            
            # Check for nested user object
            if not email and 'user' in decoded and isinstance(decoded['user'], dict):
                email = decoded['user'].get('email')
                
            return email
        except jwt.PyJWTError:
            # If the token is not a standard JWT format, it might be an opaque token
            # In that case, we would need another way to identify the user
            return None 