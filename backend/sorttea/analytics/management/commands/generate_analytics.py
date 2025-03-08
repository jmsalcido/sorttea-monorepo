import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from sorttea.accounts.models import User
from sorttea.analytics.models import ActivityData

class Command(BaseCommand):
    help = 'Generates mock analytics data for all users for the last 30 days'

    def handle(self, *args, **options):
        users = User.objects.all()
        user_count = users.count()
        
        if user_count == 0:
            self.stdout.write(self.style.WARNING('No users found. Please create users first.'))
            return
        
        self.stdout.write(f'Generating analytics data for {user_count} users...')
        
        # Get date range (last 30 days)
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        # Delete existing data in this range to avoid duplicates
        ActivityData.objects.filter(date__gte=start_date, date__lte=end_date).delete()
        
        # Generate analytics data for each user
        for user in users:
            self.stdout.write(f'Generating data for user: {user.email}')
            
            current_date = start_date
            base_participants = random.randint(5, 15)
            base_engagement = random.randint(10, 30)
            
            activity_data_objects = []
            
            while current_date <= end_date:
                # Calculate the day number in sequence
                day_number = (current_date - start_date).days + 1
                
                # Generate slightly increasing participants (with some randomness)
                participants = base_participants + (day_number // 3) + random.randint(-3, 5)
                participants = max(1, participants)  # Ensure always positive
                
                # Generate slightly increasing engagement (with some randomness)
                engagement = base_engagement + (day_number // 2) + random.randint(-5, 10)
                engagement = max(participants, engagement)  # Engagement should be >= participants
                
                # Calculate completion rate
                completion_rate = min(98, (40 + (day_number // 2) + random.randint(0, 30)))
                
                # Create ActivityData object to save later
                activity_data_objects.append(
                    ActivityData(
                        user=user,
                        date=current_date,
                        participants=participants,
                        engagement=engagement,
                        completion_rate=completion_rate
                    )
                )
                
                current_date += timedelta(days=1)
            
            # Bulk create all the objects for this user
            ActivityData.objects.bulk_create(activity_data_objects, ignore_conflicts=True)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully generated analytics data for {user_count} users')) 