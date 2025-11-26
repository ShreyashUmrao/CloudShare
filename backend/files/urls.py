from django.urls import path
from .views import SimpleTestUploadView, MyFilesView, CreateShareLink, PublicShareLinkView, DownloadFileView, DeleteFileView, FileAnalyticsView

urlpatterns = [
    path("test-upload/", SimpleTestUploadView.as_view()),
    path("my-files/", MyFilesView.as_view()),
    path("create-share-link/", CreateShareLink.as_view()),
    path("share/<uuid:share_id>/", PublicShareLinkView.as_view()),
    path("download/<uuid:file_id>/", DownloadFileView.as_view()),   # UUID primary key
    path("delete/<uuid:file_id>/", DeleteFileView.as_view()),
    path("analytics/<uuid:file_id>/", FileAnalyticsView.as_view()),
]
