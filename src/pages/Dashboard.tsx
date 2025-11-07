import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoodChart } from '@/components/MoodChart';
import { getRecentMoodEntries, getAverageMood } from '@/utils/moodStorage';
import { getEmotionEmoji } from '@/utils/sentimentAnalysis';

const Dashboard = () => {
  const recentEntries = getRecentMoodEntries(7);
  const averageMood = getAverageMood(recentEntries);

  const emotionCounts = recentEntries.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-light text-foreground">Your Mood Journey</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <Card className="shadow-soft border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Average Mood This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-light text-primary">{averageMood}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Based on {recentEntries.length} mood {recentEntries.length === 1 ? 'entry' : 'entries'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Emotion Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(emotionCounts).map(([emotion, count]) => (
                  <div key={emotion} className="flex items-center justify-between">
                    <span className="text-sm">
                      {getEmotionEmoji(emotion as any)} {emotion}
                    </span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(emotionCounts).length === 0 && (
                  <p className="text-sm text-muted-foreground">No data yet. Start chatting to track your mood!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-soft border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Mood Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {recentEntries.length > 0 ? (
                <MoodChart entries={recentEntries} />
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>Start sharing your feelings to see your mood trend</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-soft border-border bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg font-medium">MindEase Tip of the Day 💡</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">
                Remember: Your feelings are valid, and it's okay to have ups and downs. 
                Each day is a new opportunity for growth and self-discovery. Be kind to yourself. 💙
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
