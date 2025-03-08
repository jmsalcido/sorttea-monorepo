from django.apps import AppConfig


class AnalyticsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "sorttea.analytics"
    verbose_name = "Analytics"

    def ready(self):
        # Import any signals here
        pass
