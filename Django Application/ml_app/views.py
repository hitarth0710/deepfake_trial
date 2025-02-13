import os
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import torch
from datetime import datetime
from .utils import extract_frames, preprocess_frames, analyze_video_frames

@csrf_exempt
def analyze_video(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        video_file = request.FILES.get('video')
        if not video_file:
            return JsonResponse({'error': 'No video file provided'}, status=400)

        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploaded_videos')
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        file_extension = os.path.splitext(video_file.name)[1]
        unique_filename = f"{timestamp}_{uuid.uuid4().hex[:8]}{file_extension}"

        # Save the video file
        fs = FileSystemStorage(location=upload_dir)
        filename = fs.save(unique_filename, video_file)
        video_path = fs.path(filename)
        video_url = f"{settings.MEDIA_URL}uploaded_videos/{filename}"

        try:
            # Load model
            model_path = os.path.join(settings.BASE_DIR, 'models', 'model_84_acc_10_frames_final_data.pt')
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")
            
            model = torch.load(model_path, map_location=torch.device('cpu'))
            
            # Process video
            sequence_length = 20  # Number of frames to analyze
            frames = extract_frames(video_path, sequence_length)
            if not frames:
                raise ValueError("No frames could be extracted from the video")
                
            # Preprocess frames
            processed_frames = preprocess_frames(frames)
            
            # Run analysis
            result, confidence = analyze_video_frames(model, processed_frames)

            response_data = {
                'result': result,
                'confidence': confidence,
                'video_url': video_url,
                'filename': filename
            }
            return JsonResponse(response_data)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)