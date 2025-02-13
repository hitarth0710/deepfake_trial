from django.urls import path
from . import views

urlpatterns = [
    path('api/analyze/', views.analyze_video, name='analyze_video'),
]
