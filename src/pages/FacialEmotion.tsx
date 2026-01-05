import { FacialEmotionDetector } from '@/components/FacialEmotionDetector';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeSuggestionModal } from '@/components/ThemeSuggestionModal';
import { mapEmotionToTheme, EmotionTheme } from '@/utils/themeManager';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FacialEmotion = () => {
  const [detectedEmotions, setDetectedEmotions] = useState<Array<{ emotion: string; confidence: number; timestamp: Date }>>([]);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [suggestedTheme, setSuggestedTheme] = useState<EmotionTheme>('default');
  const [detectedEmotion, setDetectedEmotion] = useState<string>('');
  const lastThemeSuggestionRef = useRef<string>('');
  const lastThemeSuggestionTimeRef = useRef<number>(0);

  const handleEmotionDetected = (data: { emotion: string; confidence: number }) => {
    // Only add if confidence is above threshold and emotion changed
    setDetectedEmotions(prev => {
      const last = prev[prev.length - 1];
      if (last && last.emotion === data.emotion && Date.now() - last.timestamp.getTime() < 2000) {
        return prev; // Don't add duplicate within 2 seconds
      }
      return [...prev.slice(-9), { ...data, timestamp: new Date() }]; // Keep last 10
    });

    // Suggest theme if confidence is high and enough time has passed since last suggestion
    const now = Date.now();
    const timeSinceLastSuggestion = now - lastThemeSuggestionTimeRef.current;
    const shouldSuggest = 
      data.confidence > 0.7 && 
      (data.emotion !== lastThemeSuggestionRef.current || timeSinceLastSuggestion > 30000); // 30 seconds between suggestions

    if (shouldSuggest) {
      const recommendedTheme = mapEmotionToTheme(data.emotion);
      if (recommendedTheme !== 'default') {
        setSuggestedTheme(recommendedTheme);
        setDetectedEmotion(data.emotion);
        lastThemeSuggestionRef.current = data.emotion;
        lastThemeSuggestionTimeRef.current = now;
        setTimeout(() => {
          setShowThemeModal(true);
        }, 2000); // Show after 2 seconds
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Detector */}
        <FacialEmotionDetector onEmotionDetected={handleEmotionDetected} />

        {/* Emotion History */}
        {detectedEmotions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Detections</CardTitle>
                <CardDescription>
                  Last {detectedEmotions.length} emotion detections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {detectedEmotions.slice().reverse().map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-lg text-center border"
                      style={{
                        backgroundColor: `hsl(${
                          item.emotion === 'happy' ? '50, 90%, 95%' :
                          item.emotion === 'sad' ? '210, 50%, 90%' :
                          item.emotion === 'angry' ? '0, 70%, 90%' :
                          item.emotion === 'fear' ? '240, 60%, 90%' :
                          item.emotion === 'surprise' ? '40, 80%, 90%' :
                          item.emotion === 'disgust' ? '120, 40%, 90%' :
                          '210, 20%, 90%'
                        })`
                      }}
                    >
                      <div className="text-3xl mb-2">
                        {item.emotion === 'happy' ? '😊' :
                         item.emotion === 'sad' ? '😢' :
                         item.emotion === 'angry' ? '😠' :
                         item.emotion === 'fear' ? '😨' :
                         item.emotion === 'surprise' ? '😲' :
                         item.emotion === 'disgust' ? '🤢' : '😐'}
                      </div>
                      <div className="text-sm font-medium capitalize">{item.emotion}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {(item.confidence * 100).toFixed(0)}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>About Facial Emotion Detection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This system uses a Convolutional Neural Network (CNN) trained on the FER2013 dataset 
              to detect 7 emotions in real-time from your webcam feed.
            </p>
            <div>
              <h4 className="font-medium mb-2">Detected Emotions:</h4>
              <div className="flex flex-wrap gap-2">
                {['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'].map(emotion => (
                  <span key={emotion} className="px-3 py-1 bg-muted rounded-full text-sm capitalize">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">How it works:</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Captures frames from your webcam at ~10 FPS</li>
                <li>Preprocesses images to 48x48 grayscale</li>
                <li>Runs predictions using TensorFlow.js in the browser</li>
                <li>Displays emotion with confidence score</li>
              </ul>
            </div>
          </CardContent>
        </Card>
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

export default FacialEmotion;


