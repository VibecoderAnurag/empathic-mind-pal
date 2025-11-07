import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodEntry } from '@/utils/moodStorage';
import { Emotion } from '@/utils/sentimentAnalysis';

interface MoodChartProps {
  entries: MoodEntry[];
}

export const MoodChart = ({ entries }: MoodChartProps) => {
  const emotionValues: Record<Emotion, number> = {
    happy: 5,
    excited: 4,
    neutral: 3,
    anxious: 2,
    sad: 1,
    angry: 1,
  };

  const chartData = entries.map((entry, index) => ({
    index: index + 1,
    mood: emotionValues[entry.emotion],
    date: new Date(entry.timestamp).toLocaleDateString(),
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="index" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            domain={[0, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--secondary))', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
