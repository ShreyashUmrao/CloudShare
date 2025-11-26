from django.urls import path
from .views import FileAccessLogs

urlpatterns = [
    path("file/<uuid:file_id>/", FileAccessLogs.as_view()),
]
