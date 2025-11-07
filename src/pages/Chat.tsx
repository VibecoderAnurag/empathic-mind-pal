import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ChatMessage';
import { ActivityCard } from '@/components/ActivityCard';
import { analyzeSentiment, getEmotionEmoji } from '@/utils/sentimentAnalysis';
import { getEmpatheticResponse, getSuggestedActivities } from '@/utils/responseEngine';
import { saveMoodEntry } from '@/utils/moodStorage';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  emotion?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm here to support you. How are you feeling today? 💙",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);

    const { emotion, confidence } = analyzeSentiment(input);
    saveMoodEntry(emotion, input, confidence);

    const emotionDisplay = `${getEmotionEmoji(emotion)} ${emotion}`;
    setCurrentEmotion(emotion);

    setTimeout(() => {
      const response = getEmpatheticResponse(emotion, input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        emotion: emotionDisplay,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);

    setInput('');
  };

  const activities = currentEmotion ? getSuggestedActivities(currentEmotion as any) : [];

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-2xl font-light text-foreground">MindEase</h1>
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            emotion={message.emotion}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          <p className="text-sm text-muted-foreground mb-3">Suggested for you:</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {activities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => {
                  const activityMessage: Message = {
                    id: Date.now().toString(),
                    content: `That's a great choice! ${activity.title} can really help. Take your time and enjoy the moment. 🌟`,
                    isUser: false,
                  };
                  setMessages(prev => [...prev, activityMessage]);
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      <div className="p-4 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share how you're feeling..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
