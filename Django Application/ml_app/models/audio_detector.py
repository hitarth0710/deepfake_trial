import numpy as np
import tensorflow as tf
from tensorflow import keras
import librosa
import os

class AudioDeepfakeDetector:
    def __init__(self, model_path='ml_app/models/audio_detection.h5'):
        self.model = keras.models.load_model(model_path)
        self.sample_rate = 16000  # Standard sample rate
        self.duration = 5  # Analysis window in seconds
        self.hop_length = 512
        self.n_mels = 128

    def preprocess_audio(self, audio_path):
        # Load and preprocess audio file
        try:
            # Load audio file and resample
            audio, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Ensure consistent length
            target_length = self.sample_rate * self.duration
            if len(audio) > target_length:
                audio = audio[:target_length]
            else:
                audio = np.pad(audio, (0, max(0, target_length - len(audio))))
            
            # Extract mel spectrogram
            mel_spec = librosa.feature.melspectrogram(
                y=audio,
                sr=self.sample_rate,
                n_mels=self.n_mels,
                hop_length=self.hop_length
            )
            
            # Convert to log scale
            mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
            
            # Normalize
            mel_spec_norm = (mel_spec_db - mel_spec_db.min()) / (mel_spec_db.max() - mel_spec_db.min())
            
            # Reshape for model input
            mel_spec_norm = np.expand_dims(mel_spec_norm, axis=-1)
            mel_spec_norm = np.expand_dims(mel_spec_norm, axis=0)
            
            return mel_spec_norm, audio
            
        except Exception as e:
            print(f"Error preprocessing audio: {str(e)}")
            raise

    def analyze(self, audio_path):
        try:
            # Preprocess audio
            mel_spec, audio = self.preprocess_audio(audio_path)
            
            # Get model prediction
            prediction = self.model.predict(mel_spec)[0][0]
            
            # Calculate confidence
            confidence = float(prediction * 100)
            
            # Generate waveform data for visualization
            waveform = librosa.feature.rms(
                y=audio,
                frame_length=self.hop_length,
                hop_length=self.hop_length
            )[0]
            
            # Normalize waveform data
            waveform = (waveform - waveform.min()) / (waveform.max() - waveform.min())
            
            # Extract additional features
            spectral_features = {
                'spectral_centroid': float(np.mean(librosa.feature.spectral_centroid(y=audio, sr=self.sample_rate))),
                'spectral_bandwidth': float(np.mean(librosa.feature.spectral_bandwidth(y=audio, sr=self.sample_rate))),
                'spectral_rolloff': float(np.mean(librosa.feature.spectral_rolloff(y=audio, sr=self.sample_rate)))
            }
            
            return {
                'result': 'FAKE' if prediction > 0.5 else 'REAL',
                'confidence': confidence,
                'waveform_data': waveform.tolist(),
                'spectral_features': spectral_features,
                'segments_analyzed': len(waveform)
            }
            
        except Exception as e:
            print(f"Error analyzing audio: {str(e)}")
            raise

    def __call__(self, audio_path):
        return self.analyze(audio_path)