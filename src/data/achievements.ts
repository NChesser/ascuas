import type { Achievement } from '../types/types';

export const ACHIEVEMENTS: Achievement[] = [
  // --- Completion milestones ---
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first challenge',
    icon: '\u{1F331}',
    condition: (p) => p.completedChallenges.length >= 1,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Complete 5 challenges',
    icon: '\u{1F33F}',
    condition: (p) => p.completedChallenges.length >= 5,
  },
  {
    id: 'on-a-roll',
    title: 'On a Roll',
    description: 'Complete 10 challenges',
    icon: '\u{1F525}',
    condition: (p) => p.completedChallenges.length >= 10,
  },
  {
    id: 'halfway-hero',
    title: 'Halfway Hero',
    description: 'Complete 25 challenges',
    icon: '\u2B50',
    condition: (p) => p.completedChallenges.length >= 25,
  },
  {
    id: 'challenge-champion',
    title: 'Challenge Champion',
    description: 'Complete 50 challenges',
    icon: '\u{1F3C6}',
    condition: (p) => p.completedChallenges.length >= 50,
  },

  // --- Streak milestones ---
  {
    id: 'three-day-streak',
    title: 'Three-Day Streak',
    description: 'Complete challenges 3 days in a row',
    icon: '\u{1F525}',
    condition: (p) => (p.currentStreak ?? 0) >= 3,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Complete challenges 7 days in a row',
    icon: '\u{1F4AA}',
    condition: (p) => (p.currentStreak ?? 0) >= 7,
  },
  {
    id: 'fortnight-force',
    title: 'Fortnight Force',
    description: 'Complete challenges 14 days in a row',
    icon: '\u{1F31F}',
    condition: (p) => (p.currentStreak ?? 0) >= 14,
  },
  {
    id: 'monthly-master',
    title: 'Monthly Master',
    description: 'Complete challenges 30 days in a row',
    icon: '\u{1F451}',
    condition: (p) => (p.currentStreak ?? 0) >= 30,
  },

  // --- Level milestones ---
  {
    id: 'level-5',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: '\u2728',
    condition: (p) => p.level >= 5,
  },
  {
    id: 'level-10',
    title: 'Confident Climber',
    description: 'Reach level 10',
    icon: '\u{1F9D7}',
    condition: (p) => p.level >= 10,
  },
  {
    id: 'level-20',
    title: 'Social Butterfly',
    description: 'Reach level 20',
    icon: '\u{1F98B}',
    condition: (p) => p.level >= 20,
  },

  // --- Category exploration ---
  {
    id: 'category-explorer',
    title: 'Category Explorer',
    description: 'Complete a challenge from 4 different categories',
    icon: '\u{1F5FA}\uFE0F',
    condition: (p) => {
      const categories = new Set(
        p.logs
          .filter((l) => l.completed)
          .map((l) => l.challengeId.split('-')[0]),
      );
      return categories.size >= 4;
    },
  },

  // --- People milestones ---
  {
    id: 'first-friend',
    title: 'First Friend',
    description: 'Add your first person to People Met',
    icon: '\u{1F91D}',
    condition: (p) => p.peopleMet.length >= 1,
  },
  {
    id: 'social-circle',
    title: 'Social Circle',
    description: 'Meet 5 people',
    icon: '\u{1F465}',
    condition: (p) => p.peopleMet.length >= 5,
  },

  // --- Reflection milestones ---
  {
    id: 'deep-thinker',
    title: 'Deep Thinker',
    description: 'Write a reflection note on 5 challenges',
    icon: '\u{1F4DD}',
    condition: (p) =>
      p.logs.filter((l) => l.note && l.note.length > 0).length >= 5,
  },
  {
    id: 'journaler',
    title: 'Dedicated Journaler',
    description: 'Write a reflection note on 15 challenges',
    icon: '\u{1F4D6}',
    condition: (p) =>
      p.logs.filter((l) => l.note && l.note.length > 0).length >= 15,
  },

  // --- Courage milestones ---
  {
    id: 'brave-heart',
    title: 'Brave Heart',
    description: 'Complete a challenge rated 4+ discomfort',
    icon: '\u{1F49C}',
    condition: (_p, extra) =>
      extra?.lastCompletedDiscomfort !== undefined &&
      extra.lastCompletedDiscomfort >= 4,
  },
  {
    id: 'fearless',
    title: 'Fearless',
    description: 'Complete a challenge rated 5 discomfort',
    icon: '\u{1F981}',
    condition: (_p, extra) =>
      extra?.lastCompletedDiscomfort !== undefined &&
      extra.lastCompletedDiscomfort >= 5,
  },

  // --- Attempt milestones ---
  {
    id: 'showed-up',
    title: 'Showed Up',
    description: "Use 'I Tried Today' for the first time",
    icon: '\u{1FAF6}',
    condition: (p) =>
      p.logs.filter((l) => l.attempted && !l.completed).length >= 1,
  },
];
