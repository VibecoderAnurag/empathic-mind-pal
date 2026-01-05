import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BreathingCircle } from '@/components/BreathingCircle';
import { breathingPatterns, BreathingPattern } from '@/utils/breathingPatterns';
import { toast } from 'sonner';

const BreathingExercise = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patternId = searchParams.get('pattern') || 'box';
  const mode = searchParams.get('mode'); // 'quick' for 10-second reset
  const basePattern = breathingPatterns.find(p => p.id === patternId) || breathingPatterns[0];
  
  // Create quick mode pattern (10-second breathing reset)
  const quickPattern = mode === 'quick' ? {
    ...basePattern,
    id: 'quick',
    name: '10-Second Breathing Reset',
    description: 'A quick breathing exercise to reset your nervous system',
    phases: [
      { type: 'inhale' as const, duration: 2, instruction: 'Breathe in slowly' },
      { type: 'hold' as const, duration: 2, instruction: 'Hold gently' },
      { type: 'exhale' as const, duration: 4, instruction: 'Exhale slowly' },
      { type: 'rest' as const, duration: 2, instruction: 'Rest and pause' },
    ],
    totalDuration: 10,
  } : null;
  
  const pattern = quickPattern || basePattern;

  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(pattern.phases[0].duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPhase = pattern.phases[currentPhaseIndex];

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next phase
            const nextIndex = (currentPhaseIndex + 1) % pattern.phases.length;
            setCurrentPhaseIndex(nextIndex);
            
            // Increment cycle count when completing a full cycle
            if (nextIndex === 0) {
              setCyclesCompleted(prev => prev + 1);
            }
            
            return pattern.phases[nextIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, currentPhaseIndex, pattern]);

  const handleToggle = () => {
    if (!isActive && cyclesCompleted === 0) {
      toast.success(`Starting ${pattern.name}`, {
        description: 'Follow the breathing circle and instructions',
      });
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setTimeRemaining(pattern.phases[0].duration);
    setCyclesCompleted(0);
    toast('Exercise reset', { description: 'Ready to start again' });
  };

  const handlePatternChange = (newPattern: BreathingPattern) => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setCyclesCompleted(0);
    setTimeRemaining(newPattern.phases[0].duration);
    navigate(`/breathing?pattern=${newPattern.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/chat">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-light text-foreground">Breathing Exercises</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Main Exercise Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <Card className="w-full max-w-2xl shadow-soft border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-light">
                {pattern.icon} {pattern.name}
              </CardTitle>
              <CardDescription>{pattern.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Breathing Circle */}
              <div className="flex justify-center py-8">
                <BreathingCircle 
                  phase={currentPhase.type} 
                  duration={currentPhase.duration}
                />
              </div>

              {/* Instruction and Timer */}
              <div className="text-center space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhaseIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-2xl font-light text-foreground mb-2">
                      {currentPhase.instruction}
                    </p>
                    <p className="text-5xl font-extralight text-primary">
                      {timeRemaining}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <p className="text-sm text-muted-foreground">
                  Cycles completed: {cyclesCompleted}
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handleToggle}
                  className="rounded-full px-8"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {cyclesCompleted > 0 ? 'Resume' : 'Start'}
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-full px-8"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Benefits */}
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">Benefits:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {pattern.benefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pattern Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-light text-foreground mb-4">Other Techniques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {breathingPatterns
              .filter(p => p.id !== pattern.id)
              .map(p => (
                <Card
                  key={p.id}
                  className="cursor-pointer hover:shadow-lg transition-all border-border"
                  onClick={() => handlePatternChange(p)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <span className="text-2xl">{p.icon}</span>
                      {p.name}
                    </CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {p.totalDuration}s per cycle
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BreathingExercise;
