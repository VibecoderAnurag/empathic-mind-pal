export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  phases: {
    type: 'inhale' | 'hold' | 'exhale' | 'rest';
    duration: number;
    instruction: string;
  }[];
  totalDuration: number;
  benefits: string[];
}

export const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal breathing for balance and calm',
    icon: '⬜',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Breathe in slowly' },
      { type: 'hold', duration: 4, instruction: 'Hold your breath' },
      { type: 'exhale', duration: 4, instruction: 'Breathe out slowly' },
      { type: 'rest', duration: 4, instruction: 'Rest and pause' },
    ],
    totalDuration: 16,
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Dr. Weil\'s relaxing breath technique',
    icon: '🌙',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Breathe in through nose' },
      { type: 'hold', duration: 7, instruction: 'Hold gently' },
      { type: 'exhale', duration: 8, instruction: 'Exhale completely' },
    ],
    totalDuration: 19,
    benefits: ['Promotes sleep', 'Reduces anxiety', 'Natural tranquilizer'],
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    description: 'Extended exhale for relaxation',
    icon: '🌊',
    phases: [
      { type: 'inhale', duration: 4, instruction: 'Breathe in deeply' },
      { type: 'hold', duration: 2, instruction: 'Brief pause' },
      { type: 'exhale', duration: 6, instruction: 'Long, slow exhale' },
    ],
    totalDuration: 12,
    benefits: ['Activates relaxation', 'Lowers heart rate', 'Eases tension'],
  },
  {
    id: 'energize',
    name: 'Energizing Breath',
    description: 'Quick breathing to boost energy',
    icon: '⚡',
    phases: [
      { type: 'inhale', duration: 2, instruction: 'Quick inhale' },
      { type: 'hold', duration: 1, instruction: 'Brief hold' },
      { type: 'exhale', duration: 2, instruction: 'Quick exhale' },
    ],
    totalDuration: 5,
    benefits: ['Increases alertness', 'Boosts energy', 'Improves circulation'],
  },
  {
    id: 'deep',
    name: 'Deep Relaxation',
    description: 'Slow, deep breathing for peace',
    icon: '🧘',
    phases: [
      { type: 'inhale', duration: 5, instruction: 'Deep breath in' },
      { type: 'hold', duration: 5, instruction: 'Hold peacefully' },
      { type: 'exhale', duration: 5, instruction: 'Release fully' },
      { type: 'rest', duration: 3, instruction: 'Rest in stillness' },
    ],
    totalDuration: 18,
    benefits: ['Deep relaxation', 'Meditation support', 'Stress relief'],
  },
];
