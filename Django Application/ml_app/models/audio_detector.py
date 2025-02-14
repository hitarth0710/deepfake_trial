import numpy as np
import librosa
from tensorflow.keras.models import load_model
from pathlib import Path
import logging

class AudioDeepfakeDetector:
    def __init__(self):
        try:
            # Load the audio detection model
            model_path = Path(__file__).parent / 'simple-cnn-ssv.h5'
            if not model_path.exists():
                raise FileNotFoundError(f"Model file not found at {model_path}")
            self.model = load_model(str(model_path), compile=False)
            logging.info("Audio detection model loaded successfully")
        except Exception as e:
            logging.error(f"Error initializing AudioDeepfakeDetector: {str(e)}")
            raise

    def analyze(self, file_path):
        """Analyze an audio file for potential deepfake manipulation."""
        try:
            # Load the audio file
            y, sr = librosa.load(file_path)

            # Extract features (this is a simplified example)
            # In a real implementation, you would use your trained model here
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

            try:
                # Normalize and reshape features
                spectral_centroids = np.mean(spectral_centroids, axis=1)
                spectral_rolloff = np.mean(spectral_rolloff, axis=1)
                mfccs = np.mean(mfccs, axis=1)
                
                # Stack and prepare features
                features = np.stack([spectral_centroids, spectral_rolloff, mfccs])
                features = np.expand_dims(features, axis=0)
                
                # Ensure features are the right shape
                if features.shape != self.model.input_shape:
                    features = np.reshape(features, self.model.input_shape[1:])
                    features = np.expand_dims(features, axis=0)
                
                # Get prediction from model
                prediction = self.model.predict(features, verbose=0)
                confidence = float(prediction[0][0])
                is_fake = confidence > 0.5
                logging.debug(f"Audio analysis complete - Confidence: {confidence}, Is Fake: {is_fake}")
            except Exception as e:
                logging.error(f"Error during feature extraction/prediction: {str(e)}")
                raise

            # Generate waveform data for visualization
            waveform = y[::1000].tolist()  # Downsample for visualization

            return {
                'result': 'FAKE' if is_fake else 'REAL',
                'confidence': float(confidence * 100),
                'waveform_data': waveform,
                'spectral_features': {
                    'centroids': spectral_centroids.mean(axis=1).tolist(),
                    'rolloff': spectral_rolloff.mean(axis=1).tolist(),
                    'mfccs': mfccs.mean(axis=1).tolist(),
                },
                'segments_analyzed': len(y) // sr,  # Length in seconds
            }

        except Exception as e:
            raise Exception(f"Error analyzing audio: {str(e)}")
