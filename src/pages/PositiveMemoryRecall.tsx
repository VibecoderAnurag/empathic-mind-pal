import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const prompts = [
  {
    title: 'Replay a Happy Scene',
    description: 'Describe a moment when you felt deeply joyful or at peace. What were you doing? Who was there?',
  },
  {
    title: 'Remember the Details',
    description: 'What could you see, hear, or smell in that moment? The more specific, the better.',
  },
  {
    title: 'Hold the Feeling',
    description: 'How did that memory make you feel in your body? Where do you notice that feeling now?',
  },
];

const PositiveMemoryRecall = () => {
  const [entries, setEntries] = useState<string[]>(prompts.map(() => ''));

  const completed = entries.filter(entry => entry.trim().length > 0).length;
  const completionPercent = Math.round((completed / prompts.length) * 100);

  const handleChange = (index: number, value: string) => {
    setEntries(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    toast.success('Memory captured', {
      description: 'Return to this memory whenever you need a little light.',
    });
  };

  const handleReset = () => {
    setEntries(prompts.map(() => ''));
    toast('Reflection reset', { description: 'Take your time and revisit whenever you are ready.' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/chat">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-light text-foreground flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Positive Memory Recall
            </h1>
            <p className="text-sm text-muted-foreground">
              Revisit a comforting memory and let it fill your present moment.
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
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Memory Spotlight
            </CardTitle>
            <CardDescription>
              You only need a few minutes. Move through the prompts gently.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-3xl font-light text-foreground">{completionPercent}%</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button onClick={handleSave}>
                Save Memory
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {prompts.map((prompt, index) => (
            <Card key={prompt.title} className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">{prompt.title}</CardTitle>
                <CardDescription>{prompt.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={entries[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  rows={4}
                  placeholder="Let the memory unfold here..."
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PositiveMemoryRecall;

