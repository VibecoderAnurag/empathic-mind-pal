import { Emotion } from './sentimentAnalysis';

export interface MoodEntry {
  id: string;
  emotion: Emotion;
  message: string;
  timestamp: number;
  confidence: number;
}

const STORAGE_KEY = 'mindease_mood_logs';

export const saveMoodEntry = (emotion: Emotion, message: string, confidence: number): MoodEntry => {
  const entry: MoodEntry = {
    id: Date.now().toString(),
    emotion,
    message,
    timestamp: Date.now(),
    confidence,
  };

  const entries = getMoodEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  
  return entry;
};

export const getMoodEntries = (): MoodEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getRecentMoodEntries = (days: number = 7): MoodEntry[] => {
  const entries = getMoodEntries();
  const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
  return entries.filter(entry => entry.timestamp >= cutoffTime);
};

export const getAverageMood = (entries: MoodEntry[]): string => {
  if (entries.length === 0) return 'No data yet';
  
  const emotionScores: Record<Emotion, number> = {
    happy: 5,
    excited: 4,
    neutral: 3,
    anxious: 2,
    sad: 1,
    angry: 1,
  };

  const total = entries.reduce((sum, entry) => sum + emotionScores[entry.emotion], 0);
  const average = total / entries.length;

  if (average >= 4.5) return 'Very Positive';
  if (average >= 3.5) return 'Positive';
  if (average >= 2.5) return 'Neutral';
  if (average >= 1.5) return 'Somewhat Low';
  return 'Needs Support';
};
