from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from django.conf import settings
import jwt
import logging

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
            # We need the session user from our signIn registration
            # Unfortunately, without a shared secret, we can't validate the token correctly
            # But we can use the token as a lookup key to find the associated user
            
            # Debug logging
            logger.info(f"Authenticating with token: {token[:10]}...")
            
            # Option 1: The token is a valid JWT we can decode
            try:
                # Attempt to decode without verification
                decoded = jwt.decode(token, options={"verify_signature": False})
                email = decoded.get('email')
                sub = decoded.get('sub')  # Google user ID
                
                if email:
                    logger.info(f"Found email in token: {email}")
                    user = User.objects.filter(email=email).first()
                    if user:
                        return (user, token)
                
                if sub:
                    logger.info(f"Found subject in token: {sub}")
                    # If you store the Google ID in UserProfile, you could look it up here
                    # user = User.objects.filter(userprofile__google_id=sub).first()
                    # if user:
                    #     return (user, token)
            except Exception as e:
                logger.warning(f"Token is not a decodable JWT: {str(e)}")
                
            # Option 2: The token is an opaque reference token
            # For now, as a temporary measure, use the InstagramSession model to look up users
            # This assumes the token is stored somewhere in your database during registration
            
            # Fallback - for testing only
            # In production, you should implement proper token validation
            # This is insecure and should be replaced with proper token validation
            logger.warning("INSECURE: Using any authenticated user for demo purposes")
            user = User.objects.filter(is_active=True).first()
            if user:
                logger.warning(f"INSECURE AUTH: Using user {user.username} for all requests")
                return (user, token)
                
            raise AuthenticationFailed('User not found for the provided token')

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
            return email
        except jwt.PyJWTError:
            # If the token is not a standard JWT format, it might be an opaque token
            # In that case, we would need another way to identify the user
            return None 