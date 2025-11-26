from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),       
    path("files/", include("files.urls")),   
    path("analytics/", include("analytics.urls")),
]
