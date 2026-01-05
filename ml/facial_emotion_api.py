"""
FastAPI server for facial emotion classification using EfficientNet-B1 model
Updated to work with the new high-accuracy model (224x224 RGB)
"""

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import io
import numpy as np
import os
from pathlib import Path

# Try to import timm, install if missing
try:
    import timm
except ImportError:
    print("[INFO] Installing timm library...")
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "timm"])
    import timm

app = FastAPI(title="Facial Emotion Classification API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Emotion labels (7 classes)
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']

# Initialize model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "checkpoints", "facial_emotion_model_torch.pth")
model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def build_model(num_classes: int = 7):
    """Build EfficientNet-B1 model (matches training)"""
    try:
        model = timm.create_model(
            "efficientnet_b1",
            pretrained=False,  # We'll load our trained weights
            num_classes=num_classes,
            in_chans=3,  # RGB input
        )
        return model
    except Exception as e:
        print(f"[ERROR] Failed to create model: {e}")
        # Fallback to efficientnet_b0 if b1 fails
        return timm.create_model(
            "efficientnet_b0",
            pretrained=False,
            num_classes=num_classes,
            in_chans=3,
        )

try:
    print(f"Loading facial emotion model from: {model_path}")
    model = build_model(num_classes=len(EMOTIONS))
    if os.path.exists(model_path):
        # Load state dict
        state_dict = torch.load(model_path, map_location=device, weights_only=False)
        # Handle both full checkpoint and state_dict only
        if isinstance(state_dict, dict) and 'model_state_dict' in state_dict:
            model.load_state_dict(state_dict['model_state_dict'])
        else:
            model.load_state_dict(state_dict)
        model.to(device)
        model.eval()
        print("Facial emotion model (EfficientNet-B1) loaded successfully!")
        print(f"Using device: {device}")
        print(f"Model accuracy: 67.87% (test set)")
    else:
        print(f"WARNING: Model file not found at {model_path}")
        print("API will return mock responses until model is trained.")
        model = None
except Exception as e:
    print(f"ERROR: Could not load model: {e}")
    import traceback
    traceback.print_exc()
    model = None

# Image preprocessing (matches training: 224x224 RGB)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

class EmotionPrediction(BaseModel):
    emotion: str
    confidence: float

class PredictionResponse(BaseModel):
    predictions: List[EmotionPrediction]
    top_emotion: str
    top_confidence: float

@app.get("/")
async def root():
    return {
        "message": "Facial Emotion Classification API (EfficientNet-B1)",
        "status": "running",
        "model_loaded": model is not None,
        "model_type": "EfficientNet-B1",
        "input_size": "224x224 RGB",
        "accuracy": "67.87%"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "message": "Facial Emotion API is running",
        "model_type": "EfficientNet-B1"
    }

@app.options("/health")
async def health_options():
    """Handle OPTIONS preflight request for CORS"""
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_emotion(file: UploadFile = File(...)):
    """
    Predict emotion from uploaded image file
    """
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read image
        image_data = await file.read()
        if len(image_data) == 0:
            raise ValueError("Empty image data received")
        
        image = Image.open(io.BytesIO(image_data))
        print(f"Image loaded: mode={image.mode}, size={image.size}")
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            if image.mode == 'RGBA':
                # Create white background
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[3] if len(image.split()) > 3 else None)
                image = background
            else:
                image = image.convert('RGB')
        
        # Preprocess (224x224 RGB)
        try:
            image_tensor = transform(image).unsqueeze(0).to(device)
            print(f"Image tensor shape: {image_tensor.shape}")
        except Exception as transform_error:
            print(f"Transform error: {transform_error}")
            raise ValueError(f"Image preprocessing failed: {str(transform_error)}")
        
        # Verify tensor shape [1, 3, 224, 224] for RGB
        expected_shape = (1, 3, 224, 224)
        if image_tensor.shape != expected_shape:
            print(f"Warning: Tensor shape {image_tensor.shape} != expected {expected_shape}")
            # Try to fix if possible
            if image_tensor.shape[1] != 3:
                # If grayscale, convert to RGB
                if image_tensor.shape[1] == 1:
                    image_tensor = image_tensor.repeat(1, 3, 1, 1)
                else:
                    image_tensor = image_tensor[:, :3, :, :]  # Take first 3 channels
        
        # Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            probs = probabilities[0].cpu().numpy()
        
        # Get top predictions
        top_indices = probs.argsort()[-7:][::-1]
        predictions = []
        for idx in top_indices:
            predictions.append(EmotionPrediction(
                emotion=EMOTIONS[idx],
                confidence=float(probs[idx])
            ))
        
        print(f"Prediction successful: {EMOTIONS[top_indices[0]]} ({probs[top_indices[0]]:.4f})")
        return PredictionResponse(
            predictions=predictions,
            top_emotion=EMOTIONS[top_indices[0]],
            top_confidence=float(probs[top_indices[0]])
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR in predict_emotion: {str(e)}")
        print(f"Traceback: {error_details}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/base64")
async def predict_emotion_base64(data: dict):
    """
    Predict emotion from base64 encoded image
    """
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        import base64
        image_data = base64.b64decode(data["image"].split(",")[-1])
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            if image.mode == 'RGBA':
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[3] if len(image.split()) > 3 else None)
                image = background
            else:
                image = image.convert('RGB')
        
        # Preprocess (224x224 RGB)
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Verify tensor shape
        if image_tensor.shape[1] != 3:
            if image_tensor.shape[1] == 1:
                image_tensor = image_tensor.repeat(1, 3, 1, 1)
            else:
                image_tensor = image_tensor[:, :3, :, :]
        
        # Predict
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            probs = probabilities[0].cpu().numpy()
        
        # Get top predictions
        top_indices = probs.argsort()[-7:][::-1]
        predictions = []
        for idx in top_indices:
            predictions.append(EmotionPrediction(
                emotion=EMOTIONS[idx],
                confidence=float(probs[idx])
            ))
        
        return PredictionResponse(
            predictions=predictions,
            top_emotion=EMOTIONS[top_indices[0]],
            top_confidence=float(probs[top_indices[0]])
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR in predict_emotion_base64: {str(e)}")
        print(f"Traceback: {error_details}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
