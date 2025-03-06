"""
Tests for the Giveaway app.
"""

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import Giveaway, Entry, Winner
from .services import GiveawayService, GiveawayVerificationError

User = get_user_model()


class GiveawayModelTests(TestCase):
    """Tests for the Giveaway model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create an active giveaway
        self.active_giveaway = Giveaway.objects.create(
            title='Test Active Giveaway',
            description='This is a test active giveaway',
            created_by=self.user,
            start_date=timezone.now() - timedelta(days=1),
            end_date=timezone.now() + timedelta(days=1),
            status='active',
            prize_description='Test Prize',
            instagram_account_to_follow='testaccount',
            instagram_post_to_like='12345',
            verify_follow=True,
            verify_like=True
        )
        
        # Create an ended giveaway
        self.ended_giveaway = Giveaway.objects.create(
            title='Test Ended Giveaway',
            description='This is a test ended giveaway',
            created_by=self.user,
            start_date=timezone.now() - timedelta(days=2),
            end_date=timezone.now() - timedelta(days=1),
            status='ended',
            prize_description='Test Prize',
            instagram_account_to_follow='testaccount',
            instagram_post_to_like='12345',
            verify_follow=True,
            verify_like=True
        )
    
    def test_giveaway_is_active(self):
        """Test the is_active property."""
        self.assertTrue(self.active_giveaway.is_active)
        self.assertFalse(self.ended_giveaway.is_active)
    
    def test_giveaway_str(self):
        """Test the string representation."""
        self.assertEqual(str(self.active_giveaway), 'Test Active Giveaway')


class EntryModelTests(TestCase):
    """Tests for the Entry model."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.giveaway = Giveaway.objects.create(
            title='Test Giveaway',
            description='This is a test giveaway',
            created_by=self.user,
            start_date=timezone.now() - timedelta(days=1),
            end_date=timezone.now() + timedelta(days=1),
            status='active',
            prize_description='Test Prize'
        )
        
        self.entry = Entry.objects.create(
            giveaway=self.giveaway,
            instagram_username='testuser',
            verification_status='pending'
        )
    
    def test_entry_str(self):
        """Test the string representation."""
        self.assertEqual(str(self.entry), 'testuser - Test Giveaway')
    
    def test_mark_verified(self):
        """Test marking an entry as verified."""
        self.entry.mark_verified({'test': 'data'})
        self.assertEqual(self.entry.verification_status, 'verified')
        self.assertIsNotNone(self.entry.verified_at)
        self.assertEqual(self.entry.verification_details, {'test': 'data'})
    
    def test_mark_failed(self):
        """Test marking an entry as failed."""
        self.entry.mark_failed({'error': 'test error'})
        self.assertEqual(self.entry.verification_status, 'failed')
        self.assertEqual(self.entry.verification_details, {'error': 'test error'})


class GiveawayServiceTests(TestCase):
    """Tests for the GiveawayService."""
    
    def setUp(self):
        """Set up test data."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create an active giveaway
        self.active_giveaway = Giveaway.objects.create(
            title='Test Active Giveaway',
            description='This is a test active giveaway',
            created_by=self.user,
            start_date=timezone.now() - timedelta(days=1),
            end_date=timezone.now() + timedelta(days=1),
            status='active',
            prize_description='Test Prize'
        )
        
        # Create an ended giveaway
        self.ended_giveaway = Giveaway.objects.create(
            title='Test Ended Giveaway',
            description='This is a test ended giveaway',
            created_by=self.user,
            start_date=timezone.now() - timedelta(days=2),
            end_date=timezone.now() - timedelta(days=1),
            status='ended',
            prize_description='Test Prize'
        )
    
    def test_create_entry_for_active_giveaway(self):
        """Test creating an entry for an active giveaway."""
        entry = GiveawayService.create_entry(
            giveaway=self.active_giveaway,
            instagram_username='testuser',
            user=self.user
        )
        
        self.assertEqual(entry.giveaway, self.active_giveaway)
        self.assertEqual(entry.instagram_username, 'testuser')
        self.assertEqual(entry.verification_status, 'pending')
    
    def test_create_entry_for_inactive_giveaway(self):
        """Test creating an entry for an inactive giveaway."""
        with self.assertRaises(GiveawayVerificationError):
            GiveawayService.create_entry(
                giveaway=self.ended_giveaway,
                instagram_username='testuser',
                user=self.user
            )
    
    def test_create_duplicate_entry(self):
        """Test creating a duplicate entry."""
        # Create first entry
        GiveawayService.create_entry(
            giveaway=self.active_giveaway,
            instagram_username='testuser',
            user=self.user
        )
        
        # Try to create duplicate
        with self.assertRaises(GiveawayVerificationError):
            GiveawayService.create_entry(
                giveaway=self.active_giveaway,
                instagram_username='testuser',
                user=self.user
            )
    
    def test_select_winners_for_ended_giveaway(self):
        """Test selecting winners for an ended giveaway."""
        # Create verified entries
        for i in range(5):
            entry = Entry.objects.create(
                giveaway=self.ended_giveaway,
                instagram_username=f'testuser{i}',
                verification_status='verified',
                verified_at=timezone.now()
            )
        
        # Select winners
        winners = GiveawayService.select_winners(self.ended_giveaway, user=self.user)
        
        # Default winner count is 1
        self.assertEqual(len(winners), 1)
        self.assertEqual(Winner.objects.filter(giveaway=self.ended_giveaway).count(), 1)
    
    def test_select_winners_for_active_giveaway(self):
        """Test selecting winners for an active giveaway."""
        with self.assertRaises(GiveawayVerificationError):
            GiveawayService.select_winners(self.active_giveaway, user=self.user) 