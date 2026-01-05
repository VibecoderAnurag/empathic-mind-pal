import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, TrendingUp, Loader2, MessageSquarePlus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/components/ChatMessage';
import { ActivityCard } from '@/components/ActivityCard';
import { EmotionResponseDisplay } from '@/components/EmotionResponseDisplay';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { analyzeSentiment, getEmotionEmoji } from '@/utils/sentimentAnalysis';
import { analyzeEmotionWithML } from '@/utils/mlEmotionApi';
import { getEmpatheticResponse, getSuggestedActivities, getEmpatheticResponse28 } from '@/utils/responseEngine';
import { saveMoodEntry, getMoodEntries } from '@/utils/moodStorage';
import { getEmotionEmoji as getGoEmotionEmoji, getEmotionColor, mapGoEmotionToAppEmotion } from '@/utils/emotions';
import { getEmotionResponse, EmotionResponseData } from '@/utils/emotionResponseApi';
import { loadChatMessages, saveChatMessages, clearChatMessages, addChatMessage, ChatMessage as ChatMessageType } from '@/utils/chatStorage';
import { ThemeSuggestionModal } from '@/components/ThemeSuggestionModal';
import { mapEmotionToTheme, EmotionTheme } from '@/utils/themeManager';
import { Link } from 'react-router-dom';

