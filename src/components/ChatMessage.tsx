import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  emotion?: string;
}

export const ChatMessage = ({ content, isUser, emotion }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-card text-card-foreground shadow-soft'
          }`}
        >
          <p className="text-sm leading-relaxed">{content}</p>
          {emotion && !isUser && (
            <span className="text-xs text-muted-foreground mt-1 block">
              Detected: {emotion}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
