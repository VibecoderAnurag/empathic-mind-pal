import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface SuggestionCardProps {
  title: string;
  description?: string;
  icon?: string;
  action?: () => void;
  actionLabel?: string;
}

export const SuggestionCard = ({ 
  title, 
  description, 
  icon = '💡', 
  action,
  actionLabel = 'Try This'
}: SuggestionCardProps) => {
  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      {action && (
        <CardContent>
          <Button 
            onClick={action} 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            {actionLabel}
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

