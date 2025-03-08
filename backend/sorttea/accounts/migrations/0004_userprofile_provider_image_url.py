# Generated by Django 5.1.6 on 2025-03-08 07:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0003_userprofile_auth_token"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="provider_image_url",
            field=models.URLField(
                blank=True,
                help_text="URL to user's profile picture from the provider",
                null=True,
            ),
        ),
    ]
