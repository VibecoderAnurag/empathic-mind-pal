/**
 * Chat storage utility for persisting chat messages
 */

import { EmotionResponseData } from './emotionResponseApi';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  emotion?: string;
  emotionResponse?: EmotionResponseData;
}

const STORAGE_KEY = 'mindease_chat_messages';
const MAX_MESSAGES = 100; // Limit to prevent localStorage overflow

const defaultWelcomeMessage: ChatMessage = {
  id: '1',
  content: "Hello! I'm here to support you. How are you feeling today? 💙",
  isUser: false,
};

/**
 * Load chat messages from localStorage
 */
export const loadChatMessages = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const messages = JSON.parse(stored);
      // Validate that we have messages
      if (Array.isArray(messages) && messages.length > 0) {
        return messages;
      }
    }
  } catch (error) {
    console.warn('Error loading chat messages from storage:', error);
  }
  // Return default welcome message if nothing stored
  return [defaultWelcomeMessage];
};

/**
 * Save chat messages to localStorage
 */
export const saveChatMessages = (messages: ChatMessage[]): void => {
  try {
    // Limit message count to prevent localStorage overflow
    const messagesToSave = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
  } catch (error) {
    console.warn('Error saving chat messages to storage:', error);
    // If storage is full, try to save fewer messages
    if (error instanceof DOMException && error.code === 22) {
      try {
        const reducedMessages = messages.slice(-Math.floor(MAX_MESSAGES / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedMessages));
      } catch (retryError) {
        console.error('Failed to save chat messages even with reduced count:', retryError);
      }
    }
  }
};

/**
 * Clear chat messages (start new chat)
 */
export const clearChatMessages = (): ChatMessage[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Error clearing chat messages:', error);
  }
  return [defaultWelcomeMessage];
};

/**
 * Add a new message and save to storage
 */
export const addChatMessage = (messages: ChatMessage[], newMessage: ChatMessage): ChatMessage[] => {
  const updated = [...messages, newMessage];
  saveChatMessages(updated);
  return updated;
};

