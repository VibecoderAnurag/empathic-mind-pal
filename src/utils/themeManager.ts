/**
 * Emotion-Based Adaptive Theme Manager
 * Uses psychology-backed color theory to improve user's emotional state
 */

export type EmotionTheme = 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'default';

export interface ThemePreset {
  name: string;
  description: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  gradients: {
    calm: string;
    card: string;
  };
  shadow: string;
}

/**
 * Psychology-based theme presets
 * Designed to improve emotional state through color therapy
 */
export const themePresets: Record<EmotionTheme, ThemePreset> = {
  happy: {
    name: 'Joyful Uplift',
    description: 'Amplifies joy and energy with soft, positive colors',
    colors: {
      background: '45 30% 98%', // Soft yellow-white
      foreground: '45 25% 20%',
      card: '45 25% 99%',
      cardForeground: '45 25% 20%',
      primary: '200 80% 70%', // Aqua blue
      primaryForeground: '45 30% 15%',
      secondary: '320 60% 85%', // Pastel pink
      secondaryForeground: '45 30% 15%',
      muted: '45 20% 96%',
      mutedForeground: '45 20% 45%',
      accent: '200 70% 75%', // Sky blue
      accentForeground: '45 30% 15%',
      border: '45 20% 92%',
      input: '45 20% 92%',
      ring: '200 80% 70%',
    },
    gradients: {
      calm: 'linear-gradient(135deg, hsl(45 30% 98%), hsl(200 60% 95%))',
      card: 'linear-gradient(145deg, hsl(45 25% 99%), hsl(200 50% 97%))',
    },
    shadow: '0 4px 20px -4px hsl(200 70% 70% / 0.2)',
  },
  sad: {
    name: 'Warm Comfort',
    description: 'Uplifts mood with warm, comforting colors',
    colors: {
      background: '25 40% 97%', // Warm peach-white
      foreground: '25 30% 20%',
      card: '25 35% 99%',
      cardForeground: '25 30% 20%',
      primary: '25 70% 65%', // Sunrise orange
      primaryForeground: '25 30% 15%',
      secondary: '280 40% 80%', // Lavender
      secondaryForeground: '25 30% 15%',
      muted: '25 30% 95%',
      mutedForeground: '25 25% 45%',
      accent: '160 50% 75%', // Mint green
      accentForeground: '25 30% 15%',
      border: '25 25% 90%',
      input: '25 25% 90%',
      ring: '25 70% 65%',
    },
    gradients: {
      calm: 'linear-gradient(135deg, hsl(25 40% 97%), hsl(280 35% 95%))',
      card: 'linear-gradient(145deg, hsl(25 35% 99%), hsl(160 40% 97%))',
    },
    shadow: '0 4px 20px -4px hsl(25 60% 65% / 0.15)',
  },
  angry: {
    name: 'Cooling Calm',
    description: 'Calms the nervous system with cool, grounding colors',
    colors: {
      background: '200 25% 97%', // Cool blue-white
      foreground: '200 20% 20%',
      card: '200 20% 99%',
      cardForeground: '200 20% 20%',
      primary: '200 60% 55%', // Teal
      primaryForeground: '200 20% 98%',
      secondary: '180 40% 65%', // Forest green
      secondaryForeground: '200 20% 98%',
      muted: '200 20% 95%',
      mutedForeground: '200 15% 45%',
      accent: '210 30% 70%', // Slate blue
      accentForeground: '200 20% 20%',
      border: '200 20% 90%',
      input: '200 20% 90%',
      ring: '200 60% 55%',
    },
    gradients: {
      calm: 'linear-gradient(135deg, hsl(200 25% 97%), hsl(180 30% 95%))',
      card: 'linear-gradient(145deg, hsl(200 20% 99%), hsl(210 25% 97%))',
    },
    shadow: '0 4px 20px -4px hsl(200 50% 55% / 0.15)',
  },
  anxious: {
    name: 'Peaceful Control',
    description: 'Reduces chaos and increases sense of control',
    colors: {
      background: '240 20% 98%', // Dusty blue-white
      foreground: '240 15% 20%',
      card: '240 15% 99%',
      cardForeground: '240 15% 20%',
      primary: '260 30% 65%', // Muted violet
      primaryForeground: '240 20% 98%',
      secondary: '200 25% 75%', // Soft teal
      secondaryForeground: '240 15% 20%',
      muted: '240 15% 96%',
      mutedForeground: '240 10% 45%',
      accent: '0 0% 95%', // Soft white
      accentForeground: '240 15% 20%',
      border: '240 15% 92%',
      input: '240 15% 92%',
      ring: '260 30% 65%',
    },
    gradients: {
      calm: 'linear-gradient(135deg, hsl(240 20% 98%), hsl(260 25% 96%))',
      card: 'linear-gradient(145deg, hsl(240 15% 99%), hsl(200 20% 97%))',
    },
    shadow: '0 4px 20px -4px hsl(260 25% 65% / 0.12)',
  },
  neutral: {
    name: 'Gentle Activation',
    description: 'Adds gentle motivation and brightness',
    colors: {
      background: '50 20% 98%', // Beige-white
      foreground: '50 15% 20%',
      card: '50 15% 99%',
      cardForeground: '50 15% 20%',
      primary: '120 25% 65%', // Pastel green
      primaryForeground: '50 15% 20%',
      secondary: '50 40% 75%', // Mild yellow
      secondaryForeground: '50 15% 20%',
      muted: '50 15% 96%',
      mutedForeground: '50 10% 45%',
      accent: '120 30% 70%',
      accentForeground: '50 15% 20%',
      border: '50 15% 92%',
      input: '50 15% 92%',
      ring: '120 25% 65%',
    },
    gradients: {
      calm: 'linear-gradient(135deg, hsl(50 20% 98%), hsl(120 20% 96%))',
      card: 'linear-gradient(145deg, hsl(50 15% 99%), hsl(50 25% 97%))',
    },
    shadow: '0 4px 20px -4px hsl(120 20% 65% / 0.15)',
  },
  default: {
    name: 'Default',
    description: 'Original calm theme',
    colors: {
      background: '210 25% 97%',
      foreground: '215 20% 25%',
      card: '0 0% 100%',
      cardForeground: '215 20% 25%',
      primary: '214 30% 70%',
      primaryForeground: '0 0% 100%',
      secondary: '267 35% 75%',
      secondaryForeground: '0 0% 100%',
      muted: '210 20% 95%',
      mutedForeground: '215 15% 50%',
      accent: '45 75% 88%',
      accentForeground: '215 20% 25%',
      border: '210 15% 88%',
      input: '210 15% 88%',
      ring: '214 30% 70%',
    },
    gradients: {
      calm: 'linear-gradient(135deg, hsl(210 25% 97%), hsl(214 30% 95%))',
      card: 'linear-gradient(145deg, hsl(0 0% 100%), hsl(210 20% 98%))',
    },
    shadow: '0 4px 20px -4px hsl(214 30% 70% / 0.15)',
  },
};

