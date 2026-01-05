"""
Personalized Routine Builder
Generates routines based on mood history patterns and current emotion
"""

from typing import Dict, List, Optional

ROUTINES = {
    'morning_boost': {
        'key': 'morning_boost',
        'name': 'Morning Boost Routine',
        'description': 'Start your day with energy and positivity',
        'duration': '15-20 minutes',
        'steps': [
            'Wake up and take 3 deep breaths',
            'Stretch your body gently for 2-3 minutes',
            'Write down 3 things you\'re grateful for',
            'Listen to uplifting music while getting ready',
            'Set one positive intention for the day'
        ],
        'icon': '🌅',
        'best_for': ['low_energy', 'neutral', 'happy']
    },
    'stress_relief': {
        'key': 'stress_relief',
        'name': 'Stress Relief Routine',
        'description': 'Comprehensive routine to reduce stress and find calm',
        'duration': '20-30 minutes',
        'steps': [
            'Find a quiet space and sit comfortably',
            'Practice 5 minutes of deep breathing (4-7-8 technique)',
            'Do a quick body scan, releasing tension from head to toe',
            'Listen to calming music or nature sounds',
            'Write down what\'s causing stress and one small action you can take',
            'End with a moment of self-compassion'
        ],
        'icon': '🌊',
        'best_for': ['stressed', 'anxious', 'sad', 'angry']
    },
    'anxiety_cool_down': {
        'key': 'anxiety_cool_down',
        'name': 'Anxiety Cool-Down Routine',
        'description': 'Step-by-step approach to calm anxiety',
        'duration': '15-20 minutes',
        'steps': [
            'Acknowledge your anxiety without judgment',
            'Practice the 5-4-3-2-1 grounding technique',
            'Do 5 minutes of box breathing (4-4-4-4)',
            'Progressive muscle relaxation: tense and release each muscle group',
            'Listen to calming ambient sounds',
            'Remind yourself: "This feeling will pass. I am safe."'
        ],
        'icon': '🌿',
        'best_for': ['anxious', 'fear', 'nervousness']
    },
    'sleep_wind_down': {
        'key': 'sleep_wind_down',
        'name': 'Sleep Wind-Down Routine',
        'description': 'Prepare your mind and body for restful sleep',
        'duration': '30-45 minutes',
        'steps': [
            'Dim the lights and reduce screen time',
            'Practice gentle stretching or yoga',
            'Do 10 minutes of 4-7-8 breathing',
            'Listen to sleep-inducing music or nature sounds',
            'Write down any worries in a journal (to release them)',
            'Read something calming or practice gratitude',
            'Create a peaceful sleep environment'
        ],
        'icon': '🌙',
        'best_for': ['stressed', 'anxious', 'low_energy']
    },
    'confidence_boost': {
        'key': 'confidence_boost',
        'name': 'Confidence Boost Routine',
        'description': 'Build self-confidence and positive self-talk',
        'duration': '15 minutes',
        'steps': [
            'Stand in a power pose for 2 minutes',
            'Write down 3 things you\'ve accomplished recently',
            'Recite positive affirmations about your strengths',
            'Visualize a time you felt confident and capable',
            'Listen to empowering music',
            'Set one small, achievable goal for today'
        ],
        'icon': '💪',
        'best_for': ['sad', 'low_energy', 'neutral']
    },
    'general_wellness': {
        'key': 'general_wellness',
        'name': 'General Wellness Routine',
        'description': 'Maintain overall emotional well-being',
        'duration': '15-20 minutes',
        'steps': [
            'Check in with yourself: How am I feeling right now?',
            'Practice 5 minutes of mindful breathing',
            'Do a brief gratitude reflection',
            'Engage in a gentle activity you enjoy',
            'End with a moment of self-compassion'
        ],
        'icon': '💙',
        'best_for': ['neutral', 'happy']
    }
}

def get_recommended_routine(
    emotion: str,
    mood_history: Optional[List[Dict]] = None
) -> Dict:
    """
    Get a recommended routine based on emotion and mood history
    
    Args:
        emotion: Current detected emotion
        mood_history: Optional list of previous mood entries
        
    Returns:
        Dictionary with routine details
    """
    emotion_lower = emotion.lower()
    
    # Map emotions to routines
    emotion_to_routine = {
        'happy': 'morning_boost',
        'sad': 'stress_relief',
        'angry': 'stress_relief',
        'anxious': 'anxiety_cool_down',
        'fear': 'anxiety_cool_down',
        'stressed': 'stress_relief',
        'low_energy': 'morning_boost',
        'neutral': 'general_wellness',
    }
    
    # Analyze mood history for patterns
    if mood_history:
        # Count recent negative emotions
        recent_entries = mood_history[-7:] if len(mood_history) > 7 else mood_history
        negative_count = sum(1 for entry in recent_entries 
                           if entry.get('emotion') in ['sad', 'angry', 'anxious', 'fear', 'stressed'])
        
        # If many negative emotions, prioritize stress relief
        if negative_count >= 5:
            return ROUTINES.get('stress_relief', ROUTINES['general_wellness'])
        
        # If low energy pattern, suggest morning boost
        low_energy_count = sum(1 for entry in recent_entries 
                              if entry.get('emotion') == 'low_energy')
        if low_energy_count >= 3:
            return ROUTINES.get('morning_boost', ROUTINES['general_wellness'])
    
    # Default to emotion-based routine
    routine_key = emotion_to_routine.get(emotion_lower, 'general_wellness')
    return ROUTINES.get(routine_key, ROUTINES['general_wellness'])

def get_all_routines() -> List[Dict]:
    """Get all available routines"""
    return list(ROUTINES.values())

