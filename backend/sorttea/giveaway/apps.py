"""
App configuration for the Giveaway app.
"""

from django.apps import AppConfig


class GiveawayConfig(AppConfig):
    """Configuration for the Giveaway app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sorttea.giveaway' 