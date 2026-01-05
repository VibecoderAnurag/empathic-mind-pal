import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface AffirmationCardProps {
  affirmation: string;
  emotion?: string;
}

export const AffirmationCard = ({ affirmation, emotion }: AffirmationCardProps) => {
  return (
    <Card className="border-border bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Daily Affirmation
        </CardTitle>
        {emotion && (
          <CardDescription className="text-sm">
            For when you're feeling {emotion}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground italic">
          "{affirmation}"
        </p>
      </CardContent>
    </Card>
  );
};

