from django.db import models
from django.utils import timezone
from sorttea.accounts.models import User
from sorttea.giveaway.models import Giveaway

class ActivityData(models.Model):
    """
    Stores daily activity data for analytics charts
    """
    date = models.DateField(db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_data')
    participants = models.IntegerField(default=0)
    engagement = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0)
    
    class Meta:
        unique_together = ('date', 'user')
        ordering = ['date']
    
    def __str__(self):
        return f"Activity on {self.date} for {self.user.email}"

class OverviewStats(models.Model):
    """
    Stores overall stats for a user
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='overview_stats')
    total_giveaways = models.IntegerField(default=0)
    active_giveaways = models.IntegerField(default=0)
    total_participants = models.IntegerField(default=0)
    total_engagement = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0)
    last_updated = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Overview stats for {self.user.email}"

class EngagementBreakdown(models.Model):
    """
    Stores engagement breakdown by type
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='engagement_breakdowns')
    giveaway = models.ForeignKey(Giveaway, on_delete=models.CASCADE, related_name='engagement_breakdowns', null=True, blank=True)
    date = models.DateField()
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    follows = models.IntegerField(default=0)
    tags = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ('date', 'user', 'giveaway')
        ordering = ['date']
    
    def __str__(self):
        giveaway_info = f" for {self.giveaway.title}" if self.giveaway else ""
        return f"Engagement on {self.date} for {self.user.email}{giveaway_info}"
