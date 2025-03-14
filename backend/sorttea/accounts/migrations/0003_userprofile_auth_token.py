# Generated by Django 5.1.6 on 2025-03-08 05:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0002_userprofile_auth_provider_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="auth_token",
            field=models.TextField(
                blank=True,
                help_text="Authentication token from provider (mainly for debugging)",
                null=True,
            ),
        ),
    ]
