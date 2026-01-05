"""
Micro-Interventions Engine
Provides quick, actionable interventions for emotional support
"""

from typing import Dict, List, Optional

INTERVENTIONS = {
    'breathing_reset': {
        'name': '10-Second Breathing Reset',
        'description': 'A quick breathing exercise to reset your nervous system',
        'duration': 10,
        'steps': [
            'Take a deep breath in through your nose (count to 4)',
            'Hold your breath gently (count to 2)',
            'Exhale slowly through your mouth (count to 4)',
            'Repeat 2-3 times'
        ],
        'icon': '🌬️',
        'category': 'breathing',
        'target_route': '/breathing?pattern=box&mode=quick'
    },
    'grounding_54321': {
        'name': '5-4-3-2-1 Grounding Technique',
        'description': 'Ground yourself in the present moment using your senses',
        'duration': 60,
        'steps': [
            'Name 5 things you can SEE around you',
            'Name 4 things you can TOUCH or feel',
            'Name 3 things you can HEAR',
            'Name 2 things you can SMELL',
            'Name 1 thing you can TASTE or one thing you\'re grateful for'
        ],
        'icon': '🌍',
        'category': 'grounding',
        'target_route': '/wellness?focus=grounding'
    },
    'calming_countdown': {
        'name': '15-Second Calming Countdown',
        'description': 'A quick countdown to help you pause and reset',
        'duration': 15,
        'steps': [
            'Close your eyes or soften your gaze',
            'Count down slowly from 15 to 1',
            'With each number, take a gentle breath',
            'When you reach 1, take one more deep breath and open your eyes'
        ],
        'icon': '⏱️',
        'category': 'mindfulness',
        'target_route': '/wellness?focus=calm'
    },
    'shoulder_relaxation': {
        'name': 'Shoulder Relaxation',
        'description': 'Quick tension release for your shoulders and neck',
        'duration': 30,
        'steps': [
            'Sit or stand comfortably',
            'Raise your shoulders up toward your ears',
            'Hold for 3 seconds',
            'Release and let them drop naturally',
            'Repeat 3-5 times'
        ],
        'icon': '💆',
        'category': 'body',
        'target_route': '/wellness?focus=movement'
    },
    'quick_gratitude': {
        'name': 'Quick Gratitude Reflection',
        'description': 'A brief moment to acknowledge something you\'re grateful for',
        'duration': 30,
        'steps': [
            'Take a moment to think of one thing you\'re grateful for today',
            'It can be big or small - a person, an experience, or even a moment',
            'Hold that feeling of gratitude for a few seconds',
            'Notice how it feels in your body'
        ],
        'icon': '🙏',
        'category': 'reflection',
        'target_route': '/gratitude'
    },
    'positive_memory_recall': {
        'name': 'Positive Memory Recall',
        'description': 'Recall a positive memory to shift your emotional state',
        'duration': 60,
        'steps': [
            'Think of a specific positive memory - a time you felt happy, proud, or at peace',
            'Recall as many details as you can: sights, sounds, feelings',
            'Notice the emotions that come with this memory',
            'Take a moment to really feel those positive emotions',
            'Know that you can access this feeling again'
        ],
        'icon': '💭',
        'category': 'reflection',
        'target_route': '/memory'
    },
    'gratitude_reflection': {
        'name': 'Gratitude Reflection',
        'description': 'Reflect on things you\'re grateful for',
        'duration': 60,
        'steps': [
            'Think of 3 things you\'re grateful for right now',
            'They can be simple: a warm bed, a friend, a good meal',
            'Take a moment to really feel the gratitude for each',
            'Notice how gratitude feels in your body'
        ],
        'icon': '🙏',
        'category': 'reflection',
        'target_route': '/gratitude'
    }
}

def get_micro_intervention(emotion: str, intervention_type: Optional[str] = None) -> Dict:
    """
    Get a micro-intervention based on emotion
    
    Args:
        emotion: Detected emotion
        intervention_type: Optional specific intervention type to retrieve
        
    Returns:
        Dictionary with intervention details
    """
    if intervention_type and intervention_type in INTERVENTIONS:
        return INTERVENTIONS[intervention_type]
    
    # Map emotions to recommended interventions
    emotion_to_intervention = {
        'angry': 'breathing_reset',
        'anxious': 'grounding_54321',
        'fear': 'breathing_reset',
        'stressed': 'shoulder_relaxation',
        'sad': 'positive_memory_recall',
        'low_energy': 'quick_gratitude',
        'happy': 'gratitude_reflection',
        'neutral': 'gratitude_reflection',
    }
    
    emotion_lower = emotion.lower()
    recommended = emotion_to_intervention.get(emotion_lower, 'breathing_reset')
    
    return INTERVENTIONS.get(recommended, INTERVENTIONS['breathing_reset'])

def get_all_interventions() -> List[Dict]:
    """Get all available interventions"""
    return list(INTERVENTIONS.values())

def get_interventions_by_category(category: str) -> List[Dict]:
    """Get interventions filtered by category"""
    return [intervention for intervention in INTERVENTIONS.values() 
            if intervention.get('category') == category]

