"""
Emotion-to-Suggestion Response Engine
Provides structured suggestions based on detected emotions
"""

import json
import os
from typing import Dict, List, Optional, Any

# Map GoEmotions to our supported emotion categories
EMOTION_MAPPING = {
    # Happy emotions
    'joy': 'happy',
    'amusement': 'happy',
    'excitement': 'happy',
    'optimism': 'happy',
    'love': 'happy',
    'gratitude': 'happy',
    'pride': 'happy',
    'admiration': 'happy',
    'approval': 'happy',
    'caring': 'happy',
    'relief': 'happy',
    
    # Sad emotions
    'sadness': 'sad',
    'grief': 'sad',
    'disappointment': 'sad',
    'remorse': 'sad',
    
    # Angry emotions
    'anger': 'angry',
    'annoyance': 'angry',
    'disapproval': 'angry',
    'disgust': 'angry',
    
    # Anxious/Fear emotions
    'fear': 'fear',
    'nervousness': 'anxious',
    'embarrassment': 'anxious',
    
    # Stressed
    'confusion': 'stressed',
    
    # Neutral
    'neutral': 'neutral',
    'curiosity': 'neutral',
    'surprise': 'neutral',
    'realization': 'neutral',
    'desire': 'neutral',
}

def load_emotion_map() -> Dict[str, Any]:
    """Load emotion mapping from JSON file"""
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    emotion_map_path = os.path.join(script_dir, "emotion_map.json")
    
    try:
        with open(emotion_map_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: emotion_map.json not found at {emotion_map_path}")
        return {}
    except json.JSONDecodeError as e:
        print(f"Error parsing emotion_map.json: {e}")
        return {}

def normalize_emotion(emotion: str) -> str:
    """
    Normalize emotion from GoEmotions (28 emotions) to our 8 categories
    """
    emotion_lower = emotion.lower()
    
    # Direct match
    if emotion_lower in ['happy', 'sad', 'angry', 'anxious', 'fear', 'stressed', 'low_energy', 'neutral']:
        return emotion_lower
    
    # Map from GoEmotions
    return EMOTION_MAPPING.get(emotion_lower, 'neutral')

def get_emotion_suggestions(
    emotion: str,
    text: Optional[str] = None,
    intensity: Optional[float] = None,
    mood_history: Optional[List[Dict]] = None
) -> Dict[str, Any]:
    """
    Get comprehensive suggestions based on emotion
    
    Args:
        emotion: Detected emotion (can be GoEmotion or normalized)
        text: Optional user text input
        intensity: Optional emotion intensity (0.0-1.0)
        mood_history: Optional list of previous mood entries
        
    Returns:
        Dictionary with supportive_message, suggested_actions, recommended_tools,
        micro_intervention, music_suggestion, personalized_routine, affirmation
    """
    emotion_map = load_emotion_map()
    
    # Normalize emotion to our categories
    normalized_emotion = normalize_emotion(emotion)
    
    # Get base suggestions from emotion map
    base_suggestions = emotion_map.get(normalized_emotion, emotion_map.get('neutral', {}))
    
    # If intensity is high, we might want to emphasize certain tools
    if intensity and intensity > 0.7:
        # For high intensity negative emotions, prioritize immediate interventions
        if normalized_emotion in ['angry', 'anxious', 'fear', 'stressed']:
            if 'breathing_exercise' not in base_suggestions.get('recommended_tools', []):
                base_suggestions.setdefault('recommended_tools', []).insert(0, 'breathing_exercise')
    
    # If mood history shows patterns, we could adjust routine suggestions
    if mood_history:
        recent_negative = sum(1 for entry in mood_history[-7:] 
                            if entry.get('emotion') in ['sad', 'angry', 'anxious', 'fear', 'stressed'])
        if recent_negative >= 5:
            # If many recent negative emotions, suggest stress relief routine
            base_suggestions['personalized_routine'] = 'stress_relief'
    
    return base_suggestions