const STORAGE_KEY = 'mindease_emotion_theme';

/**
 * Map detected emotions to recommended themes
 */
export const mapEmotionToTheme = (emotion: string): EmotionTheme => {
  const emotionLower = emotion.toLowerCase();
  
  // Map GoEmotions and app emotions to themes
  const emotionMap: Record<string, EmotionTheme> = {
    // Happy emotions
    'joy': 'happy',
    'amusement': 'happy',
    'excitement': 'happy',
    'optimism': 'happy',
    'love': 'happy',
    'gratitude': 'happy',
    'pride': 'happy',
    'happy': 'happy',
    
    // Sad emotions
    'sadness': 'sad',
    'grief': 'sad',
    'disappointment': 'sad',
    'remorse': 'sad',
    'sad': 'sad',
    
    // Angry emotions
    'anger': 'angry',
    'annoyance': 'angry',
    'disapproval': 'angry',
    'disgust': 'angry',
    'angry': 'angry',
    
    // Anxious/Fear emotions
    'fear': 'anxious',
    'nervousness': 'anxious',
    'anxiety': 'anxious',
    'anxious': 'anxious',
    'embarrassment': 'anxious',
    
    // Neutral
    'neutral': 'neutral',
    'curiosity': 'neutral',
    'confusion': 'neutral',
    'low_energy': 'neutral',
  };
  
  return emotionMap[emotionLower] || 'neutral';
};

/**
 * Apply a theme to the document
 */
export const applyTheme = (themeName: EmotionTheme): void => {
  const theme = themePresets[themeName];
  const root = document.documentElement;
  
  // Apply smooth transition
  root.style.transition = 'background-color 0.4s ease, color 0.4s ease';
  
  // Apply color variables (matching index.css format)
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--card-foreground', theme.colors.cardForeground);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--secondary-foreground', theme.colors.secondaryForeground);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
  root.style.setProperty('--border', theme.colors.border);
  root.style.setProperty('--input', theme.colors.input);
  root.style.setProperty('--ring', theme.colors.ring);
  
  // Apply gradients
  root.style.setProperty('--gradient-calm', theme.gradients.calm);
  root.style.setProperty('--gradient-card', theme.gradients.card);
  root.style.setProperty('--shadow-soft', theme.shadow);
  
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, themeName);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
  
  // Remove transition after animation completes
  setTimeout(() => {
    root.style.transition = '';
  }, 400);
};

/**
 * Reset theme to default
 */
export const resetTheme = (): void => {
  applyTheme('default');
};

/**
 * Load saved theme from localStorage
 */
export const loadSavedTheme = (): EmotionTheme => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in themePresets) {
      return saved as EmotionTheme;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return 'default';
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = (): void => {
  const savedTheme = loadSavedTheme();
  if (savedTheme !== 'default') {
    applyTheme(savedTheme);
  }
};

