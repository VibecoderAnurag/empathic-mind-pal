"""
Affirmation Generator
Provides curated affirmations based on emotions
"""

from typing import List, Dict
import random

AFFIRMATIONS_BY_EMOTION = {
    'happy': [
        "I deserve to feel happy and celebrate my joy. My positive energy is a gift to myself and others.",
        "I am grateful for this moment of happiness and I allow myself to fully experience it.",
        "My joy is valid and I can share it with others without guilt.",
        "I am worthy of happiness and I embrace the good moments in my life.",
        "I choose to focus on what brings me joy and let that light shine through."
    ],
    'sad': [
        "It's okay to feel sad. My emotions are valid, and this feeling will pass. I am strong and capable of healing.",
        "I give myself permission to feel my sadness without judgment. I am human, and all emotions are part of my experience.",
        "This sadness is temporary. I have overcome difficult times before, and I will again.",
        "I am not alone in my sadness. It's okay to reach out for support when I need it.",
        "My feelings matter, and I honor them. I will be gentle with myself during this time."
    ],
    'angry': [
        "I can feel my anger without letting it control me. I choose to respond thoughtfully and with compassion.",
        "My anger is a signal that something needs attention. I can address it constructively.",
        "I acknowledge my anger and give myself space to process it in healthy ways.",
        "I have the power to transform my anger into positive action.",
        "It's okay to feel angry. I can express my feelings without harming myself or others."
    ],
    'anxious': [
        "I am safe in this moment. My anxiety is temporary, and I have the tools to manage it. I can handle this.",
        "I breathe through my anxiety, knowing that this feeling will pass. I am stronger than my fears.",
        "I take things one step at a time. I don't have to solve everything right now.",
        "My anxiety does not define me. I am capable of finding calm even in difficult moments.",
        "I trust myself to handle whatever comes my way. I have survived difficult times before."
    ],
    'fear': [
        "I am safe and capable. Fear is a signal, not a sentence. I can move through this with courage and support.",
        "I acknowledge my fear without letting it paralyze me. I can take small steps forward.",
        "Fear is temporary. I have the strength to face what scares me, one moment at a time.",
        "I am braver than I think. My fear does not mean I am weak - it means I am human.",
        "I can feel afraid and still move forward. Courage is not the absence of fear, but action despite it."
    ],
    'stressed': [
        "I can manage stress one moment at a time. I give myself permission to pause and take care of myself.",
        "I don't have to do everything perfectly. I am doing my best, and that is enough.",
        "I can break down overwhelming tasks into smaller, manageable steps.",
        "I prioritize my well-being. Taking care of myself is not selfish - it's necessary.",
        "I release what I cannot control and focus on what I can influence right now."
    ],
    'low_energy': [
        "My energy levels fluctuate, and that's normal. I can take small, gentle steps to support myself.",
        "I honor my body's need for rest. It's okay to slow down and take care of myself.",
        "I am doing enough, even when I feel low on energy. My worth is not measured by productivity.",
        "I can be gentle with myself during low-energy moments. Rest is productive.",
        "I listen to my body and give it what it needs, whether that's rest, movement, or nourishment."
    ],
    'neutral': [
        "I am present in this moment. I honor where I am and trust my journey.",
        "I am exactly where I need to be right now. There's no pressure to feel any particular way.",
        "I accept myself as I am in this moment, without judgment or expectation.",
        "I am open to whatever emotions arise, knowing they are all part of my human experience.",
        "I trust the process of my emotional journey. Every moment is valid and meaningful."
    ]
}

def get_affirmation(emotion: str) -> str:
    """
    Get a random affirmation for the given emotion
    
    Args:
        emotion: Detected emotion
        
    Returns:
        A supportive affirmation string
    """
    emotion_lower = emotion.lower()
    
    # Map GoEmotions to our categories
    emotion_mapping = {
        'joy': 'happy',
        'amusement': 'happy',
        'excitement': 'happy',
        'optimism': 'happy',
        'love': 'happy',
        'gratitude': 'happy',
        'pride': 'happy',
        'sadness': 'sad',
        'grief': 'sad',
        'disappointment': 'sad',
        'remorse': 'sad',
        'anger': 'angry',
        'annoyance': 'angry',
        'disapproval': 'angry',
        'fear': 'fear',
        'nervousness': 'anxious',
        'embarrassment': 'anxious',
        'confusion': 'stressed',
    }
    
    # Normalize emotion
    normalized = emotion_mapping.get(emotion_lower, emotion_lower)
    
    # Get affirmations for this emotion
    affirmations = AFFIRMATIONS_BY_EMOTION.get(normalized, AFFIRMATIONS_BY_EMOTION['neutral'])
    
    return random.choice(affirmations)

def get_affirmations_by_emotion(emotion: str, count: int = 3) -> List[str]:
    """
    Get multiple affirmations for an emotion
    
    Args:
        emotion: Detected emotion
        count: Number of affirmations to return
        
    Returns:
        List of affirmation strings
    """
    emotion_lower = emotion.lower()
    emotion_mapping = {
        'joy': 'happy', 'amusement': 'happy', 'excitement': 'happy',
        'sadness': 'sad', 'grief': 'sad',
        'anger': 'angry', 'annoyance': 'angry',
        'fear': 'fear', 'nervousness': 'anxious',
    }
    normalized = emotion_mapping.get(emotion_lower, emotion_lower)
    affirmations = AFFIRMATIONS_BY_EMOTION.get(normalized, AFFIRMATIONS_BY_EMOTION['neutral'])
    
    # Return random sample
    return random.sample(affirmations, min(count, len(affirmations)))

