import os
import cv2
import base64
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import logging
from .models.deepfake_detector import DeepfakeDetector

# Initialize the detector
detector = DeepfakeDetector()

logger = logging.getLogger(__name__)

def extract_frames_and_analyze(video_path):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frames = []
    face_frames = []
    analysis_frames = []
    
    # Load face detection model
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Extract 100 frames for analysis and 8 frames for display
    analysis_indices = np.linspace(0, total_frames - 1, 100, dtype=int)
    display_indices = np.linspace(0, total_frames - 1, 8, dtype=int)
    
    # First pass: collect frames for analysis
    for frame_idx in analysis_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            break
        analysis_frames.append(frame)
    
    # Run deepfake detection
    analysis_result = detector.analyze_video(analysis_frames)
    
    # Second pass: collect frames for display
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    for frame_idx in display_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            break
            
        # Convert frame to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Detect faces
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        # Get face crop if face detected
        if len(faces) > 0:
            x, y, w, h = faces[0]
            # Add padding around face
            padding = int(w * 0.3)
            x = max(0, x - padding)
            y = max(0, y - padding)
            w = min(frame.shape[1] - x, w + 2 * padding)
            h = min(frame.shape[0] - y, h + 2 * padding)
            
            face_crop = frame_rgb[y:y+h, x:x+w]
            face_crop = cv2.resize(face_crop, (100, 100))
            
            # Convert face crop to base64
            _, buffer = cv2.imencode('.jpg', cv2.cvtColor(face_crop, cv2.COLOR_RGB2BGR))
            face_b64 = base64.b64encode(buffer).decode('utf-8')
            face_frames.append(f'data:image/jpeg;base64,{face_b64}')
        
        # Resize and convert frame to base64
        frame_resized = cv2.resize(frame_rgb, (320, 180))  # 16:9 aspect ratio
        _, buffer = cv2.imencode('.jpg', cv2.cvtColor(frame_resized, cv2.COLOR_RGB2BGR))
        frame_b64 = base64.b64encode(buffer).decode('utf-8')
        frames.append(f'data:image/jpeg;base64,{frame_b64}')
    
    cap.release()
    return frames, face_frames, analysis_result

@csrf_exempt
def analyze_video(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file uploaded'}, status=400)

        video_file = request.FILES['file']
        
        # Validate file type
        if not video_file.content_type.startswith('video/'):
            return JsonResponse({'error': 'Invalid file type. Please upload a video.'}, status=400)

        # Create temp directory if it doesn't exist
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'temp'), exist_ok=True)

        # Save the uploaded file
        file_path = default_storage.save(
            f'temp/{video_file.name}',
            ContentFile(video_file.read())
        )
        
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        
        # Extract frames, face crops and run analysis
        frames, face_frames, analysis_result = extract_frames_and_analyze(full_path)

        # Get the full URL for the saved file
        file_url = request.build_absolute_uri(settings.MEDIA_URL + file_path)

        # Combine results
        result = {
            'result': analysis_result['result'],
            'confidence': analysis_result['confidence'],
            'video_url': file_url,
            'filename': video_file.name,
            'frames': frames,
            'faceFrames': face_frames
        }

        # Clean up the temporary file
        if os.path.exists(full_path):
            os.remove(full_path)

        return JsonResponse(result)

    except Exception as e:
        logger.error(f'Error processing video: {str(e)}')
        return JsonResponse(
            {'error': f'Failed to process video: {str(e)}'}, 
            status=500
        )
