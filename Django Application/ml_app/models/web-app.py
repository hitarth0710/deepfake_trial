from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
import os
from .audio_detector import AudioDeepfakeDetector

# Initialize audio detector
audio_detector = AudioDeepfakeDetector()

@csrf_exempt
def analyze_audio(request):
    if request.method == 'POST' and request.FILES.get('file'):
        try:
            # Get the uploaded file
            audio_file = request.FILES['file']
            
            # Save the file temporarily
            fs = FileSystemStorage(location='media/temp')
            filename = fs.save(audio_file.name, audio_file)
            file_path = os.path.join('media/temp', filename)
            
            # Analyze the audio
            results = audio_detector.analyze(file_path)
            
            # Clean up the temporary file
            if os.path.exists(file_path):
                os.remove(file_path)
                
            # Add filename to results
            results['filename'] = filename
            
            return JsonResponse(results)
            
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'error': 'Invalid request'
    }, status=400)
