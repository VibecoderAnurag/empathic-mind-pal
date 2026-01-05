import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ExternalLink } from 'lucide-react';

interface MusicSuggestion {
  title: string;
  artist: string;
  type: string;
  description: string;
}

interface MusicCardProps {
  category: string;
  description: string;
  suggestions: MusicSuggestion[];
  onPlay?: (suggestion: MusicSuggestion) => void;
}

export const MusicCard = ({ category, description, suggestions, onPlay }: MusicCardProps) => {
  const handlePlay = (suggestion: MusicSuggestion) => {
    if (onPlay) {
      onPlay(suggestion);
    } else {
      // Default: open YouTube search
      const searchQuery = encodeURIComponent(`${suggestion.title} ${suggestion.artist}`);
      window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Music className="w-4 h-4 text-primary" />
          Music Suggestions
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{suggestion.title}</p>
              <p className="text-xs text-muted-foreground truncate">{suggestion.artist}</p>
            </div>
            <Button
              onClick={() => handlePlay(suggestion)}
              variant="ghost"
              size="sm"
              className="ml-2"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

