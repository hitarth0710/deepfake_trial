from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import AllowAny
from .serializers import VideoAnalysisSerializer
from django.conf import settings
import os
from .views import process_video  # Import your existing processing function

class VideoAnalysisAPI(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VideoAnalysisSerializer(data=request.data)
        if serializer.is_valid():
            video_file = serializer.validated_data['video']
            sequence_length = serializer.validated_data.get('sequence_length', 20)

            # Save uploaded video
            filename = video_file.name
            filepath = os.path.join(settings.MEDIA_ROOT, 'uploaded_videos', filename)
            with open(filepath, 'wb+') as destination:
                for chunk in video_file.chunks():
                    destination.write(chunk)

            try:
                # Process video using your existing function
                result = process_video(filepath, sequence_length)
                
                return Response({
                    'status': 'success',
                    'result': result['prediction'],
                    'confidence': result.get('confidence', 95),
                    'frames': result.get('frames', [])
                })
            except Exception as e:
                return Response({
                    'status': 'error',
                    'message': str(e)
                }, status=500)
        
        return Response(serializer.errors, status=400)