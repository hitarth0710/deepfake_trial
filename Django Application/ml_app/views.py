import os
import cv2
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings
from .models.detector2 import DeepfakeDetector

# Initialize the detector
detector = DeepfakeDetector()

@csrf_exempt
def analyze_video(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        video_file = request.FILES.get('file')
        if not video_file:
            return JsonResponse({'error': 'No video file provided'}, status=400)

        # Create temp directory if it doesn't exist
        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
        os.makedirs(temp_dir, exist_ok=True)

        # Save the uploaded file temporarily
        temp_path = os.path.join(temp_dir, video_file.name)
        with open(temp_path, 'wb+') as destination:
            for chunk in video_file.chunks():
                destination.write(chunk)

        # Process the video
        cap = cv2.VideoCapture(temp_path)
        frames = []
        frame_count = 0

        # Get total frames for progress calculation
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)
            frame_count += 1

        cap.release()

        # Analyze the video
        result = detector.analyze_video(frames)

        # Clean up
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # Format response to match frontend expectations
        response_data = {
            'result': result['result'],
            'confidence': result['confidence'],
            'frame_predictions': result['frame_predictions'],
            'faces_detected': result['faces_detected'],
            'total_frames': result['total_frames'],
            'frames_with_faces': result['frames_with_faces'],
            'filename': video_file.name,
            'video_url': None  # We don't store the video
        }

        return JsonResponse(response_data)

    except Exception as e:
        # Clean up on error
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        return JsonResponse({'error': str(e)}, status=500)
