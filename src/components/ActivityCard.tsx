import { motion } from 'framer-motion';
import { Activity } from '@/utils/responseEngine';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

export const ActivityCard = ({ activity, onClick }: ActivityCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex-shrink-0 w-48 p-4 bg-gradient-card rounded-2xl shadow-soft border border-border hover:shadow-lg transition-all"
    >
      <div className="text-3xl mb-2">{activity.icon}</div>
      <p className="text-sm font-medium text-foreground">{activity.title}</p>
    </motion.button>
  );
};
