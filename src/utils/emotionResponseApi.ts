/**
 * API integration for the unified emotion-response endpoint
 * Provides comprehensive emotional support responses
 */

const API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export interface EmotionResponseData {
  supportive_message: string;
  actions: string[];
  tools: string[];
  intervention: {
    name: string;
    description: string;
    duration: number;
    steps: string[];
    icon: string;
    category: string;
    target_route?: string;
  };
  routine: {
    key?: string;
    name: string;
    description: string;
    duration: string;
    steps: string[];
    icon: string;
  };
  affirmation: string;
  music: {
    category: string;
    description: string;
    suggestions: Array<{
      title: string;
      artist: string;
      type: string;
      description: string;
    }>;
  };
  safe_override_if_any?: {
    override: boolean;
    message: string;
    recommendations: string[];
    hotline_info?: any;
    priority: string;
  };
  sentiment_analysis?: {
    vader_scores: {
      compound: number;
      pos: number;
      neu: number;
      neg: number;
    };
    textblob_polarity: number;
    textblob_subjectivity: number;
    tones: string[];
    overall_sentiment: string;
    intensity: number;
  };
}

export interface EmotionResponseRequest {
  emotion: string;
  text_input?: string;
  intensity?: number;
  mood_history?: Array<{
    emotion: string;
    timestamp: number;
    confidence?: number;
  }>;
}

/**
 * Get comprehensive emotion response from the API
 */
export async function getEmotionResponse(
  request: EmotionResponseRequest
): Promise<EmotionResponseData> {
  try {
    const response = await fetch(`${API_BASE_URL}/emotion-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: EmotionResponseData = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling emotion-response API:', error);
    throw error;
  }
}

