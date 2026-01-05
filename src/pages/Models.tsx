import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, RefreshCw, Database, BrainCircuit, Heart } from 'lucide-react';

const ML_API = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';
const FACIAL_API = import.meta.env.VITE_FACIAL_API_URL || 'http://localhost:8001';

type Health = { status: string; model_loaded: boolean } | null;
type FacialInfo = { status?: string; model_loaded?: boolean; model_type?: string; input_size?: string; accuracy?: string } | null;

const Models = () => {
  const [mlHealth, setMlHealth] = useState<Health>(null);
  const [facialInfo, setFacialInfo] = useState<FacialInfo>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const mlRes = await fetch(`${ML_API}/health`).then(r => r.ok ? r.json() : null).catch(() => null);
      const facialRes = await fetch(`${FACIAL_API}/`).then(r => r.ok ? r.json() : null).catch(() => null);
      setMlHealth(mlRes);
      setFacialInfo(facialRes);
    } catch (e) {
      setError('Unable to fetch model status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-foreground">Models Overview</h1>
            <p className="text-muted-foreground">Datasets, classes, accuracy, and deployment status</p>
          </div>
          <Button onClick={fetchStatus} variant="outline" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <CardTitle>Text Emotion Classification</CardTitle>
              </div>
              <CardDescription>DistilBERT fine-tuned on GoEmotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Dataset</div>
                  <div className="font-medium">GoEmotions</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Classes</div>
                  <div className="font-medium">28</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Reported Accuracy</div>
                  <div className="font-medium">80–85%</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">API</div>
                  <div className="font-medium">{ML_API}</div>
                </div>
              </div>
              {mlHealth ? (
                mlHealth.model_loaded ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Model loaded</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Model not loaded</span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>API offline</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground">Accuracy varies by training; see ml/checkpoints/test_results.json</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Facial Emotion Classification</CardTitle>
              </div>
              <CardDescription>EfficientNet-B1 (Torch) on FER2013</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Dataset</div>
                  <div className="font-medium">FER2013</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Classes</div>
                  <div className="font-medium">7</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Reported Accuracy</div>
                  <div className="font-medium">{facialInfo?.accuracy || '60%-65%'}</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">API</div>
                  <div className="font-medium">{FACIAL_API}</div>
                </div>
              </div>
              {facialInfo ? (
                facialInfo.model_loaded ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Model loaded</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Model not loaded</span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>API offline</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground">If trained via TensorFlow.js, accuracy ~60–70% on FER2013</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>CBT Support Engine</CardTitle>
              </div>
              <CardDescription>Rule-based, emotion-guided interventions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Dataset</div>
                  <div className="font-medium">None (curated CBT protocols and technique library)</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Scope</div>
                  <div className="font-medium">Breathing regulation, grounding drills, cognitive reframing, affirmation generation, safety prompts</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Components</div>
                  <div className="font-medium">Intervention ruleset, routine generator, emotion-state logic, safety-check module</div>
                </div>
                <div className="p-3 rounded-lg bg-card border">
                  <div className="text-muted-foreground">Reported Accuracy</div>
                  <div className="font-medium">Not applicable (rule-based, not predictive)</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Outputs are guidance based on CBT principles rather than predictions.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Models;