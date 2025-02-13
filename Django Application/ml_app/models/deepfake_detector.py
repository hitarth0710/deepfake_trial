import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
import numpy as np
import cv2
from pathlib import Path

class DeepfakeClassifier(nn.Module):
    def __init__(self):
        super(DeepfakeClassifier, self).__init__()
        # Define the model architecture to match the saved state dict
        self.model = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3),  # First conv layer
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2, padding=1),
            self._make_layer(64, 256, 3),   # Layer 4
            self._make_layer(256, 512, 4),   # Layer 5
            self._make_layer(512, 1024, 6),  # Layer 6
            self._make_layer(1024, 2048, 3), # Layer 7
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
        )
        self.lstm = nn.LSTM(2048, 512, batch_first=True)
        self.linear1 = nn.Linear(512, 2)

    def _make_layer(self, in_channels, out_channels, blocks):
        layers = []
        # First block with downsample
        downsample = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, 1, stride=2),
            nn.BatchNorm2d(out_channels)
        )
        layers.append(self._make_bottleneck(in_channels, out_channels, 2, downsample))
        
        # Remaining blocks
        for _ in range(1, blocks):
            layers.append(self._make_bottleneck(out_channels, out_channels, 1))
        
        return nn.Sequential(*layers)

    def _make_bottleneck(self, in_channels, out_channels, stride=1, downsample=None):
        return nn.Sequential(
            nn.Conv2d(in_channels, out_channels//4, 1, bias=False),
            nn.BatchNorm2d(out_channels//4),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels//4, out_channels//4, 3, stride=stride, padding=1, bias=False),
            nn.BatchNorm2d(out_channels//4),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels//4, out_channels, 1, bias=False),
            nn.BatchNorm2d(out_channels),
            downsample if downsample is not None else nn.Identity(),
            nn.ReLU(inplace=True)
        )

    def forward(self, x):
        # CNN features
        features = self.model(x)
        # Reshape for LSTM
        features = features.unsqueeze(1)  # Add sequence dimension
        # LSTM
        lstm_out, _ = self.lstm(features)
        # Take the last output
        lstm_out = lstm_out[:, -1, :]
        # Final classification
        out = self.linear1(lstm_out)
        return out

class DeepfakeDetector:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {self.device}")
        self.model = self.load_model()
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def load_model(self):
        try:
            model_path = Path(__file__).parent / 'deepfake_detection.pt'
            if not model_path.exists():
                raise FileNotFoundError(f"Model file not found at {model_path}")

            print(f"Loading model from {model_path}")
            
            # Initialize model architecture
            model = DeepfakeClassifier()
            
            # Load state dictionary
            state_dict = torch.load(model_path, map_location=self.device)
            
            # If the state dict was saved with DataParallel, remove the 'module.' prefix
            if isinstance(state_dict, dict):
                if any(k.startswith('module.') for k in state_dict.keys()):
                    state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}
                model.load_state_dict(state_dict)
            else:
                model = state_dict
            
            # Move model to device and set to evaluation mode
            model = model.to(self.device)
            model.eval()
            print("Model loaded successfully")
            return model
            
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise

    def preprocess_frame(self, frame):
        try:
            # Convert BGR to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # Apply transformations
            tensor = self.transform(frame_rgb)
            # Add batch dimension
            return tensor.unsqueeze(0).to(self.device)
        except Exception as e:
            print(f"Error preprocessing frame: {str(e)}")
            raise

    def predict_frame(self, frame):
        try:
            with torch.no_grad():
                tensor = self.preprocess_frame(frame)
                output = self.model(tensor)
                probabilities = torch.softmax(output, dim=1)
                prediction = torch.argmax(probabilities, dim=1).item()
                confidence = probabilities[0][prediction].item() * 100
                return prediction == 1, confidence  # True if fake, False if real
        except Exception as e:
            print(f"Error predicting frame: {str(e)}")
            raise

    def analyze_video(self, frames):
        try:
            predictions = []
            confidences = []

            for i, frame in enumerate(frames):
                print(f"Analyzing frame {i+1}/{len(frames)}")
                is_fake, confidence = self.predict_frame(frame)
                predictions.append(is_fake)
                confidences.append(confidence)

            # Aggregate results
            fake_ratio = sum(predictions) / len(predictions)
            avg_confidence = sum(confidences) / len(confidences)

            # Final decision based on majority voting
            is_fake = fake_ratio > 0.5
            result = {
                'result': 'FAKE' if is_fake else 'REAL',
                'confidence': avg_confidence,
                'frame_predictions': list(zip(predictions, confidences))
            }
            print(f"Analysis complete. Result: {result['result']} with {result['confidence']:.2f}% confidence")
            return result
            
        except Exception as e:
            print(f"Error analyzing video: {str(e)}")
            raise