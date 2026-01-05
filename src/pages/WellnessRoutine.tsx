import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const wellnessSteps = [
  {
    title: 'Check in with Yourself',
    description: 'Pause for a moment. Place a hand over your heart and acknowledge how you feel right now.',
  },
  {
    title: 'Mindful Breathing',
    description: 'For the next five breaths, inhale through your nose and exhale slowly through your mouth.',
  },
  {
    title: 'Gratitude Reflection',
    description: 'Name one thing you appreciate about today and one thing you appreciate about yourself.',
  },
  {
    title: 'Gentle Movement',
    description: 'Roll your shoulders, stretch your neck, or take a short walk around the room.',
  },
  {
    title: 'Self-Compassion Moment',
    description: 'Repeat to yourself: “I am doing the best I can today, and that is enough.”',
  },
];

const WellnessRoutine = () => {
  const [completed, setCompleted] = useState(() => wellnessSteps.map(() => false));

  const completedCount = useMemo(() => completed.filter(Boolean).length, [completed]);
  const completionPercent = Math.round((completedCount / wellnessSteps.length) * 100);

  const handleToggle = (index: number) => {
    setCompleted(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleReset = () => {
    setCompleted(wellnessSteps.map(() => false));
    toast('Routine reset', { description: 'Start again whenever you are ready.' });
  };

  const handleCelebrate = () => {
    toast.success('Routine complete', {
      description: 'Great job showing up for yourself. Take this calm with you. 💙',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/chat">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-light text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              General Wellness Routine
            </h1>
            <p className="text-sm text-muted-foreground">
              A gentle five-step practice to reconnect with your body, breath, and compassion.
            </p>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto p-6 space-y-6"
      >
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Your Wellness Snapshot</CardTitle>
            <CardDescription>Complete each mindful step at your own pace.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-3xl font-light text-foreground">{completionPercent}%</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleCelebrate} disabled={completedCount === 0}>
                Mark Complete
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {wellnessSteps.map((step, index) => (
            <Card key={step.title} className="border-border">
              <CardHeader className="flex flex-row items-start gap-4">
                <Checkbox
                  checked={completed[index]}
                  onCheckedChange={() => handleToggle(index)}
                  className="mt-1"
                />
                <div>
                  <CardTitle className="text-base font-medium">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WellnessRoutine;

