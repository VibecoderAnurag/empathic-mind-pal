// Simple sentiment analysis using keyword-based approach
// Returns emotion type and confidence score

export type Emotion = 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'excited';

interface EmotionScore {
  emotion: Emotion;
  confidence: number;
}

const emotionKeywords = {
  happy: ['happy', 'joy', 'great', 'wonderful', 'amazing', 'fantastic', 'love', 'good', 'excellent', 'perfect', 'blessed', 'grateful'],
  sad: ['sad', 'depressed', 'down', 'upset', 'crying', 'hurt', 'lonely', 'miserable', 'unhappy', 'terrible', 'awful', 'hopeless'],
  angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'hate', 'rage', 'irritated', 'pissed', 'upset'],
  anxious: ['anxious', 'worried', 'stressed', 'nervous', 'scared', 'fear', 'panic', 'overwhelmed', 'tense', 'uneasy'],
  excited: ['excited', 'thrilled', 'pumped', 'energized', 'enthusiastic', 'eager', 'psyched', 'can\'t wait'],
};

export const analyzeSentiment = (text: string): EmotionScore => {
  const lowercaseText = text.toLowerCase();
  const scores: Record<Emotion, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    excited: 0,
    neutral: 0,
  };

  // Count keyword matches
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      const matches = (lowercaseText.match(new RegExp(keyword, 'g')) || []).length;
      scores[emotion as Emotion] += matches;
    });
  });

  // Find dominant emotion
  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore === 0) {
    return { emotion: 'neutral', confidence: 0.6 };
  }

  const dominantEmotion = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as Emotion;
  const confidence = Math.min(0.5 + (maxScore * 0.1), 0.95);

  return { emotion: dominantEmotion, confidence };
};

export const getEmotionColor = (emotion: Emotion): string => {
  const colors: Record<Emotion, string> = {
    happy: 'hsl(45 75% 88%)',
    sad: 'hsl(214 30% 70%)',
    angry: 'hsl(0 60% 70%)',
    anxious: 'hsl(267 35% 75%)',
    excited: 'hsl(180 40% 75%)',
    neutral: 'hsl(210 20% 85%)',
  };
  return colors[emotion];
};

export const getEmotionEmoji = (emotion: Emotion): string => {
  const emojis: Record<Emotion, string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    anxious: '😰',
    excited: '🎉',
    neutral: '😐',
  };
  return emojis[emotion];
};
