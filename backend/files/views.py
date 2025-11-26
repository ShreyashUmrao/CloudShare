from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from .models import File, ShareLink, FileAccessLog
import boto3
import uuid
from django.shortcuts import get_object_or_404
import json
from urllib import request as urlrequest
from datetime import timedelta
from django.utils import timezone
from django.core.cache import cache
from django.db.models import Count
from django.db.models.functions import TruncMinute

class MyFilesView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        files = File.objects.filter(owner=request.user).values(
            "id", "file_name", "file_size", "created_at"
        )
        return Response(list(files))

class SimpleTestUploadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        upload = request.FILES.get("file")
        if not upload:
            return Response({"error": "No file provided"}, status=400)

        r2 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            region_name="auto",
        )

        r2_key = f"uploads/{uuid.uuid4()}_{upload.name}"

        r2.upload_fileobj(
            upload,
            settings.AWS_STORAGE_BUCKET_NAME,
            r2_key,
            ExtraArgs={"ContentType": upload.content_type}
        )

        file_obj = File.objects.create(
            owner=request.user,
            file_name=upload.name,
            file_size=upload.size,
            file_type=upload.content_type,
            r2_key=r2_key,
        )

        return Response({"message": "Uploaded OK", "file_id": str(file_obj.id)})

class CreateShareLink(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        file_id = request.data.get("file_id")
        password = request.data.get("password")
        file_obj = get_object_or_404(File, id=file_id, owner=request.user)

        share = ShareLink.objects.create(
            file=file_obj,
            password=password if password else None,
        )

        return Response({"share_id": str(share.id)})

class PublicShareLinkView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, share_id):
        share = get_object_or_404(ShareLink, id=share_id)

        if share.is_expired:
            return Response({"error": "Link expired"}, status=403)

        password = request.data.get("password")
        if share.password and share.password != password:
            return Response({"error": "Invalid password"}, status=403)

        if share.max_views and share.views >= share.max_views:
            return Response({"error": "Max views reached"}, status=403)

        share.views += 1
        share.save()

        file = share.file

        FileAccessLog.objects.create(
            file=file,
            ip=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
        )

        return Response({"file_id": str(file.id), "file_name": file.file_name})

class DownloadFileView(APIView):
    permission_classes = [AllowAny]  
    def get(self, request, file_id):
        file = get_object_or_404(File, id=file_id)

        r2 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            region_name="auto",
        )

        presigned_url = r2.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.AWS_STORAGE_BUCKET_NAME, "Key": file.r2_key,},
            ExpiresIn=3600,
        )

        return Response({"download_url": presigned_url})


class DeleteFileView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, file_id):
        file = get_object_or_404(File, id=file_id, owner=request.user)

        r2 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            endpoint_url=settings.AWS_S3_ENDPOINT_URL,
            region_name="auto",
        )

        try:
            r2.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file.r2_key)
        except Exception:
            pass

        file.delete()
        return Response({"message": "deleted"})


class FileAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        file = get_object_or_404(File, id=file_id, owner=request.user)

        logs = FileAccessLog.objects.filter(file=file).order_by("-timestamp")[:200]

        total_downloads = FileAccessLog.objects.filter(file=file).count()

        now = timezone.now()
        since = now - timedelta(minutes=30)
        qs = FileAccessLog.objects.filter(file=file, timestamp__gte=since)
        agg = (
            qs.annotate(minute=TruncMinute("timestamp"))
            .values("minute")
            .annotate(cnt=Count("id"))
            .order_by("minute")
        )
        counts_by_minute = {item["minute"]: item["cnt"] for item in agg}

        points = []
        for i in range(30, 0, -1):
            minute = (now - timedelta(minutes=i)).replace(second=0, microsecond=0)
            cnt = counts_by_minute.get(minute, 0)
            points.append({"time": minute.isoformat(), "count": cnt})

        ips = list(qs.values_list("ip", flat=True).distinct())

        geo_map = {}
        for ip in ips:
            if not ip:
                continue
            cached = cache.get(f"geo:{ip}")
            if cached is not None:
                geo_map[ip] = cached
                continue
            try:
                url = f"http://ip-api.com/json/{ip}"
                req = urlrequest.Request(url)
                resp = urlrequest.urlopen(req, timeout=3)
                item = json.loads(resp.read().decode())
                geo = {"country": item.get("country"), "city": item.get("city"), "lat": item.get("lat"), "lon": item.get("lon")}
                geo_map[ip] = geo
                cache.set(f"geo:{ip}", geo, timeout=60 * 60 * 24)
            except Exception:
                geo_map[ip] = None

        def parse_ua(ua):
            ua = (ua or "").lower()
            browser = "Unknown"
            if "chrome" in ua and "safari" in ua:
                browser = "Chrome"
            elif "firefox" in ua:
                browser = "Firefox"
            elif "safari" in ua and "chrome" not in ua:
                browser = "Safari"
            elif "edge" in ua:
                browser = "Edge"
            os = "Unknown"
            if "windows" in ua:
                os = "Windows"
            elif "mac" in ua or "darwin" in ua:
                os = "macOS"
            elif "linux" in ua:
                os = "Linux"
            elif "android" in ua:
                os = "Android"
            elif "iphone" in ua or "ipad" in ua:
                os = "iOS"
            return browser, os

        recent = []
        for l in logs[:100]:
            browser, os = parse_ua(l.user_agent)
            recent.append({
                "ip": l.ip,
                "geo": geo_map.get(l.ip),
                "user_agent": l.user_agent,
                "browser": browser,
                "os": os,
                "timestamp": l.timestamp.isoformat(),
            })

        return Response({"total_downloads": total_downloads, "timeseries": points, "recent_accesses": recent})
