import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { AffirmationCard } from './AffirmationCard';
import { MusicCard } from './MusicCard';
import { RoutineCard } from './RoutineCard';
import { InterventionCard } from './InterventionCard';
import { SuggestionCard } from './SuggestionCard';
import { EmotionResponseData } from '@/utils/emotionResponseApi';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface EmotionResponseDisplayProps {
  response: EmotionResponseData;
  emotion: string;
  onPlayMusic?: (suggestion: { title: string; artist: string; type: string; description: string }) => void;
}

export const EmotionResponseDisplay = ({ response, emotion, onPlayMusic }: EmotionResponseDisplayProps) => {
  const navigate = useNavigate();

  const toolLibrary: Record<string, {
    title: string;
    description: string;
    icon: string;
    actionLabel: string;
    onClick: () => void;
  }> = {
    gratitude_reflection: {
      title: 'Gratitude Reflection',
      description: 'Write down three things you appreciate right now.',
      icon: '🙏',
      actionLabel: 'Start Reflection',
      onClick: () => navigate('/gratitude'),
    },
    quick_gratitude: {
      title: 'Quick Gratitude Reset',
      description: 'Take 30 seconds to notice something good.',
      icon: '✨',
      actionLabel: 'Begin Reset',
      onClick: () => navigate('/gratitude'),
    },
    breathing_exercise: {
      title: 'Guided Breathing',
      description: 'Follow a calming breathing pattern.',
      icon: '🌬️',
      actionLabel: 'Open Breathing',
      onClick: () => navigate('/breathing?pattern=box'),
    },
    breathing_reset: {
      title: '10-Second Breathing Reset',
      description: 'A short breathing pause to steady yourself.',
      icon: '💨',
      actionLabel: 'Start Reset',
      onClick: () => navigate('/breathing?pattern=box&mode=quick'),
    },
    grounding_54321: {
      title: '5-4-3-2-1 Grounding',
      description: 'Use your senses to anchor into the present.',
      icon: '🌍',
      actionLabel: 'Begin Grounding',
      onClick: () => navigate('/wellness'),
    },
    calming_countdown: {
      title: 'Calming Countdown',
      description: 'A gentle 15-second countdown to pause and reset.',
      icon: '⏱️',
      actionLabel: 'Start Countdown',
      onClick: () => navigate('/wellness'),
    },
    shoulder_relaxation: {
      title: 'Shoulder Release',
      description: 'Melt away tension with simple stretches.',
      icon: '💆',
      actionLabel: 'Release Tension',
      onClick: () => navigate('/wellness'),
    },
    positive_memory_recall: {
      title: 'Positive Memory Recall',
      description: 'Reconnect with a memory that makes you smile.',
      icon: '💭',
      actionLabel: 'Recall Memory',
      onClick: () => navigate('/memory'),
    },
    gentle_movement: {
      title: 'Gentle Movement',
      description: 'Invite your body to stretch and unwind.',
      icon: '🧘',
      actionLabel: 'Stretch Now',
      onClick: () => navigate('/wellness'),
    },
    comforting_music: {
      title: 'Comforting Music',
      description: 'Listen to soothing sounds for a calm reset.',
      icon: '🎵',
      actionLabel: 'Open Playlist',
      onClick: () => window.open('https://www.youtube.com/results?search_query=calming+music', '_blank'),
    },
    general_wellness: {
      title: 'General Wellness Routine',
      description: 'Complete the 5-step wellness practice.',
      icon: '💙',
      actionLabel: 'View Routine',
      onClick: () => navigate('/wellness'),
    },
  };

  const formatToolName = (tool: string) => tool.replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="space-y-5">
      {/* Safety Override Alert */}
      {response.safe_override_if_any && (
        <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important Support Information</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>{response.safe_override_if_any.message}</p>
            {response.safe_override_if_any.recommendations && (
              <ul className="list-disc list-inside space-y-1 text-sm">
                {response.safe_override_if_any.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            )}
            {response.safe_override_if_any.hotline_info && (
              <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded border border-red-200 dark:border-red-800">
                <p className="font-medium text-sm mb-2">Crisis Resources:</p>
                {response.safe_override_if_any.hotline_info.US && (
                  <div className="text-sm space-y-1">
                    <p><strong>{response.safe_override_if_any.hotline_info.US.name}</strong></p>
                    <p>Phone: {response.safe_override_if_any.hotline_info.US.phone}</p>
                    <p>Text: {response.safe_override_if_any.hotline_info.US.text}</p>
                  </div>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Detected Summary + Supportive Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-2xl bg-card border"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Detected: {emotion}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{response.supportive_message}</p>
      </motion.div>

      {/* Suggested Actions */}
      {response.actions && response.actions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium mb-2 text-foreground">Suggested Actions:</h3>
          <div className="flex flex-wrap gap-2">
            {response.actions.slice(0, 6).map((action, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1">
                {action}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommended Tools */}
      {response.tools && response.tools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-sm font-medium mb-2 text-foreground">Recommended Tools:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {response.tools.slice(0, 3).map((tool) => {
              const details = toolLibrary[tool];
              if (!details) {
                return (
                  <SuggestionCard
                    key={tool}
                    title={formatToolName(tool)}
                    description="Open the MindEase toolkit to explore this suggestion."
                    icon="🧩"
                  />
                );
              }

              return (
                <SuggestionCard
                  key={tool}
                  title={details.title}
                  description={details.description}
                  icon={details.icon}
                  action={details.onClick}
                  actionLabel={details.actionLabel}
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Micro-Intervention */}
      {response.intervention && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium mb-2 text-foreground">Quick Intervention:</h3>
          <InterventionCard
            name={response.intervention.name}
            description={response.intervention.description}
            duration={response.intervention.duration}
            steps={response.intervention.steps}
            icon={response.intervention.icon}
            category={response.intervention.category}
            targetRoute={response.intervention.target_route}
          />
        </motion.div>
      )}

      {/* Affirmation */}
      {response.affirmation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AffirmationCard affirmation={response.affirmation} emotion={emotion} />
        </motion.div>
      )}

      {/* Music Suggestions */}
      {response.music && response.music.suggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MusicCard
            category={response.music.category}
            description={response.music.description}
            suggestions={response.music.suggestions}
            onPlay={onPlayMusic}
          />
        </motion.div>
      )}

      {/* Personalized Routine */}
      {response.routine && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-medium mb-2 text-foreground">Recommended Routine:</h3>
          <RoutineCard
            name={response.routine.name}
            description={response.routine.description}
            duration={response.routine.duration}
            steps={response.routine.steps}
            icon={response.routine.icon}
            routineKey={response.routine.key}
          />
        </motion.div>
      )}
    </div>
  );
};

