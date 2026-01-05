import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-4">
            MindEase
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Your compassionate AI companion for emotional wellness
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-3xl shadow-soft border border-border"
        >
          <p className="text-foreground leading-relaxed">
            Welcome to a safe space where your feelings matter. 
            MindEase uses gentle emotion detection to understand how you're feeling 
            and provides personalized support, activities, and insights to help you feel better. 💙
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row flex-wrap gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => navigate('/chat')}
            className="text-lg px-8 py-6 rounded-full shadow-soft hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Chat
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="text-lg px-8 py-6 rounded-full shadow-soft hover:shadow-lg transition-all"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            View Dashboard
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/facial-emotion')}
            className="text-lg px-8 py-6 rounded-full shadow-soft hover:shadow-lg transition-all"
          >
            📷 Facial Emotion
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/models')}
            className="text-lg px-8 py-6 rounded-full shadow-soft hover:shadow-lg transition-all"
          >
            📚 Models Overview
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { icon: '💬', title: 'Share Your Feelings', desc: 'Express yourself freely' },
            { icon: '🎯', title: 'Get Support', desc: 'Personalized suggestions' },
            { icon: '📊', title: 'Track Progress', desc: 'Monitor your mood journey' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="p-4 bg-card/30 backdrop-blur-sm rounded-2xl border border-border"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
