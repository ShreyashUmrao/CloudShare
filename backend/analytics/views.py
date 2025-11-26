from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from files.models import FileAccessLog, File

class FileAccessLogs(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, file_id):
        
        try:
            limit = int(request.query_params.get("limit", 100))
            offset = int(request.query_params.get("offset", 0))
        except ValueError:
            return Response({"error": "Invalid pagination parameters"}, status=400)

        if not File.objects.filter(id=file_id, owner=request.user).exists():
            return Response({"error": "File not found"}, status=404)

        qs = FileAccessLog.objects.filter(file__id=file_id).values(
            "ip",
            "user_agent",
            "timestamp",
        ).order_by("-timestamp")[offset:offset + limit]
        
        logs = [{"ip": l["ip"], "agent": l["user_agent"], "timestamp": l["timestamp"]} for l in qs]

        file_obj = File.objects.only("file_name").get(id=file_id)

        return Response({
            "file": file_obj.file_name,
            "logs": logs,
            "count": len(logs),
        })
