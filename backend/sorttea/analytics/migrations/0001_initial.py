# Generated by Django 5.1.6 on 2025-03-08 06:49

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("giveaway", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="OverviewStats",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("total_giveaways", models.IntegerField(default=0)),
                ("active_giveaways", models.IntegerField(default=0)),
                ("total_participants", models.IntegerField(default=0)),
                ("total_engagement", models.IntegerField(default=0)),
                ("completion_rate", models.FloatField(default=0)),
                (
                    "last_updated",
                    models.DateTimeField(default=django.utils.timezone.now),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="overview_stats",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ActivityData",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField(db_index=True)),
                ("participants", models.IntegerField(default=0)),
                ("engagement", models.IntegerField(default=0)),
                ("completion_rate", models.FloatField(default=0)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="activity_data",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["date"],
                "unique_together": {("date", "user")},
            },
        ),
        migrations.CreateModel(
            name="EngagementBreakdown",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("date", models.DateField()),
                ("likes", models.IntegerField(default=0)),
                ("comments", models.IntegerField(default=0)),
                ("shares", models.IntegerField(default=0)),
                ("follows", models.IntegerField(default=0)),
                ("tags", models.IntegerField(default=0)),
                (
                    "giveaway",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="engagement_breakdowns",
                        to="giveaway.giveaway",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="engagement_breakdowns",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["date"],
                "unique_together": {("date", "user", "giveaway")},
            },
        ),
    ]
