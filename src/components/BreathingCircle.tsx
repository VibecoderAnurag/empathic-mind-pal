import { motion } from 'framer-motion';

interface BreathingCircleProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'rest';
  duration: number;
}

export const BreathingCircle = ({ phase, duration }: BreathingCircleProps) => {
  const getScale = () => {
    if (phase === 'inhale') return 1.5;
    if (phase === 'exhale') return 0.7;
    return 1;
  };

  const getColor = () => {
    if (phase === 'inhale') return 'hsl(var(--primary))';
    if (phase === 'exhale') return 'hsl(var(--secondary))';
    return 'hsl(var(--accent))';
  };

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, ${getColor()} 0%, transparent 70%)`,
          opacity: 0.2,
        }}
        animate={{
          scale: phase === 'inhale' ? 1.3 : phase === 'exhale' ? 0.8 : 1,
        }}
        transition={{
          duration,
          ease: 'easeInOut',
        }}
      />

      {/* Main breathing circle */}
      <motion.div
        className="absolute rounded-full shadow-soft"
        style={{
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${getColor()}, ${getColor()} 60%)`,
        }}
        animate={{
          scale: getScale(),
        }}
        transition={{
          duration,
          ease: 'easeInOut',
        }}
      />

      {/* Inner light circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.8), transparent)',
        }}
        animate={{
          scale: phase === 'inhale' ? 1.8 : phase === 'exhale' ? 0.6 : 1,
          opacity: phase === 'hold' || phase === 'rest' ? 0.6 : 1,
        }}
        transition={{
          duration,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};
