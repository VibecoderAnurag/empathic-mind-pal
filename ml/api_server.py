"""
FastAPI server for emotion classification model
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from inference import EmotionClassifier
import os

# Import our new services
try:
    from services.suggestions import get_emotion_suggestions
    from services.sentiment_enhanced import analyze_sentiment_comprehensive
    from services.interventions import get_micro_intervention
    from services.affirmations import get_affirmation
    from services.routines import get_recommended_routine
    from services.music import get_music_suggestion
    from services.safety import check_for_safety, get_safe_response_override
    SERVICES_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import services: {e}")
    print("Some features may not be available. Make sure services directory exists.")
    SERVICES_AVAILABLE = False
    # Create dummy functions to prevent errors
    def get_emotion_suggestions(*args, **kwargs): return {}
    def analyze_sentiment_comprehensive(*args, **kwargs): return {}
    def get_micro_intervention(*args, **kwargs): return {}
    def get_affirmation(*args, **kwargs): return "You are valued and supported."
    def get_recommended_routine(*args, **kwargs): return {}
    def get_music_suggestion(*args, **kwargs): return {}
    def check_for_safety(*args, **kwargs): return {'is_risk': False, 'risk_level': 'low'}
    def get_safe_response_override(*args, **kwargs): return None

app = FastAPI(title="Emotion Classification API")

# Enable CORS for frontend integration
# Allow all localhost origins for development
# Using regex pattern to allow any localhost port
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",  # Allow any localhost port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize classifier
# Use absolute path based on script location
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "checkpoints", "best_model")
classifier = None

try:
    print(f"Attempting to load model from: {model_path}")
    classifier = EmotionClassifier(model_path)
    print("Model loaded successfully!")
    
    # Test the model with a sample input to verify it's working
    try:
        test_result = classifier.predict("I am happy", top_k=1)
        print(f"Model test prediction: {test_result}")
    except Exception as test_error:
        print(f"Warning: Model loaded but test prediction failed: {test_error}")
except Exception as e:
    print(f"ERROR: Could not load model: {e}")
    import traceback
    traceback.print_exc()
    print("API will return mock responses until model is trained.")

class TextInput(BaseModel):
    text: str
    top_k: int = 3

class EmotionPrediction(BaseModel):
    emotion: str
    confidence: float

class PredictionResponse(BaseModel):
    predictions: List[EmotionPrediction]
    top_emotion: str
    top_confidence: float

class EmotionResponseRequest(BaseModel):
    emotion: str
    text_input: Optional[str] = None
    intensity: Optional[float] = None
    mood_history: Optional[List[Dict]] = None

class EmotionResponse(BaseModel):
    supportive_message: str
    actions: List[str]
    tools: List[str]
    intervention: Dict
    routine: Dict
    affirmation: str
    music: Dict
    safe_override_if_any: Optional[Dict] = None
    sentiment_analysis: Optional[Dict] = None

@app.get("/")
async def root():
    return {
        "message": "Emotion Classification API",
        "status": "running",
        "model_loaded": classifier is not None
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": classifier is not None}

@app.options("/health")
async def health_options():
    """Handle OPTIONS preflight request for CORS"""
    return {"status": "ok"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_emotion(input: TextInput):
    """
    Predict emotions from text input
    """
    if not classifier:
        print("WARNING: Classifier not loaded, returning neutral response")
        # Return mock response if model not loaded
        return PredictionResponse(
            predictions=[
                EmotionPrediction(emotion="neutral", confidence=0.5)
            ],
            top_emotion="neutral",
            top_confidence=0.5
        )
    
    try:
        print(f"Predicting emotion for text: '{input.text}'")
        predictions = classifier.predict(input.text, top_k=input.top_k)
        print(f"Predictions: {predictions}")
        
        if not predictions or len(predictions) == 0:
            raise ValueError("No predictions returned from model")
        
        return PredictionResponse(
            predictions=[
                EmotionPrediction(emotion=p["emotion"], confidence=p["confidence"])
                for p in predictions
            ],
            top_emotion=predictions[0]["emotion"],
            top_confidence=predictions[0]["confidence"]
        )
    except Exception as e:
        print(f"ERROR in predict_emotion: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/simple")
async def predict_simple(input: TextInput):
    """
    Simple prediction endpoint returning just the top emotion
    """
    if not classifier:
        print("WARNING: Classifier not loaded, returning neutral response")
        return {
            "emotion": "neutral",
            "confidence": 0.5
        }
    
    try:
        print(f"Predicting emotion (simple) for text: '{input.text}'")
        emotion, confidence = classifier.predict_single(input.text)
        print(f"Result: {emotion} ({confidence:.4f})")
        return {
            "emotion": emotion,
            "confidence": confidence
        }
    except Exception as e:
        print(f"ERROR in predict_simple: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/emotion-response", response_model=EmotionResponse)
async def get_emotion_response(request: EmotionResponseRequest):
    """
    Unified endpoint for comprehensive emotional support response
    
    Input:
        - emotion: Detected emotion (can be GoEmotion or normalized)
        - text_input: Optional user text for sentiment analysis
        - intensity: Optional emotion intensity (0.0-1.0)
        - mood_history: Optional list of previous mood entries
    
    Output:
        Complete JSON with supportive_message, actions, tools, intervention,
        routine, affirmation, music, and safety override if needed
    """
    if not SERVICES_AVAILABLE:
        raise HTTPException(
            status_code=503, 
            detail="Emotional support services are not available. Please check server configuration."
        )
    
    try:
        emotion = request.emotion
        text_input = request.text_input
        intensity = request.intensity
        mood_history = request.mood_history
        
        # Safety check first (if text provided)
        safety_check = None
        safe_override = None
        if text_input:
            safety_check = check_for_safety(text_input)
            safe_override = get_safe_response_override(emotion, safety_check)
        
        # Enhanced sentiment analysis (if text provided)
        sentiment_analysis = None
        if text_input:
            try:
                sentiment_analysis = analyze_sentiment_comprehensive(text_input)
                # Use sentiment intensity if intensity not provided
                if intensity is None:
                    intensity = sentiment_analysis.get('intensity', 0.5)
            except Exception as e:
                print(f"Warning: Sentiment analysis failed: {e}")
        
        # Get emotion-based suggestions
        suggestions = get_emotion_suggestions(
            emotion=emotion,
            text=text_input,
            intensity=intensity,
            mood_history=mood_history
        )
        
        # Get micro-intervention
        intervention_type = suggestions.get('micro_intervention', 'breathing_reset')
        intervention = get_micro_intervention(emotion, intervention_type)
        
        # Get affirmation
        affirmation = get_affirmation(emotion)
        
        # Get recommended routine
        routine = get_recommended_routine(emotion, mood_history)
        
        # Get music suggestion
        music = get_music_suggestion(emotion)
        
        # Build response
        response = {
            "supportive_message": suggestions.get('supportive_message', 'I\'m here to support you.'),
            "actions": suggestions.get('suggested_actions', []),
            "tools": suggestions.get('recommended_tools', []),
            "intervention": intervention,
            "routine": routine,
            "affirmation": affirmation,
            "music": music,
            "safe_override_if_any": safe_override,
            "sentiment_analysis": sentiment_analysis
        }
        
        return EmotionResponse(**response)
        
    except Exception as e:
        print(f"ERROR in get_emotion_response: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
