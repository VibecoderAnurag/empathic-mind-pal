import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface InterventionStep {
  step: string;
}

interface InterventionCardProps {
  name: string;
  description: string;
  duration: number;
  steps: string[] | InterventionStep[];
  icon?: string;
  category?: string;
  targetRoute?: string;
  onStart?: () => void;
}

export const InterventionCard = ({ 
  name, 
  description, 
  duration, 
  steps, 
  icon = '🌿',
  category,
  targetRoute,
  onStart 
}: InterventionCardProps) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  
  const stepList = Array.isArray(steps) && steps.length > 0 && typeof steps[0] === 'object'
    ? (steps as InterventionStep[]).map(s => s.step)
    : (steps as string[]);

  const handleStart = () => {
    if (onStart) {
      onStart();
    } else if (targetRoute) {
      navigate(targetRoute);
    } else if (category === 'breathing') {
      // Navigate to breathing exercise with short mode
      navigate('/breathing?pattern=box&mode=quick');
    }
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow cursor-pointer" onClick={handleStart}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          {name}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{duration} seconds</span>
        </div>
        <Button 
          onClick={(e) => { e.stopPropagation(); setShowDetails(v => !v); }} 
          variant="ghost" 
          size="sm" 
          className="w-full"
        >
          {showDetails ? <ChevronUp className="w-3 h-3 mr-2" /> : <ChevronDown className="w-3 h-3 mr-2" />}
          {showDetails ? 'Hide steps' : 'Show steps'}
        </Button>

        {showDetails && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">How to do it:</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              {stepList.map((step, index) => (
                <li key={index} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={handleStart} size="sm" className="w-full" variant="default">
          <Play className="w-3 h-3 mr-2" />
          Start Now
        </Button>
      </CardContent>
    </Card>
  );
};

