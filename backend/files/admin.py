from django.contrib import admin
from .models import File, ShareLink, FileAccessLog

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ("id", "file_name", "owner", "file_size", "created_at")
    search_fields = ("file_name", "owner__username")

@admin.register(ShareLink)
class ShareLinkAdmin(admin.ModelAdmin):
    list_display = ("id", "file", "created_at", "expires_at", "max_views", "views")
    search_fields = ("file__file_name",)
    list_filter = ("created_at",)

@admin.register(FileAccessLog)
class FileAccessLogAdmin(admin.ModelAdmin):
    list_display = ("file", "ip", "user_agent", "timestamp")
    search_fields = ("file__file_name", "ip")
    list_filter = ("timestamp",)
