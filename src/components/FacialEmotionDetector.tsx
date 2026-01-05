import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmotionData {
  emotion: string;
  confidence: number;
}

interface FacialEmotionDetectorProps {
  onEmotionDetected?: (data: EmotionData) => void;
}

const EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
const EMOTION_EMOJIS: Record<string, string> = {
  angry: '😠',
  disgust: '🤢',
  fear: '😨',
  happy: '😊',
  sad: '😢',
  surprise: '😲',
  neutral: '😐',
};

const EMOTION_COLORS: Record<string, string> = {
  angry: 'hsl(0, 70%, 70%)',
  disgust: 'hsl(120, 40%, 70%)',
  fear: 'hsl(240, 60%, 75%)',
  happy: 'hsl(50, 90%, 75%)',
  sad: 'hsl(210, 50%, 75%)',
  surprise: 'hsl(40, 80%, 80%)',
  neutral: 'hsl(210, 20%, 85%)',
};

const FACIAL_API_URL = import.meta.env.VITE_FACIAL_API_URL || 'http://localhost:8001';

export const FacialEmotionDetector = ({ onEmotionDetected }: FacialEmotionDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check API status
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${FACIAL_API_URL}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Health check response:', data);
          // Check both model_loaded and status
          const isOnline = data.model_loaded === true || data.status === 'healthy';
          setApiStatus(isOnline ? 'online' : 'offline');
          setIsLoading(false);
          if (isOnline) {
            setError(null); // Clear any previous errors
          }
        } else {
          console.warn('Health check returned non-OK status:', response.status);
          setApiStatus('offline');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('offline');
        setIsLoading(false);
        setError('Facial emotion API server is not running. Please start it on port 8001.');
      }
    };
    
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Start/Stop camera
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsActive(false);
    setCurrentEmotion('neutral');
    setConfidence(0);
  }, []);

  // Predict emotion from video frame using API
  const predictEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isActive || apiStatus !== 'online') return;

    try {
      // Capture frame from video
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        try {
          // Send to API
          const formData = new FormData();
          formData.append('file', blob, 'frame.jpg');
          
          const response = await fetch(`${FACIAL_API_URL}/predict`, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - let browser set it with boundary
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error (${response.status}):`, errorText);
            // Don't set offline on prediction errors - API is still running
            return;
          }
          
          const data = await response.json();
          
          setCurrentEmotion(data.top_emotion);
          setConfidence(data.top_confidence);
          setApiStatus('online');

          // Callback
          if (onEmotionDetected) {
            onEmotionDetected({
              emotion: data.top_emotion,
              confidence: data.top_confidence,
            });
          }
        } catch (err) {
          console.error('Error predicting emotion:', err);
          // Only set offline if it's a network error, not a prediction error
          if (err instanceof TypeError && err.message.includes('fetch')) {
            setApiStatus('offline');
          }
        }
      }, 'image/jpeg', 0.8);
    } catch (err) {
      console.error('Error capturing frame:', err);
    }
  }, [isActive, onEmotionDetected, apiStatus]);

  // Animation loop
  useEffect(() => {
    if (!isActive || apiStatus !== 'online') return;

    let lastTime = 0;
    const targetFPS = 5; // ~5 FPS for API calls (slower than local model)
    const interval = 1000 / targetFPS;

    const loop = (currentTime: number) => {
      if (currentTime - lastTime >= interval) {
        predictEmotion();
        lastTime = currentTime;
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, apiStatus, predictEmotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Checking facial emotion API...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (apiStatus === 'offline') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Facial Emotion API Server Offline</p>
              <p className="mb-2">The facial emotion API server is not running.</p>
              <p className="mb-2">To start it, run:</p>
              <code className="block bg-muted p-2 rounded text-sm mb-2">
                cd ml && python facial_emotion_api.py
              </code>
              <p className="text-xs text-muted-foreground">API URL: {FACIAL_API_URL}</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-[#E0F7FA] to-[#FCE4EC] border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-light">Facial Emotion Detection</CardTitle>
        <CardDescription>
          Real-time emotion recognition from your webcam
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/10 backdrop-blur-sm">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
            style={{ display: 'none' }}
          />
          
          {!isActive && (
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <CameraOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Camera not active</p>
              </div>
            </div>
          )}

          {/* Emotion Overlay */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.span
                      key={currentEmotion}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-4xl"
                    >
                      {EMOTION_EMOJIS[currentEmotion]}
                    </motion.span>
                    <div>
                      <motion.p
                        key={currentEmotion}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white text-xl font-medium capitalize"
                      >
                        {currentEmotion}
                      </motion.p>
                      <p className="text-white/70 text-sm">
                        Confidence: {(confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Confidence Bar */}
                <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-pink-400 rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!isActive ? (
            <Button
              onClick={startCamera}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white shadow-lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button
              onClick={stopCamera}
              size="lg"
              variant="destructive"
              className="shadow-lg"
            >
              <CameraOff className="w-5 h-5 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Detecting: {EMOTIONS.join(', ')}</p>
          <p className="mt-1">Running at ~10 FPS for optimal performance</p>
        </div>
      </CardContent>
    </Card>
  );
};


