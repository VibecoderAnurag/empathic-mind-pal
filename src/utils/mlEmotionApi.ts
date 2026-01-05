/**
 * ML Model API integration for emotion classification
 * Connects to the FastAPI backend serving the DistilBERT model
 */

const API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export interface EmotionPrediction {
  emotion: string;
  confidence: number;
}

export interface PredictionResponse {
  predictions: EmotionPrediction[];
  top_emotion: string;
  top_confidence: number;
}

import { GoEmotion, getEmotionEmoji, getEmotionColor, mapGoEmotionToAppEmotion } from './emotions';

// Re-export for backward compatibility
export { mapGoEmotionToAppEmotion };

/**
 * Predict emotions using the ML model API
 */
export async function predictEmotion(
  text: string,
  topK: number = 3
): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        top_k: topK,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling ML API:', error);
    // Fallback to neutral if API fails
    throw error;
  }
}

/**
 * Get simplified emotion prediction (just top emotion)
 */
export async function predictEmotionSimple(
  text: string
): Promise<{ emotion: string; confidence: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling ML API:', error);
    throw error;
  }
}

/**
 * Predict emotion and return raw GoEmotion (all 28 emotions supported)
 */
export async function analyzeEmotionWithML(
  text: string,
  returnRaw: boolean = true
): Promise<{
  emotion: GoEmotion | 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'excited';
  confidence: number;
  rawEmotion: string;
  allPredictions?: EmotionPrediction[];
}> {
  try {
    if (returnRaw) {
      // Get top 3 predictions for better context
      const predictions = await predictEmotion(text, 3);
      const rawEmotion = predictions.top_emotion as GoEmotion;
      
      return {
        emotion: rawEmotion,
        confidence: predictions.top_confidence,
        rawEmotion: rawEmotion,
        allPredictions: predictions.predictions,
      };
    } else {
      // Legacy mode: map to 6 categories
      const prediction = await predictEmotionSimple(text);
      const appEmotion = mapGoEmotionToAppEmotion(prediction.emotion);
      
      return {
        emotion: appEmotion,
        confidence: prediction.confidence,
        rawEmotion: prediction.emotion,
      };
    }
  } catch (error) {
    // Log the error for debugging
    console.error('ML API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn(`ML API unavailable (${errorMessage}), using fallback. Make sure the API server is running on ${API_BASE_URL}`);
    
    // Re-throw the error so the calling code can handle it (e.g., fallback to keyword-based analysis)
    throw error;
  }
}

