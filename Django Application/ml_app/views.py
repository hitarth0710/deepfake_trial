from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models.detector2 import DeepfakeDetector
from .models.audio_detector import AudioDeepfakeDetector
import cv2
import numpy as np
import os
import json

@csrf_exempt
def analyze_video(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        video_file = request.FILES.get('file')
        if not video_file:
            return JsonResponse({'error': 'No video file provided'}, status=400)

        # Save the uploaded file temporarily
        file_path = default_storage.save('temp/video.mp4', ContentFile(video_file.read()))
        file_path = os.path.join(default_storage.location, file_path)

        # Initialize the detector
        detector = DeepfakeDetector()

        # Read video frames
        cap = cv2.VideoCapture(file_path)
        frames = []
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)
        cap.release()

        # Analyze video
        result = detector.analyze_video(frames)

        # Clean up
        os.remove(file_path)

        return JsonResponse(result)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)

@csrf_exempt
def analyze_audio(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        audio_file = request.FILES.get('file')
        if not audio_file:
            return JsonResponse({'error': 'No audio file provided'}, status=400)

        # Save the uploaded file temporarily
        file_path = default_storage.save('temp/audio.mp3', ContentFile(audio_file.read()))
        file_path = os.path.join(default_storage.location, file_path)

        # Initialize the detector
        detector = AudioDeepfakeDetector()

        # Analyze audio
        result = detector.analyze(file_path)

        # Clean up
        os.remove(file_path)

        return JsonResponse(result)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    finally:
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
