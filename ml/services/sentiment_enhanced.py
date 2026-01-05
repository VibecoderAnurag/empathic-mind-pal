"""
Enhanced Sentiment Analysis with VADER and TextBlob
Includes tone detection (frustrated, confused, overwhelmed, calm, low-energy, positive)
"""

try:
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    VADER_AVAILABLE = True
except ImportError:
    VADER_AVAILABLE = False
    print("Warning: vaderSentiment not installed. Install with: pip install vaderSentiment")

try:
    from textblob import TextBlob
    TEXTBLOB_AVAILABLE = True
except ImportError:
    TEXTBLOB_AVAILABLE = False
    print("Warning: textblob not installed. Install with: pip install textblob")

from typing import Dict, List, Tuple

# Tone detection keywords
TONE_KEYWORDS = {
    'frustrated': ['frustrated', 'frustrating', 'annoyed', 'irritated', 'fed up', 'can\'t stand', 'so done'],
    'confused': ['confused', 'confusing', 'unclear', 'don\'t understand', 'not sure', 'puzzled', 'bewildered'],
    'overwhelmed': ['overwhelmed', 'overwhelming', 'too much', 'can\'t handle', 'drowning', 'swamped', 'buried'],
    'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'at ease', 'content'],
    'low-energy': ['tired', 'exhausted', 'drained', 'low energy', 'lethargic', 'worn out', 'fatigued', 'weary'],
    'positive': ['great', 'wonderful', 'amazing', 'excellent', 'fantastic', 'love', 'happy', 'joy', 'grateful'],
}

def analyze_sentiment_vader(text: str) -> Dict[str, float]:
    """
    Analyze sentiment using VADER
    
    Returns:
        Dictionary with 'compound', 'pos', 'neu', 'neg' scores
    """
    if not VADER_AVAILABLE:
        return {'compound': 0.0, 'pos': 0.0, 'neu': 1.0, 'neg': 0.0}
    
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    return scores

def analyze_sentiment_textblob(text: str) -> Tuple[float, float]:
    """
    Analyze sentiment using TextBlob
    
    Returns:
        Tuple of (polarity, subjectivity)
        Polarity: -1.0 (negative) to 1.0 (positive)
        Subjectivity: 0.0 (objective) to 1.0 (subjective)
    """
    if not TEXTBLOB_AVAILABLE:
        return (0.0, 0.5)
    
    blob = TextBlob(text)
    return blob.sentiment.polarity, blob.sentiment.subjectivity

def detect_tone(text: str) -> List[str]:
    """
    Detect tone tags from text
    
    Returns:
        List of detected tones
    """
    text_lower = text.lower()
    detected_tones = []
    
    for tone, keywords in TONE_KEYWORDS.items():
        if any(keyword in text_lower for keyword in keywords):
            detected_tones.append(tone)
    
    return detected_tones

def analyze_sentiment_comprehensive(text: str) -> Dict[str, any]:
    """
    Comprehensive sentiment analysis combining VADER, TextBlob, and tone detection
    
    Returns:
        Dictionary with:
        - vader_scores: VADER sentiment scores
        - textblob_polarity: TextBlob polarity (-1 to 1)
        - textblob_subjectivity: TextBlob subjectivity (0 to 1)
        - tones: List of detected tones
        - overall_sentiment: 'positive', 'negative', or 'neutral'
    """
    vader_scores = analyze_sentiment_vader(text)
    polarity, subjectivity = analyze_sentiment_textblob(text)
    tones = detect_tone(text)
    
    # Determine overall sentiment
    compound = vader_scores.get('compound', 0.0)
    if compound >= 0.05:
        overall = 'positive'
    elif compound <= -0.05:
        overall = 'negative'
    else:
        overall = 'neutral'
    
    return {
        'vader_scores': vader_scores,
        'textblob_polarity': polarity,
        'textblob_subjectivity': subjectivity,
        'tones': tones,
        'overall_sentiment': overall,
        'intensity': abs(compound)  # Intensity of emotion
    }

