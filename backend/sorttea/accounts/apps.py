"""
App configuration for the Accounts app.
"""

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    """Configuration for the Accounts app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sorttea.accounts'
    
    def ready(self):
        """Import signal handlers when the app is ready."""
        import sorttea.accounts.signals 