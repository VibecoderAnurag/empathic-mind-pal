"""
Music + Ambient Sound Suggestion Engine
Provides curated music suggestions based on emotions
"""

from typing import Dict, List, Optional

MUSIC_SUGGESTIONS = {
    'calm': {
        'category': 'calm',
        'description': 'Soothing music to promote relaxation and peace',
        'suggestions': [
            {
                'title': 'Weightless',
                'artist': 'Marconi Union',
                'type': 'youtube',
                'description': 'Scientifically proven to reduce anxiety'
            },
            {
                'title': 'Meditation Music',
                'artist': 'Various Artists',
                'type': 'youtube',
                'description': 'Peaceful instrumental music for meditation'
            },
            {
                'title': 'Peaceful Piano',
                'artist': 'Spotify Playlist',
                'type': 'spotify',
                'description': 'Gentle piano melodies for calm'
            }
        ]
    },
    'focus': {
        'category': 'focus',
        'description': 'Music to help you concentrate and stay focused',
        'suggestions': [
            {
                'title': 'Focus Music: Concentration',
                'artist': 'Various Artists',
                'type': 'youtube',
                'description': 'Instrumental music for deep focus'
            },
            {
                'title': 'Study Music',
                'artist': 'Various Artists',
                'type': 'youtube',
                'description': 'Background music for studying'
            }
        ]
    },
    'happy': {
        'category': 'happy',
        'description': 'Upbeat and joyful music to enhance positive mood',
        'suggestions': [
            {
                'title': 'Happy',
                'artist': 'Pharrell Williams',
                'type': 'youtube',
                'description': 'Uplifting and energetic'
            },
            {
                'title': 'Can\'t Stop the Feeling',
                'artist': 'Justin Timberlake',
                'type': 'youtube',
                'description': 'Feel-good pop music'
            },
            {
                'title': 'Walking on Sunshine',
                'artist': 'Katrina and the Waves',
                'type': 'youtube',
                'description': 'Classic upbeat song'
            }
        ]
    },
    'comfort': {
        'category': 'comfort',
        'description': 'Gentle, comforting music for emotional support',
        'suggestions': [
            {
                'title': 'River Flows in You',
                'artist': 'Yiruma',
                'type': 'youtube',
                'description': 'Beautiful, soothing piano'
            },
            {
                'title': 'Someone Like You',
                'artist': 'Adele',
                'type': 'youtube',
                'description': 'Emotional and comforting'
            },
            {
                'title': 'Comforting Instrumental',
                'artist': 'Various Artists',
                'type': 'youtube',
                'description': 'Soft, gentle sounds'
            }
        ]
    },
    'sleep': {
        'category': 'sleep',
        'description': 'Music and sounds to help you fall asleep',
        'suggestions': [
            {
                'title': 'Rain Sounds for Sleep',
                'artist': 'Nature Sounds',
                'type': 'youtube',
                'description': 'Gentle rain for deep sleep'
            },
            {
                'title': 'Calm Meditation Music',
                'artist': 'Various Artists',
                'type': 'youtube',
                'description': 'Peaceful music for sleep'
            },
            {
                'title': 'Ocean Waves',
                'artist': 'Nature Sounds',
                'type': 'youtube',
                'description': 'Soothing ocean sounds'
            }
        ]
    },
    'ambient': {
        'category': 'ambient',
        'description': 'Ambient sounds for background and relaxation',
        'suggestions': [
            {
                'title': 'Ambient Study Music',
                'artist': 'Various Artists',
                'type': 'youtube',
                'description': 'Peaceful background music'
            },
            {
                'title': 'Peaceful Background Sounds',
                'artist': 'Various Artists',
                'type': 'youtube',
                'description': 'Calm ambient atmosphere'
            },
            {
                'title': 'Nature Sounds: Forest',
                'artist': 'Nature Sounds',
                'type': 'youtube',
                'description': 'Gentle forest ambience'
            }
        ]
    }
}

# Emotion to music category mapping
EMOTION_TO_MUSIC = {
    'happy': 'happy',
    'sad': 'comfort',
    'angry': 'calm',
    'anxious': 'calm',
    'fear': 'calm',
    'stressed': 'ambient',
    'low_energy': 'happy',
    'neutral': 'ambient',
    
    # GoEmotions mapping
    'joy': 'happy',
    'amusement': 'happy',
    'excitement': 'happy',
    'sadness': 'comfort',
    'grief': 'comfort',
    'anger': 'calm',
    'fear': 'calm',
    'nervousness': 'calm',
}

def get_music_suggestion(emotion: str) -> Dict:
    """
    Get music suggestion based on emotion
    
    Args:
        emotion: Detected emotion
        
    Returns:
        Dictionary with music category, description, and suggestions
    """
    emotion_lower = emotion.lower()
    
    # Map emotion to music category
    category = EMOTION_TO_MUSIC.get(emotion_lower, 'ambient')
    
    # Get music suggestions for this category
    music_data = MUSIC_SUGGESTIONS.get(category, MUSIC_SUGGESTIONS['ambient'])
    
    return music_data

def get_music_by_category(category: str) -> Dict:
    """Get music suggestions by category"""
    return MUSIC_SUGGESTIONS.get(category, MUSIC_SUGGESTIONS['ambient'])

def get_all_music_categories() -> List[str]:
    """Get all available music categories"""
    return list(MUSIC_SUGGESTIONS.keys())

