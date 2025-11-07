import { Emotion } from './sentimentAnalysis';

export interface Activity {
  id: string;
  title: string;
  icon: string;
  type: 'music' | 'breathing' | 'video' | 'affirmation';
}

export const getEmpatheticResponse = (emotion: Emotion, userMessage: string): string => {
  const responses: Record<Emotion, string[]> = {
    happy: [
      "I'm so glad to hear you're feeling good! 🌟 What's bringing you joy today?",
      "Your positive energy is wonderful! Keep celebrating those good moments! ✨",
      "That's amazing! I love seeing you happy. Want to share more about what's making you smile?",
    ],
    sad: [
      "I'm here with you. It's okay to feel sad sometimes. 💙 Would you like to talk about it?",
      "I can sense you're going through a tough time. Remember, these feelings are temporary. I'm here to listen.",
      "Your feelings are valid. Take all the time you need. I'm here for support. 🤗",
    ],
    angry: [
      "I understand you're feeling frustrated. Let's work through this together. 🌊 Take a deep breath with me?",
      "It's okay to feel angry. Your emotions are valid. Want to tell me what's bothering you?",
      "I hear you. Sometimes things can be really frustrating. I'm here to help you process these feelings.",
    ],
    anxious: [
      "I notice you might be feeling anxious. Let's take this one step at a time together. 🌿",
      "Anxiety can be overwhelming, but you're not alone. Would a breathing exercise help right now?",
      "I'm here with you. Remember to breathe. You're safe, and we'll get through this together.",
    ],
    excited: [
      "Your excitement is contagious! 🎉 Tell me all about it!",
      "I love your energy! What's got you so pumped up?",
      "This is wonderful! Your enthusiasm is amazing! Share more! ✨",
    ],
    neutral: [
      "Thanks for sharing with me. How has your day been so far?",
      "I'm here to chat whenever you need. What's on your mind?",
      "I appreciate you opening up. Is there anything specific you'd like to talk about?",
    ],
  };

  const emotionResponses = responses[emotion];
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
};

export const getSuggestedActivities = (emotion: Emotion): Activity[] => {
  const activityMap: Record<Emotion, Activity[]> = {
    sad: [
      { id: '1', title: 'Listen to uplifting music', icon: '🎵', type: 'music' },
      { id: '2', title: '5-minute breathing exercise', icon: '🌿', type: 'breathing' },
      { id: '3', title: 'Watch a motivational video', icon: '🎬', type: 'video' },
      { id: '4', title: 'Read positive affirmations', icon: '💬', type: 'affirmation' },
    ],
    anxious: [
      { id: '5', title: 'Guided meditation', icon: '🧘', type: 'breathing' },
      { id: '6', title: 'Calming nature sounds', icon: '🌊', type: 'music' },
      { id: '7', title: 'Grounding exercise', icon: '🌿', type: 'breathing' },
      { id: '8', title: 'Peaceful affirmations', icon: '☮️', type: 'affirmation' },
    ],
    angry: [
      { id: '9', title: 'Calming breathing technique', icon: '💨', type: 'breathing' },
      { id: '10', title: 'Relaxing instrumental music', icon: '🎶', type: 'music' },
      { id: '11', title: 'Anger management tips', icon: '🧠', type: 'video' },
      { id: '12', title: 'Release and let go affirmations', icon: '🕊️', type: 'affirmation' },
    ],
    happy: [
      { id: '13', title: 'Upbeat playlist', icon: '🎉', type: 'music' },
      { id: '14', title: 'Gratitude practice', icon: '🙏', type: 'affirmation' },
      { id: '15', title: 'Celebrate your wins', icon: '🏆', type: 'video' },
      { id: '16', title: 'Joyful affirmations', icon: '✨', type: 'affirmation' },
    ],
    excited: [
      { id: '17', title: 'Energizing music', icon: '⚡', type: 'music' },
      { id: '18', title: 'Channel your energy', icon: '🔥', type: 'breathing' },
      { id: '19', title: 'Motivational content', icon: '💪', type: 'video' },
      { id: '20', title: 'Power affirmations', icon: '🌟', type: 'affirmation' },
    ],
    neutral: [
      { id: '21', title: 'Mindful breathing', icon: '🌸', type: 'breathing' },
      { id: '22', title: 'Ambient sounds', icon: '🎧', type: 'music' },
      { id: '23', title: 'Daily inspiration', icon: '💡', type: 'video' },
      { id: '24', title: 'Self-care affirmations', icon: '💝', type: 'affirmation' },
    ],
  };

  return activityMap[emotion] || activityMap.neutral;
};