const Chat = () => {
  // Load messages from localStorage on mount
  const [messages, setMessages] = useState<ChatMessageType[]>(() => loadChatMessages());
  const [input, setInput] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [suggestedTheme, setSuggestedTheme] = useState<EmotionTheme>('default');
  const [detectedEmotion, setDetectedEmotion] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    // Show scroll to top button if scrolled down more than 200px
    setShowScrollTop(scrollTop > 200);

    // Show scroll to bottom button if not at bottom (within 100px threshold)
    setShowScrollBottom(scrollBottom > 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Initial check after a small delay to ensure container is rendered
    setTimeout(() => {
      handleScroll();
    }, 100);

    container.addEventListener('scroll', handleScroll);
    
    // Also check on resize
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [messages]);

  // Force check when messages change
  useEffect(() => {
    setTimeout(() => {
      handleScroll();
    }, 200);
  }, [messages.length]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatMessages(messages);
    }
  }, [messages]);

  const handleNewChat = () => {
    const clearedMessages = clearChatMessages();
    setMessages(clearedMessages);
    setCurrentEmotion(null);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
    };

    setMessages(prev => addChatMessage(prev, userMessage));
    setIsAnalyzing(true);

    try {
      // Try to use ML model first - get raw emotion (all 28 emotions)
      const mlResult = await analyzeEmotionWithML(input, true);
      const rawEmotion = mlResult.rawEmotion;
      const confidence = mlResult.confidence;
      
      // Map to app emotion for activities/response system
      const appEmotion = mapGoEmotionToAppEmotion(rawEmotion);
      
      // Save with app emotion for compatibility
      saveMoodEntry(appEmotion, input, confidence);
      
      // Display raw emotion with emoji and confidence
      const emotionDisplay = `${getGoEmotionEmoji(rawEmotion)} ${rawEmotion} (${(confidence * 100).toFixed(1)}%)`;
      
      setCurrentEmotion(appEmotion);
      
      // Suggest theme based on detected emotion (only if confidence is high enough)
      if (confidence > 0.6) {
        const recommendedTheme = mapEmotionToTheme(rawEmotion);
        // Only suggest if it's not the default theme and user hasn't dismissed recently
        if (recommendedTheme !== 'default') {
          setSuggestedTheme(recommendedTheme);
          setDetectedEmotion(rawEmotion);
          // Small delay to let the emotion response show first
          setTimeout(() => {
            setShowThemeModal(true);
          }, 1500);
        }
      }

      // Try to get comprehensive emotion response
      try {
        const moodHistory = getMoodEntries().slice(-7).map(entry => ({
          emotion: entry.emotion,
          timestamp: entry.timestamp,
          confidence: entry.confidence,
        }));

        const emotionResponse = await getEmotionResponse({
          emotion: rawEmotion,
          text_input: input,
          intensity: confidence,
          mood_history: moodHistory,
        });

        // Add response message with comprehensive data
        const aiMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          content: emotionResponse.supportive_message,
          isUser: false,
          emotion: emotionDisplay,
          emotionResponse: emotionResponse,
        };
        setMessages(prev => addChatMessage(prev, aiMessage));
        setIsAnalyzing(false);
      } catch (responseError) {
        // Fallback to simple response if comprehensive API fails
        console.warn('Comprehensive response API unavailable, using fallback:', responseError);
        const response = getEmpatheticResponse28(rawEmotion as any, input);
        const aiMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          content: response,
          isUser: false,
          emotion: emotionDisplay,
        };
        setMessages(prev => addChatMessage(prev, aiMessage));
        setIsAnalyzing(false);
      }
    } catch (error) {
      // Fallback to keyword-based analysis if ML API fails
      console.warn('ML API unavailable, using fallback analysis:', error);
      const { emotion, confidence } = analyzeSentiment(input);
      saveMoodEntry(emotion, input, confidence);
      
      const emotionDisplay = `${getEmotionEmoji(emotion)} ${emotion}`;
      setCurrentEmotion(emotion);
      
      // Suggest theme for fallback emotion detection too
      const recommendedTheme = mapEmotionToTheme(emotion);
      if (recommendedTheme !== 'default' && confidence > 0.5) {
        setSuggestedTheme(recommendedTheme);
        setDetectedEmotion(emotion);
        setTimeout(() => {
          setShowThemeModal(true);
        }, 1500);
      }

      // Try comprehensive response with fallback emotion
      try {
        const moodHistory = getMoodEntries().slice(-7).map(entry => ({
          emotion: entry.emotion,
          timestamp: entry.timestamp,
          confidence: entry.confidence,
        }));

        const emotionResponse = await getEmotionResponse({
          emotion: emotion,
          text_input: input,
          intensity: confidence,
          mood_history: moodHistory,
        });

        const aiMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          content: emotionResponse.supportive_message,
          isUser: false,
          emotion: emotionDisplay,
          emotionResponse: emotionResponse,
        };
        setMessages(prev => addChatMessage(prev, aiMessage));
        setIsAnalyzing(false);
      } catch (responseError) {
        // Final fallback
        const response = getEmpatheticResponse(emotion, input);
        const aiMessage: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          content: response,
          isUser: false,
          emotion: emotionDisplay,
        };
        setMessages(prev => addChatMessage(prev, aiMessage));
        setIsAnalyzing(false);
      }
    }

    setInput('');
  };

  const activities = currentEmotion ? getSuggestedActivities(currentEmotion as any) : [];

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-2xl font-light text-foreground">MindEase</h1>
        <div className="flex flex-wrap gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <MessageSquarePlus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start a New Chat?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear your current conversation history. Your mood entries will be preserved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleNewChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Chat
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Link to="/emotion-test">
            <Button variant="ghost" size="sm">
              🧪 Test All 28 Emotions
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4"
      >
        <div className="flex flex-wrap gap-2">
          <Link to="/gratitude">
            <Button variant="secondary" size="sm" className="rounded-full">
              🙏 Gratitude
            </Button>
          </Link>
          <Link to="/wellness">
            <Button variant="secondary" size="sm" className="rounded-full">
              💙 Wellness
            </Button>
          </Link>
          <Link to="/memory">
            <Button variant="secondary" size="sm" className="rounded-full">
              ✨ Memory Recall
            </Button>
          </Link>
        </div>
      </motion.div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map(message => (
          <div key={message.id} className="space-y-2">
            <ChatMessage
              content={message.content}
              isUser={message.isUser}
              emotion={message.emotion}
            />
            {!message.isUser && message.emotionResponse && (
              <div className="max-w-4xl mx-auto mt-4">
                <EmotionResponseDisplay 
                  response={message.emotionResponse} 
                  emotion={message.emotion || 'neutral'}
                />
              </div>
            )}
          </div>
        ))}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing your message...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll Navigation Buttons - Outside container for proper positioning */}
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            onClick={scrollToTop}
            className="fixed right-6 top-20 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center border-2 border-primary/20 backdrop-blur-md hover:scale-110 active:scale-95"
            title="Scroll to top"
            aria-label="Scroll to top"
            style={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToBottom}
            className="fixed right-6 bottom-20 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center border-2 border-primary/20 backdrop-blur-md hover:scale-110 active:scale-95"
            title="Scroll to bottom"
            aria-label="Scroll to bottom"
            style={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

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
                  if (activity.type === 'breathing') {
                    window.location.href = '/breathing?pattern=box';
                  } else {
                    const activityMessage: ChatMessageType = {
                      id: Date.now().toString(),
                      content: `That's a great choice! ${activity.title} can really help. Take your time and enjoy the moment. 🌟`,
                      isUser: false,
                    };
                    setMessages(prev => addChatMessage(prev, activityMessage));
                  }
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

      {/* Theme Suggestion Modal */}
      <ThemeSuggestionModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        themeName={suggestedTheme}
        emotion={detectedEmotion}
      />
    </div>
  );
};

export default Chat;
