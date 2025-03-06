"""
Tests for the Instagram app.
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from unittest.mock import patch, MagicMock
from .models import InstagramAccount, InstagramMediaCache, InstagramInteraction
from .services import InstagramService, InstagramAPIError

User = get_user_model()


class InstagramAccountModelTests(TestCase):
    """Tests for the InstagramAccount model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create an Instagram account with valid token
        self.valid_account = InstagramAccount.objects.create(
            user=self.user,
            instagram_user_id='12345',
            username='testuser',
            access_token='valid-token',
            token_type='Bearer',
            expires_at=timezone.now() + timedelta(days=30)
        )
        
        # Create an Instagram account with expired token
        self.expired_account = InstagramAccount.objects.create(
            user=User.objects.create_user(username='expireduser', password='testpass123'),
            instagram_user_id='67890',
            username='expireduser',
            access_token='expired-token',
            token_type='Bearer',
            expires_at=timezone.now() - timedelta(days=1)
        )
    
    def test_is_token_valid(self):
        """Test the is_token_valid property."""
        self.assertTrue(self.valid_account.is_token_valid)
        self.assertFalse(self.expired_account.is_token_valid)
    
    def test_update_token(self):
        """Test updating the token."""
        self.valid_account.update_token('new-token', 'Bearer', 3600)
        self.assertEqual(self.valid_account.access_token, 'new-token')
        self.assertEqual(self.valid_account.token_type, 'Bearer')
        self.assertTrue(self.valid_account.is_token_valid)


class InstagramServiceTests(TestCase):
    """Tests for the InstagramService."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.instagram_account = InstagramAccount.objects.create(
            user=self.user,
            instagram_user_id='12345',
            username='testuser',
            access_token='valid-token',
            token_type='Bearer',
            expires_at=timezone.now() + timedelta(days=30)
        )
    
    @patch('sorttea.instagram.services.requests.get')
    def test_get_user_info(self, mock_get):
        """Test getting user info."""
        # Mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'id': '12345',
            'username': 'testuser'
        }
        mock_get.return_value = mock_response
        
        # Call the service
        user_info = InstagramService.get_user_info('valid-token')
        
        # Check the result
        self.assertEqual(user_info['id'], '12345')
        self.assertEqual(user_info['username'], 'testuser')
        
        # Check the API call
        mock_get.assert_called_once()
        args, kwargs = mock_get.call_args
        self.assertEqual(kwargs['params']['access_token'], 'valid-token')
    
    @patch('sorttea.instagram.services.requests.get')
    def test_get_user_info_error(self, mock_get):
        """Test error handling when getting user info."""
        # Mock error response
        mock_response = MagicMock()
        mock_response.status_code = 400
        mock_response.text = 'Invalid token'
        mock_get.return_value = mock_response
        
        # Call the service and check for exception
        with self.assertRaises(InstagramAPIError):
            InstagramService.get_user_info('invalid-token')
    
    @patch('sorttea.instagram.services.InstagramService.verify_follow')
    def test_verify_follow(self, mock_verify_follow):
        """Test verifying a follow interaction."""
        # Mock successful verification
        mock_verify_follow.return_value = True
        
        # Call the service
        result = InstagramService.verify_follow(self.instagram_account, 'targetuser')
        
        # Check the result
        self.assertTrue(result)
        
        # Check that an interaction was created
        interaction = InstagramInteraction.objects.get(
            instagram_account=self.instagram_account,
            target_username='targetuser',
            interaction_type='follow'
        )
        self.assertTrue(interaction.verified) 