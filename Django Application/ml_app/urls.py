from django.urls import path
from . import views
from .api import VideoAnalysisAPI

urlpatterns = [
    path('', views.index, name='index'),
    path('predict/', views.predict, name='predict'),
    path('api/analyze/', VideoAnalysisAPI.as_view(), name='video_analysis_api'),
]