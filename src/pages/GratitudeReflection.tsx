import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const gratitudePrompts = [
  {
    title: 'Notice the Little Things',
    description: 'Write down three small moments from today that brought you comfort or joy.',
  },
  {
    title: 'Appreciate Someone',
    description: 'Who showed you kindness recently? Describe how their actions made you feel.',
  },
  {
    title: 'Celebrate Yourself',
    description: 'List two qualities or actions you appreciate about yourself right now.',
  },
];

const GratitudeReflection = () => {
  const [entries, setEntries] = useState<string[]>(() => gratitudePrompts.map(() => ''));

  const completedCount = entries.filter(entry => entry.trim().length > 0).length;
  const completionPercent = Math.round((completedCount / gratitudePrompts.length) * 100);

  const handleChange = (index: number, value: string) => {
    setEntries(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleReset = () => {
    setEntries(gratitudePrompts.map(() => ''));
    toast('Reflection reset', { description: 'Take your time and start again when ready.' });
  };

  const handleCelebrate = () => {
    toast.success('Reflection saved', {
      description: 'Beautiful work practicing gratitude. Notice how your mood feels right now. 💙',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/chat">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-light text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Gratitude Reflection
            </h1>
            <p className="text-sm text-muted-foreground">
              Slow down, breathe, and notice the good that is already here.
            </p>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto p-6 space-y-6"
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-primary flex items-center gap-2">
              Daily Gratitude Ritual
            </CardTitle>
            <CardDescription className="text-sm">
              Completing each prompt takes only a few minutes. Let this be a moment of calm just for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-3xl font-light text-foreground">{completionPercent}%</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleCelebrate}>
                Completed
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {gratitudePrompts.map((prompt, index) => (
            <Card key={prompt.title} className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <span className="text-xl">🙏</span>
                  {prompt.title}
                </CardTitle>
                <CardDescription>{prompt.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={entries[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Write from the heart... no pressure, no judgment."
                  rows={4}
                  className="bg-background"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GratitudeReflection;

