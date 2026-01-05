import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ALL_EMOTIONS, getEmotionEmoji, getEmotionColor, getEmotionCategory } from '@/utils/emotions';
import { predictEmotion } from '@/utils/mlEmotionApi';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

const EmotionTest = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const testEmotions = [
    "I am so happy and joyful today!",
    "I feel really anxious and nervous",
    "That made me so angry and frustrated",
    "I am grateful for your help",
    "I'm feeling sad and disappointed",
    "I'm excited about the upcoming event!",
    "I feel confused about what to do",
    "I'm curious about how this works",
    "I'm proud of my achievements",
    "I feel relieved that it's over",
  ];

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log(`Checking API status at: ${API_BASE_URL}/health`);
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add mode to handle CORS
          mode: 'cors',
        });
        
        console.log(`API health check response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API health check data:', data);
          setApiStatus(data.model_loaded ? 'online' : 'offline');
        } else {
          console.error(`API health check failed with status: ${response.status}`);
          setApiStatus('offline');
        }
      } catch (error) {
        console.error('API health check error:', error);
        setApiStatus('offline');
      }
    };
    
    checkApiStatus();
    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTest = async (text: string) => {
    if (!text.trim()) return;
    
    setInput(text);
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const predictions = await predictEmotion(text, 5);
      setResults(predictions);
      setApiStatus('online'); // Update status if successful
    } catch (error) {
      console.error('Error testing emotion:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to connect to the ML API server';
      setError(errorMessage);
      setResults(null);
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* API Status Alert */}
        {apiStatus === 'offline' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Server Offline</AlertTitle>
            <AlertDescription>
              The ML API server is not running. Please start the API server to use this feature.
              <br />
              <code className="mt-2 block bg-muted p-2 rounded text-sm">
                cd ml && python api_server.py
              </code>
              <span className="text-xs text-muted-foreground mt-1 block">
                API URL: {API_BASE_URL}
              </span>
            </AlertDescription>
          </Alert>
        )}
        
        {apiStatus === 'online' && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>API Server Online</AlertTitle>
            <AlertDescription>
              The ML API server is running and ready to process emotion predictions.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>28 Emotion Classification Test</CardTitle>
            <CardDescription>
              Test the ML model with all 28 GoEmotions. Type a message or use the quick test buttons below.
              {apiStatus === 'offline' && (
                <span className="block mt-1 text-destructive text-sm">
                  ⚠️ API server is offline. Please start the server to use this feature.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTest(input)}
                placeholder="Type a message to test emotion detection..."
                className="flex-1"
              />
              <Button 
                onClick={() => handleTest(input)} 
                disabled={loading || !input.trim() || apiStatus === 'offline'}
              >
                {loading ? 'Testing...' : 'Test'}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {testEmotions.map((text, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTest(text)}
                  disabled={loading || apiStatus === 'offline'}
                  className="text-xs"
                  title={apiStatus === 'offline' ? 'API server is offline' : text}
                >
                  {text.substring(0, 30)}...
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {results && results.predictions && Array.isArray(results.predictions) && results.predictions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
              <CardDescription>
                {results.top_emotion && results.top_confidence !== undefined ? (
                  <>
                    Top emotion: {getEmotionEmoji(results.top_emotion)} {results.top_emotion} ({(results.top_confidence * 100).toFixed(1)}%)
                  </>
                ) : (
                  'Showing top predictions'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.predictions.map((pred: any, idx: number) => {
                  if (!pred || !pred.emotion) return null;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ backgroundColor: getEmotionColor(pred.emotion) }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getEmotionEmoji(pred.emotion)}</span>
                        <span className="font-medium capitalize">{pred.emotion}</span>
                        <span className="text-xs text-muted-foreground">
                          ({getEmotionCategory(pred.emotion as any)})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(pred.confidence || 0) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {((pred.confidence || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
        
        {results && (!results.predictions || !Array.isArray(results.predictions) || results.predictions.length === 0) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Results</AlertTitle>
            <AlertDescription>
              The API returned an invalid response. Please check the API server logs.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All 28 Emotions</CardTitle>
            <CardDescription>
              Complete list of emotions the model can detect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {ALL_EMOTIONS.map((emotion) => {
                const category = getEmotionCategory(emotion);
                return (
                  <div
                    key={emotion}
                    className="p-3 rounded-lg text-center"
                    style={{ backgroundColor: getEmotionColor(emotion) }}
                  >
                    <div className="text-2xl mb-1">{getEmotionEmoji(emotion)}</div>
                    <div className="text-xs font-medium capitalize">{emotion}</div>
                    <div className="text-xs text-muted-foreground mt-1">{category}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionTest;

