from django.urls import path
from . import views

urlpatterns = [
    path('overview/', views.OverviewStatsView.as_view(), name='overview-stats'),
    path('timeseries/', views.TimeseriesDataView.as_view(), name='timeseries-data'),
    path('engagement-breakdown/', views.EngagementBreakdownView.as_view(), name='engagement-breakdown'),
    path('top-giveaways/', views.TopGiveawaysView.as_view(), name='top-giveaways'),
    path('participant-demographics/', views.ParticipantDemographicsView.as_view(), name='participant-demographics'),
    path('export/', views.export_report, name='export-report'),
] 