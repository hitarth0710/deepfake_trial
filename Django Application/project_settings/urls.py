from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('ml_app.urls')),  # Include ml_app URLs at root level
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
