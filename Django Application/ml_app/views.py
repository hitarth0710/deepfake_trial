import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
import torch
import cv2
import numpy as np

@csrf_exempt
def analyze_video(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        video_file = request.FILES.get('video')
        if not video_file:
            return JsonResponse({'error': 'No video file provided'}, status=400)

        # Create uploads directory if it doesn't exist
        upload_dir = 'uploaded_videos'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Save the video file
        fs = FileSystemStorage(location=upload_dir)
        filename = fs.save(video_file.name, video_file)
        video_path = fs.path(filename)

        try:
            # Get sequence length from request or use default
            sequence_length = int(request.POST.get('sequence_length', 20))

            # Load your model
            model_path = 'models/model_84_acc_10_frames_final_data.pt'
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")

            # Your video processing and model prediction logic here
            # This is a placeholder - replace with your actual model logic
            result = "FAKE"  # or "REAL"
            confidence = 85.5

            response_data = {
                'result': result,
                'confidence': confidence,
                'frames': []  # Add processed frame data if needed
            }

            return JsonResponse(response_data)

        finally:
            # Clean up - remove the uploaded video
            if os.path.exists(video_path):
                os.remove(video_path)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
