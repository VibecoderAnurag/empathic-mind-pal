/**
 * All 28 GoEmotions emotion types and utilities
 */

export type GoEmotion = 
  | 'admiration' | 'amusement' | 'anger' | 'annoyance' | 'approval' | 'caring'
  | 'confusion' | 'curiosity' | 'desire' | 'disappointment' | 'disapproval'
  | 'disgust' | 'embarrassment' | 'excitement' | 'fear' | 'gratitude' | 'grief'
  | 'joy' | 'love' | 'nervousness' | 'optimism' | 'pride' | 'realization'
  | 'relief' | 'remorse' | 'sadness' | 'surprise' | 'neutral';

export const ALL_EMOTIONS: GoEmotion[] = [
  'admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring',
  'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval',
  'disgust', 'embarrassment', 'excitement', 'fear', 'gratitude', 'grief',
  'joy', 'love', 'nervousness', 'optimism', 'pride', 'realization',
  'relief', 'remorse', 'sadness', 'surprise', 'neutral'
];

export const getEmotionEmoji = (emotion: string): string => {
  const emojiMap: Record<string, string> = {
    admiration: '😍',
    amusement: '😄',
    anger: '😠',
    annoyance: '😤',
    approval: '👍',
    caring: '💝',
    confusion: '😕',
    curiosity: '🤔',
    desire: '😍',
    disappointment: '😞',
    disapproval: '👎',
    disgust: '🤢',
    embarrassment: '😳',
    excitement: '🎉',
    fear: '😨',
    gratitude: '🙏',
    grief: '😭',
    joy: '😊',
    love: '❤️',
    nervousness: '😰',
    optimism: '😊',
    pride: '🦁',
    realization: '💡',
    relief: '😌',
    remorse: '😔',
    sadness: '😢',
    surprise: '😲',
    neutral: '😐',
  };
  return emojiMap[emotion.toLowerCase()] || '😐';
};

export const getEmotionColor = (emotion: string): string => {
  const colorMap: Record<string, string> = {
    // Positive emotions - warm colors
    admiration: 'hsl(330, 70%, 85%)',
    amusement: 'hsl(45, 85%, 80%)',
    approval: 'hsl(120, 60%, 80%)',
    caring: 'hsl(340, 70%, 85%)',
    excitement: 'hsl(30, 90%, 75%)',
    gratitude: 'hsl(200, 70%, 80%)',
    joy: 'hsl(50, 90%, 75%)',
    love: 'hsl(350, 80%, 85%)',
    optimism: 'hsl(60, 80%, 80%)',
    pride: 'hsl(45, 75%, 75%)',
    relief: 'hsl(180, 60%, 80%)',
    
    // Negative emotions - cool/dark colors
    anger: 'hsl(0, 70%, 70%)',
    annoyance: 'hsl(15, 70%, 75%)',
    disappointment: 'hsl(210, 50%, 75%)',
    disapproval: 'hsl(0, 60%, 70%)',
    disgust: 'hsl(120, 40%, 70%)',
    fear: 'hsl(240, 60%, 75%)',
    grief: 'hsl(210, 60%, 70%)',
    nervousness: 'hsl(270, 50%, 75%)',
    remorse: 'hsl(220, 50%, 75%)',
    sadness: 'hsl(210, 50%, 75%)',
    
    // Neutral/Cognitive emotions
    confusion: 'hsl(280, 40%, 80%)',
    curiosity: 'hsl(200, 50%, 80%)',
    desire: 'hsl(320, 60%, 80%)',
    embarrassment: 'hsl(340, 50%, 80%)',
    realization: 'hsl(60, 70%, 85%)',
    surprise: 'hsl(40, 80%, 80%)',
    neutral: 'hsl(210, 20%, 85%)',
  };
  return colorMap[emotion.toLowerCase()] || 'hsl(210, 20%, 85%)';
};

export const getEmotionCategory = (emotion: GoEmotion): 'positive' | 'negative' | 'neutral' => {
  const positive: GoEmotion[] = [
    'admiration', 'amusement', 'approval', 'caring', 'excitement', 
    'gratitude', 'joy', 'love', 'optimism', 'pride', 'relief'
  ];
  const negative: GoEmotion[] = [
    'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust',
    'fear', 'grief', 'nervousness', 'remorse', 'sadness'
  ];
  
  if (positive.includes(emotion)) return 'positive';
  if (negative.includes(emotion)) return 'negative';
  return 'neutral';
};

/**
 * Map GoEmotions to legacy app emotions (for backward compatibility)
 */
export const mapGoEmotionToAppEmotion = (goEmotion: string): 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'excited' => {
  const emotionMap: Record<string, 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'excited'> = {
    'joy': 'happy',
    'amusement': 'happy',
    'excitement': 'excited',
    'optimism': 'happy',
    'love': 'happy',
    'gratitude': 'happy',
    'pride': 'happy',
    'admiration': 'happy',
    'approval': 'happy',
    'caring': 'happy',
    'relief': 'happy',
    'sadness': 'sad',
    'grief': 'sad',
    'disappointment': 'sad',
    'remorse': 'sad',
    'anger': 'angry',
    'annoyance': 'angry',
    'disapproval': 'angry',
    'disgust': 'angry',
    'fear': 'anxious',
    'nervousness': 'anxious',
    'embarrassment': 'anxious',
    'neutral': 'neutral',
    'curiosity': 'neutral',
    'confusion': 'neutral',
    'surprise': 'neutral',
    'realization': 'neutral',
    'desire': 'neutral',
  };
  
  return emotionMap[goEmotion.toLowerCase()] || 'neutral';
};

