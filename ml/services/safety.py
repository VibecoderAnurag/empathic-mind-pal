"""
Safety-Check System
Scans user text for high-risk phrases and provides appropriate support
"""

from typing import Dict, List, Tuple, Optional
import re

# High-risk phrases that may indicate crisis situations
HIGH_RISK_PHRASES = [
    # Self-harm indicators
    r'\b(kill\s+myself|end\s+it\s+all|suicide|not\s+worth\s+living|want\s+to\s+die)\b',
    r'\b(hurt\s+myself|cut\s+myself|self\s+harm|harm\s+myself)\b',
    r'\b(no\s+point|nothing\s+left|no\s+reason\s+to\s+live|better\s+off\s+dead)\b',
    
    # Crisis indicators
    r'\b(can\'t\s+go\s+on|can\'t\s+take\s+it\s+anymore|giving\s+up|hopeless)\b',
    r'\b(no\s+way\s+out|trapped|stuck\s+forever|never\s+get\s+better)\b',
    
    # Severe distress
    r'\b(completely\s+alone|nobody\s+cares|everyone\s+hates\s+me|worthless)\b',
    r'\b(pain\s+too\s+much|can\'t\s+handle\s+it|overwhelming\s+pain)\b',
]

# Medium-risk phrases (concerning but not immediate crisis)
MEDIUM_RISK_PHRASES = [
    r'\b(very\s+depressed|deeply\s+sad|extremely\s+anxious|panic)\b',
    r'\b(thoughts\s+of\s+death|thinking\s+about\s+ending|considering)\b',
    r'\b(no\s+one\s+understands|completely\s+isolated|cut\s+off)\b',
]

# Crisis hotline information
CRISIS_HOTLINES = {
    'US': {
        'name': '988 Suicide & Crisis Lifeline',
        'phone': '988',
        'text': 'Text HOME to 741741',
        'website': 'https://988lifeline.org'
    },
    'International': {
        'name': 'International Association for Suicide Prevention',
        'website': 'https://www.iasp.info/resources/Crisis_Centres/',
        'note': 'Find local crisis centers in your country'
    }
}

def check_for_safety(text: str) -> Dict[str, any]:
    """
    Check text for high-risk phrases indicating crisis or self-harm
    
    Args:
        text: User input text to analyze
        
    Returns:
        Dictionary with:
        - is_risk: Boolean indicating if risk detected
        - risk_level: 'high', 'medium', or 'low'
        - safe_message: Appropriate supportive message
        - recommendations: List of recommendations
        - hotline_info: Crisis hotline information if risk detected
    """
    text_lower = text.lower()
    
    # Check for high-risk phrases
    high_risk_detected = False
    for pattern in HIGH_RISK_PHRASES:
        if re.search(pattern, text_lower, re.IGNORECASE):
            high_risk_detected = True
            break
    
    # Check for medium-risk phrases
    medium_risk_detected = False
    if not high_risk_detected:
        for pattern in MEDIUM_RISK_PHRASES:
            if re.search(pattern, text_lower, re.IGNORECASE):
                medium_risk_detected = True
                break
    
    # Determine risk level
    if high_risk_detected:
        risk_level = 'high'
        safe_message = (
            "I'm concerned about what you've shared. Your life has value, and there are people who want to help. "
            "Please reach out to a crisis hotline or a trusted person in your life right away. "
            "You don't have to face this alone."
        )
        recommendations = [
            "Contact a crisis hotline immediately (see information below)",
            "Reach out to a trusted friend, family member, or mental health professional",
            "Go to your nearest emergency room if you're in immediate danger",
            "Remember: These feelings are temporary, even when they don't feel that way"
        ]
        hotline_info = CRISIS_HOTLINES
    elif medium_risk_detected:
        risk_level = 'medium'
        safe_message = (
            "I hear that you're going through a really difficult time. Your feelings are valid, and it's important "
            "that you have support. Consider reaching out to a mental health professional or someone you trust."
        )
        recommendations = [
            "Consider speaking with a mental health professional",
            "Reach out to a trusted friend or family member",
            "Use the crisis resources available if you need immediate support",
            "Remember that you don't have to handle everything alone"
        ]
        hotline_info = CRISIS_HOTLINES
    else:
        risk_level = 'low'
        safe_message = None
        recommendations = []
        hotline_info = None
    
    return {
        'is_risk': high_risk_detected or medium_risk_detected,
        'risk_level': risk_level,
        'safe_message': safe_message,
        'recommendations': recommendations,
        'hotline_info': hotline_info
    }

def get_safe_response_override(emotion: str, safety_check: Dict) -> Optional[Dict]:
    """
    Get a safe response override if safety concerns are detected
    
    Args:
        emotion: Detected emotion
        safety_check: Result from check_for_safety()
        
    Returns:
        Optional dictionary with override response, or None if no override needed
    """
    if not safety_check.get('is_risk'):
        return None
    
    return {
        'override': True,
        'message': safety_check.get('safe_message'),
        'recommendations': safety_check.get('recommendations', []),
        'hotline_info': safety_check.get('hotline_info'),
        'priority': 'safety'
    }

