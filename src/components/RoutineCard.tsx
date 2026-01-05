import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RoutineStep {
  step: string;
}

interface RoutineCardProps {
  name: string;
  description: string;
  duration: string;
  steps: string[] | RoutineStep[];
  icon?: string;
  routineKey?: string;
  onStart?: () => void;
}

export const RoutineCard = ({ 
  name, 
  description, 
  duration, 
  steps, 
  icon = '📋',
  routineKey,
  onStart 
}: RoutineCardProps) => {
  const navigate = useNavigate();
  const [showSteps, setShowSteps] = useState(false);

  const stepList = Array.isArray(steps) && steps.length > 0 && typeof steps[0] === 'object'
    ? (steps as RoutineStep[]).map(s => s.step)
    : (steps as string[]);

  const handleStart = () => {
    if (onStart) {
      onStart();
      return;
    }

    switch (routineKey) {
      case 'general_wellness':
        navigate('/wellness');
        break;
      case 'morning_boost':
        navigate('/wellness?focus=morning');
        break;
      case 'stress_relief':
        navigate('/wellness?focus=stress');
        break;
      case 'anxiety_cool_down':
        navigate('/breathing?pattern=box');
        break;
      case 'sleep_wind_down':
        navigate('/breathing?pattern=478');
        break;
      default:
        navigate('/wellness');
    }
  };

  return (
    <Card className="border-border">
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
          <span>{duration}</span>
        </div>
        <Button 
          onClick={() => setShowSteps(v => !v)}
          variant="ghost" 
          size="sm"
          className="w-full"
        >
          {showSteps ? <ChevronUp className="w-3 h-3 mr-2" /> : <ChevronDown className="w-3 h-3 mr-2" />}
          {showSteps ? 'Hide steps' : 'Show steps'}
        </Button>

        {showSteps && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Steps:</p>
            <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
              {stepList.map((step, index) => (
                <li key={index} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        <Button onClick={handleStart} size="sm" className="w-full">
          Start Routine
        </Button>
      </CardContent>
    </Card>
  );
};

