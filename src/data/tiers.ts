import type { TierRequirement } from '../types/types';

export const TIERS: TierRequirement[] = [
  {
    name: 'Seedling',
    emoji: '\u{1F331}',
    minLevel: 1,
    maxDiscomfort: 2,
    color: '#22c55e',
    bgColor: '#dcfce7',
    darkBgColor: 'rgba(34,197,94,0.15)',
  },
  {
    name: 'Sprout',
    emoji: '\u{1F33F}',
    minLevel: 3,
    maxDiscomfort: 3,
    color: '#3b82f6',
    bgColor: '#dbeafe',
    darkBgColor: 'rgba(59,130,246,0.15)',
  },
  {
    name: 'Bloom',
    emoji: '\u{1F338}',
    minLevel: 6,
    maxDiscomfort: 4,
    color: '#a855f7',
    bgColor: '#f3e8ff',
    darkBgColor: 'rgba(168,85,247,0.15)',
  },
  {
    name: 'Radiant',
    emoji: '\u{1F31F}',
    minLevel: 10,
    maxDiscomfort: 5,
    color: '#f59e0b',
    bgColor: '#fef3c7',
    darkBgColor: 'rgba(245,158,11,0.15)',
  },
];

export const getUserTier = (level: number): TierRequirement => {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (level >= TIERS[i].minLevel) return TIERS[i];
  }
  return TIERS[0];
};

export const getNextTier = (level: number): TierRequirement | null => {
  const current = getUserTier(level);
  const idx = TIERS.indexOf(current);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
};
