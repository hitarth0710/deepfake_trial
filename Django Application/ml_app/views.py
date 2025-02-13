import os
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

logger = logging.getLogger(__name__)

@csrf_exempt
def analyze_video(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

    try:
        # Check if file exists in request
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

        # Get the full URL for the saved file
        file_url = request.build_absolute_uri(settings.MEDIA_URL + file_path)

        # Mock analysis result
        result = {
            'result': 'FAKE',
            'confidence': 85.5,
            'video_url': file_url,
            'filename': video_file.name
        }

        return JsonResponse(result)

    except Exception as e:
        logger.error(f'Error processing video: {str(e)}')
        return JsonResponse(
            {'error': f'Failed to process video: {str(e)}'}, 
            status=500
        )
