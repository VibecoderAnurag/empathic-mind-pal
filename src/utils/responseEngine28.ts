import { GoEmotion } from './emotions';

/**
 * Empathetic responses for all 28 GoEmotions
 */
export const getEmpatheticResponse28 = (emotion: GoEmotion, userMessage: string): string => {
  const responses: Record<GoEmotion, string[]> = {
    admiration: [
      "That's wonderful! I can feel your admiration. What specifically draws you to this? ✨",
      "Your sense of admiration is beautiful! It's great to appreciate things that inspire you. 🌟",
      "I love that you're feeling this way! Admiration can be such a positive force. 💫",
    ],
    amusement: [
      "Haha, that's funny! 😄 Laughter is such good medicine. Want to share more?",
      "I'm glad you're finding amusement! It's wonderful to find joy in the little things. 😊",
      "Your sense of humor is delightful! What's got you smiling? 😄",
    ],
    anger: [
      "I understand you're feeling angry. Your feelings are valid. Let's work through this together. 🌊",
      "Anger can be overwhelming. Take a deep breath. I'm here to help you process this. 💙",
      "It's okay to feel angry. What's bothering you? Let's talk it through. 🤗",
    ],
    annoyance: [
      "I hear that something's annoying you. That can be really frustrating. Want to vent?",
      "Annoyance can really get under your skin. I'm here to listen if you want to share.",
      "That sounds annoying! Sometimes it helps to talk about what's bothering us.",
    ],
    approval: [
      "That's great! I'm glad you approve. It's nice to feel positive about something! 👍",
      "Your approval shows you're engaged and thinking! That's wonderful. ✨",
      "I love your positive outlook! Approval can feel really good. 🌟",
    ],
    caring: [
      "Your caring nature is beautiful! It shows how much you care about others. 💝",
      "That's so thoughtful of you! Caring for others is a wonderful quality. ❤️",
      "I can feel how much you care. That's such a meaningful emotion. 💕",
    ],
    confusion: [
      "It's okay to feel confused sometimes. Let's work through this together. 🤔",
      "Confusion can be frustrating, but it's also a sign you're thinking deeply. Let's clarify things.",
      "I understand the confusion. Sometimes talking it through helps. What questions do you have?",
    ],
    curiosity: [
      "Your curiosity is wonderful! Asking questions and exploring is how we learn. 🤔",
      "I love your sense of curiosity! What are you curious about?",
      "Curiosity is a beautiful thing! It shows you're engaged and growing. 💡",
    ],
    desire: [
      "I hear your desire. Having goals and wants is natural and human. What do you desire?",
      "Your desires are valid! It's important to acknowledge what we want. 💭",
      "Desire can be powerful. What's driving this feeling for you?",
    ],
    disappointment: [
      "I'm sorry you're feeling disappointed. That can be really hard. 💙",
      "Disappointment is tough. I'm here to support you through this. 🤗",
      "It's okay to feel disappointed. Your feelings are valid. Want to talk about it?",
    ],
    disapproval: [
      "I hear your disapproval. It's okay to have strong opinions. What concerns you?",
      "Your disapproval shows you're thinking critically. That's important. Let's explore this.",
      "I understand your disapproval. Sometimes expressing these feelings helps. 💭",
    ],
    disgust: [
      "I hear that something is causing you disgust. That's a strong feeling. Want to talk about it?",
      "Disgust can be overwhelming. I'm here to listen if you want to share.",
      "That sounds unpleasant. Sometimes talking about what disgusts us can help process it.",
    ],
    embarrassment: [
      "I understand feeling embarrassed. We've all been there. You're not alone. 😳",
      "Embarrassment can feel really uncomfortable, but remember, these moments pass. 💙",
      "It's okay to feel embarrassed. These feelings are temporary. I'm here for you. 🤗",
    ],
    excitement: [
      "Your excitement is contagious! 🎉 Tell me all about what's got you excited!",
      "I love your energy! Excitement is such a wonderful feeling! ✨",
      "This is wonderful! Your excitement is amazing! Share more! 🌟",
    ],
    fear: [
      "I understand you're feeling afraid. Fear can be overwhelming, but you're safe here. 💙",
      "It's okay to feel fear. Your feelings are valid. Let's work through this together. 🤗",
      "Fear is a natural response. I'm here to support you. What's causing the fear?",
    ],
    gratitude: [
      "Gratitude is such a beautiful emotion! 🙏 What are you grateful for today?",
      "Your gratitude is wonderful! Practicing gratitude can bring so much joy. ✨",
      "I love that you're feeling grateful! Gratitude is such a powerful feeling. 💝",
    ],
    grief: [
      "I'm so sorry you're experiencing grief. This is really hard. I'm here for you. 💙",
      "Grief is profound and painful. There's no timeline for this. I'm here to listen. 🤗",
      "I can't imagine how difficult this is. Your grief is valid. You're not alone. 💔",
    ],
    joy: [
      "I'm so happy you're feeling joy! 😊 What's bringing you this happiness?",
      "Your joy is beautiful! Celebrate these moments! ✨",
      "That's wonderful! Joy is such a precious emotion! 🌟",
    ],
    love: [
      "Love is such a beautiful feeling! ❤️ I'm glad you're experiencing this.",
      "Your capacity for love is wonderful! Love can be transformative. 💕",
      "I can feel the love in your words! That's so beautiful! 💝",
    ],
    nervousness: [
      "I understand feeling nervous. That's totally normal. Let's take this one step at a time. 😰",
      "Nervousness can be uncomfortable, but remember, you've handled difficult situations before. 💙",
      "It's okay to feel nervous. Sometimes breathing exercises can help. Want to try one? 🌿",
    ],
    optimism: [
      "Your optimism is wonderful! 😊 Having a positive outlook can make such a difference!",
      "I love your optimistic perspective! That's such a valuable quality! ✨",
      "Your optimism is inspiring! Keep that positive energy! 🌟",
    ],
    pride: [
      "You should be proud! 🦁 Your achievements and feelings are valid!",
      "Pride is a wonderful feeling! You've earned this! ✨",
      "I'm so happy you're feeling proud! That's amazing! 🌟",
    ],
    realization: [
      "Ah, a realization! 💡 Those moments of clarity can be so powerful!",
      "I love when we have those 'aha' moments! What did you realize?",
      "Realizations can be transformative! This is wonderful! ✨",
    ],
    relief: [
      "I'm so glad you're feeling relief! 😌 That must feel so much better!",
      "Relief is such a welcome feeling after stress or worry. Enjoy this moment! 💙",
      "Your relief is palpable! It's great when things work out. ✨",
    ],
    remorse: [
      "I hear your remorse. It's okay to feel this way. Growth comes from reflection. 💙",
      "Remorse shows you care and want to do better. That's important. 🤗",
      "It's okay to feel remorseful. These feelings can lead to positive change.",
    ],
    sadness: [
      "I'm here with you. It's okay to feel sad. Your feelings are valid. 💙",
      "Sadness can be really hard. I'm here to listen and support you. 🤗",
      "You don't have to face this sadness alone. I'm here for you. 💙",
    ],
    surprise: [
      "Surprise! 😲 That must have been unexpected! How are you feeling about it?",
      "Surprises can be exciting or overwhelming. What surprised you?",
      "I can sense the surprise! Those unexpected moments can be memorable! ✨",
    ],
    neutral: [
      "Thanks for sharing with me. How are you feeling?",
      "I'm here to chat whenever you need. What's on your mind?",
      "I appreciate you opening up. Is there anything specific you'd like to talk about?",
    ],
  };

  const emotionResponses = responses[emotion] || responses.neutral;
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
};

