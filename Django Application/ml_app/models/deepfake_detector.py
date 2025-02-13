import torch
import torch.nn as nn
import torchvision.transforms as transforms
import numpy as np
import cv2
from pathlib import Path

class DeepfakeDetector:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self.load_model()
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def load_model(self):
        model_path = Path(__file__).parent / 'deepfake_detection.pt'
        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")

        model = torch.load(model_path, map_location=self.device)
        model.eval()
        return model

    def preprocess_frame(self, frame):
        # Convert BGR to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        # Apply transformations
        tensor = self.transform(frame_rgb)
        # Add batch dimension
        return tensor.unsqueeze(0).to(self.device)

    def predict_frame(self, frame):
        with torch.no_grad():
            tensor = self.preprocess_frame(frame)
            output = self.model(tensor)
            probabilities = torch.softmax(output, dim=1)
            prediction = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][prediction].item() * 100
            return prediction == 1, confidence  # True if fake, False if real

    def analyze_video(self, frames):
        predictions = []
        confidences = []

        for frame in frames:
            is_fake, confidence = self.predict_frame(frame)
            predictions.append(is_fake)
            confidences.append(confidence)

        # Aggregate results
        fake_ratio = sum(predictions) / len(predictions)
        avg_confidence = sum(confidences) / len(confidences)

        # Final decision based on majority voting
        is_fake = fake_ratio > 0.5
        return {
            'result': 'FAKE' if is_fake else 'REAL',
            'confidence': avg_confidence,
            'frame_predictions': list(zip(predictions, confidences))
        }
