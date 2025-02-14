from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
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

        # Save file temporarily
        path = default_storage.save(f'temp/{video_file.name}', ContentFile(video_file.read()))
        temp_file = os.path.join(default_storage.location, path)

        # For testing, return a mock response
        mock_response = {
            'result': 'FAKE',
            'confidence': 92.5,
            'frames': [],
            'faces_detected': True,
            'total_frames': 100,
            'frames_with_faces': 80
        }

        # Clean up
        default_storage.delete(path)

        return JsonResponse(mock_response)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def analyze_audio(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        audio_file = request.FILES.get('file')
        if not audio_file:
            return JsonResponse({'error': 'No audio file provided'}, status=400)

        # Save file temporarily
        path = default_storage.save(f'temp/{audio_file.name}', ContentFile(audio_file.read()))
        temp_file = os.path.join(default_storage.location, path)

        # For testing, return a mock response
        mock_response = {
            'result': 'FAKE',
            'confidence': 85.5,
            'waveform_data': [0.5, 0.6, 0.8, 0.3, 0.7, 0.4, 0.9, 0.2] * 10
        }

        # Clean up
        default_storage.delete(path)

        return JsonResponse(mock_response)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def check_status(request):
    return JsonResponse({'status': 'ok'})
